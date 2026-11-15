import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { getPlan, type PlanId } from '@/lib/plans'
import { stripe } from '@/lib/stripe'

// Professional Tier lives as a one-time $29 price in the Stripe dashboard;
// overridable via env for other Stripe accounts/mode switches.
const PROFESSIONAL_PRICE_ID = process.env.STRIPE_PRICE_ID ?? 'price_1UbxR9FryRrT9G9CVeL1ZlOI'

async function readPlanId(request: Request): Promise<PlanId | undefined> {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      return getPlan(typeof body?.plan === 'string' ? body.plan : undefined)?.id
    }
    const form = await request.formData()
    const plan = form.get('plan')
    return getPlan(typeof plan === 'string' ? plan : undefined)?.id
  } catch {
    return undefined
  }
}

export async function POST(request: Request) {
  const headersList = await headers()
  const origin = headersList.get('origin')

  try {
    const plan = getPlan(await readPlanId(request)) ?? getPlan('professional')!

    // Stamp who is buying so the success page / records can be tied to a user
    const userSession = await auth.api.getSession({ headers: headersList })

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        plan.id === 'professional'
          ? {
              // Pre-configured product/price from the Stripe dashboard
              price: PROFESSIONAL_PRICE_ID,
              quantity: 1,
            }
          : {
              quantity: 1,
              price_data: {
                currency: 'usd',
                unit_amount: plan.price * 100,
                product_data: { name: `HireLoop ${plan.name}` },
              },
            },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Real-world checkout: backing out returns to the summary, no charge made
      cancel_url: `${origin}/checkout?canceled=1&plan=${plan.id}`,
      metadata: {
        planId: plan.id,
        userId: userSession?.user?.id ?? '',
      },
    })
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error('An unknown error occurred')
    console.error('Stripe checkout failed:', error.message)
    // Send the user back to the summary with a visible error instead of raw JSON
    return NextResponse.redirect(`${origin}/checkout?error=1`, 303)
  }
}
