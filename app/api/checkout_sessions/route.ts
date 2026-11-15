import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

// Pro is a one-time $20 payment, created with price_data so it always matches
// the plan shown on the site (no dashboard price to keep in sync).
const PRO_PRICE = 2000

async function readParams(request: Request): Promise<{ plan?: string; redirect?: string }> {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      return { plan: body?.plan, redirect: body?.redirect }
    }
    const form = await request.formData()
    const plan = form.get('plan')
    const redirect = form.get('redirect')
    return {
      plan: typeof plan === 'string' ? plan : undefined,
      redirect: typeof redirect === 'string' ? redirect : undefined,
    }
  } catch {
    return {}
  }
}

/**
 * Only same-origin relative paths may be used as the post-payment return
 * target — an absolute or protocol-relative value would bounce the user
 * off-site (open redirect).
 */
function safeReturnPath(raw: string | undefined): string {
  if (!raw) return '/dashboard'
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) return '/dashboard'
  return raw
}

export async function POST(request: Request) {
  const headersList = await headers()
  const origin = headersList.get('origin')

  try {
    const { plan: planId, redirect: rawRedirect } = await readParams(request)
    // the only purchasable plan is Pro; anything else is ignored
    if (planId !== 'pro') {
      return NextResponse.redirect(`${origin}/checkout?error=1`, 303)
    }
    const returnTo = safeReturnPath(rawRedirect)

    // Stamp who is buying (checkout prefills + payment record binding)
    const userSession = await auth.api.getSession({ headers: headersList })
    const user = userSession?.user
    if (!user) {
      // signed-out purchase attempt → login first, then back to checkout
      return NextResponse.redirect(`${origin}/login?redirect=${encodeURIComponent('/checkout?plan=pro')}`, 303)
    }

    // Real-world checkout: the payer's contact info is attached up front so
    // Stripe prefills (and the email is verified against) the account.
    const customers = await stripe.customers.list({ email: user.email, limit: 1 })
    const customer =
      customers.data[0] ??
      (await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      }))

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      // prefill/lock the contact info so the payment is tied to this account
      customer_update: { name: 'never', address: 'never' },
      phone_number_collection: { enabled: false },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: PRO_PRICE,
            product_data: { name: 'HireLoop Pro Plan' },
          },
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&redirect=${encodeURIComponent(returnTo)}`,
      // Real-world checkout: backing out returns to the summary, no charge made
      cancel_url: `${origin}/checkout?canceled=1&plan=pro&redirect=${encodeURIComponent(returnTo)}`,
      metadata: {
        planId: 'pro',
        userId: user.id,
        returnTo,
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
