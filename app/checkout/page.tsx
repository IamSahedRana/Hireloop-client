import type { Metadata } from "next"
import Link from "next/link"
import { CircleCheck, LockKeyhole, ShieldCheck } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { formatPrice, getPlan } from "@/lib/plans"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"

export const metadata: Metadata = {
    title: "Checkout — HireLoop",
    description: "Secure checkout for your HireLoop Pro upgrade.",
}

type SearchParams = { searchParams: Promise<{ plan?: string; redirect?: string; canceled?: string; error?: string }> }

/**
 * Only same-origin relative paths may be used as the post-payment return
 * target (mirrors the API route's guard).
 */
function safeReturnPath(raw: string | undefined): string {
    if (!raw) return "/dashboard"
    if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/dashboard"
    return raw
}

export default async function CheckoutPage({ searchParams }: SearchParams) {
    const { plan: planId, redirect: rawRedirect, canceled, error } = await searchParams
    // the only purchasable plan is Pro; anything else resolves to Pro
    const plan = getPlan(planId) ?? getPlan("pro")!
    const returnTo = safeReturnPath(rawRedirect)

    // Real checkout = signed-in purchase; bounce to login and come straight back
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
        redirect(`/login?redirect=${encodeURIComponent(`/checkout?plan=${plan.id}&redirect=${returnTo}`)}`)
    }

    const billingHref = session.user.role === "recruiter" ? "/dashboard/recruiter/payments" : "/dashboard/seeker/billing"

    const banner = canceled
        ? {
              tone: "amber",
              title: "Checkout canceled",
              text: "You returned to Stripe's checkout without paying — no charge was made and your plan is unchanged.",
          }
        : error
          ? {
                tone: "red",
                title: "We couldn't start checkout",
                text: "Stripe didn't accept the session. Please try again — if it keeps failing, contact support.",
            }
          : null

    return (
        <div className="min-h-svh bg-[#08080a]">
            <SiteNavbar />

            <main className="mx-auto w-full max-w-[560px] px-4 py-10 sm:px-6">
                <Link href={billingHref} className="text-sm text-[#a0a0ab] transition-colors hover:text-white">
                    ← Back to billing
                </Link>

                <h1 className="mt-4 font-heading text-[28px] leading-tight font-semibold text-[#ededef]">Checkout</h1>
                <p className="mt-1 text-sm text-[#a0a0ab]">
                    Review your order, then complete payment on Stripe's secure page.
                </p>

                {banner && (
                    <div
                        role="status"
                        className={`mt-5 flex gap-3 rounded-xl border p-4 text-[13px] ${
                            banner.tone === "amber"
                                ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                                : "border-red-400/30 bg-red-400/10 text-red-200"
                        }`}
                    >
                        <span aria-hidden="true" className="mt-0.5 size-2 shrink-0 rounded-full bg-current" />
                        <p>
                            <span className="font-medium">{banner.title} — </span>
                            {banner.text}
                        </p>
                    </div>
                )}

                {/* Order summary */}
                <section className="mt-6 rounded-2xl bg-[#141418] p-6">
                    <h2 className="font-heading text-[22px] font-semibold text-[#ededef]">Order Summary</h2>

                    <div className="mt-5 flex items-start justify-between gap-4 border-b border-white/5 pb-5">
                        <div className="min-w-0">
                            <p className="text-[15px] font-medium text-[#ededef]">HireLoop {plan.name}</p>
                            <p className="mt-0.5 text-[13px] text-[#a0a0ab]">{plan.blurb}</p>
                        </div>
                        <p className="shrink-0 font-heading text-lg font-semibold text-[#ededef]">
                            {formatPrice(plan.price)}
                        </p>
                    </div>

                    <ul className="mt-5 flex flex-col gap-2.5">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-[#22c55e]" />
                                <span className="text-[13px] text-[#a0a0ab]">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                        <p className="text-[15px] font-medium text-[#ededef]">Total due today</p>
                        <p className="font-heading text-xl font-semibold text-[#ededef]">{formatPrice(plan.price)}</p>
                    </div>

                    {/* Native form POST → the 303 redirect sends the browser straight
                        to Stripe's hosted checkout (no JS needed, no CORS issues). */}
                    <form action="/api/checkout_sessions" method="post" className="mt-6">
                        <input type="hidden" name="plan" value={plan.id} />
                        {/* where to return after payment (e.g. the job the user was applying to) */}
                        <input type="hidden" name="redirect" value={returnTo} />
                        <button
                            type="submit"
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#fafafa] text-base font-medium text-[#0b0b0c] transition-colors hover:bg-white"
                        >
                            <LockKeyhole aria-hidden="true" className="size-4" />
                            Pay {formatPrice(plan.price)} with Stripe
                        </button>
                    </form>

                    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-[#a0a0ab]">
                        <ShieldCheck aria-hidden="true" className="size-3.5 text-[#22c55e]" />
                        Payments are processed securely by Stripe. We never see your card details.
                    </p>
                </section>

                <p className="mt-4 text-center text-xs text-[#6e6e78]">
                    Pro unlocks unlimited applications instantly — your contact details are taken from your HireLoop
                    account so Stripe can verify you.
                </p>
            </main>

            <SiteFooter />
        </div>
    )
}
