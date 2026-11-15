import type { Metadata } from "next"
import Link from "next/link"
import { CircleCheck, CircleAlert, Clock3 } from "lucide-react"

import { stripe } from "@/lib/stripe"
import { recordPayment } from "@/lib/api/payments"
import { formatPrice, getPlan } from "@/lib/plans"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { SuccessReturn } from "@/components/checkout/success-return"

export const metadata: Metadata = {
    title: "Payment successful — HireLoop",
}

type SearchParams = { searchParams: Promise<{ session_id?: string; redirect?: string }> }

/**
 * Stripe redirects here with `?session_id=…`. The session is verified
 * server-side (never trust the redirect alone): only `payment_status`
 * "paid" unlocks the confirmation. The payment is then persisted by the
 * Express backend, which re-verifies the session against Stripe with its
 * own secret key — the URL alone can never mark an account as paid.
 */
export default async function CheckoutSuccessPage({ searchParams }: SearchParams) {
    const { session_id: sessionId, redirect: rawRedirect } = await searchParams

    // same-origin relative return target only (mirrors the API route's guard)
    const returnTo =
        rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("\\")
            ? rawRedirect
            : "/dashboard"

    let status: "paid" | "processing" | "invalid" = "invalid"
    let planName: string | null = null
    let amount: number | null = null
    let currency = "usd"
    let sessionIdShort: string | null = null
    let paidAt: string | null = null
    let stored = false

    if (sessionId) {
        try {
            const checkout = await stripe.checkout.sessions.retrieve(sessionId)
            sessionIdShort = checkout.id.slice(-12).toUpperCase()
            planName = "Pro Plan"
            amount = checkout.amount_total ?? null
            currency = checkout.currency ?? "usd"
            paidAt = new Date(checkout.created * 1000).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })
            if (checkout.payment_status === "paid") {
                status = "paid"
                // Persist in MongoDB — the backend re-verifies the session with
                // its own Stripe secret key and credits the buyer from the
                // session metadata. Idempotent, so refreshing is safe.
                const recorded = await recordPayment(sessionId)
                stored = recorded.ok
            } else {
                status = "processing"
            }
        } catch {
            status = "invalid"
        }
    }

    return (
        <div className="min-h-svh bg-[#08080a]">
            <SiteNavbar />

            <main className="mx-auto w-full max-w-[560px] px-4 py-12 sm:px-6">
                {status === "paid" ? (
                    <section className="rounded-2xl bg-[#141418] p-8 text-center">
                        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#22c55e]/15">
                            <CircleCheck aria-hidden="true" className="size-8 text-[#22c55e]" />
                        </span>
                        <h1 className="mt-5 font-heading text-[28px] leading-tight font-semibold text-[#ededef]">
                            Payment successful!
                        </h1>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-[#a0a0ab]">
                            Thanks for your purchase — your Pro Plan is active and unlimited applications are
                            unlocked. A receipt has been emailed to you by Stripe.
                        </p>

                        {/* receipt-style summary */}
                        <dl className="mt-7 rounded-xl bg-[#0c0c0f] p-5 text-left">
                            <div className="flex items-center justify-between border-b border-white/5 py-2.5">
                                <dt className="text-[13px] text-[#a0a0ab]">Plan</dt>
                                <dd className="text-[13px] font-medium text-[#ededef]">{planName}</dd>
                            </div>
                            {amount != null && (
                                <div className="flex items-center justify-between border-b border-white/5 py-2.5">
                                    <dt className="text-[13px] text-[#a0a0ab]">Amount paid</dt>
                                    <dd className="text-[13px] font-medium text-[#ededef]">
                                        {formatPrice(amount / 100, currency.toUpperCase())}
                                    </dd>
                                </div>
                            )}
                            <div className="flex items-center justify-between border-b border-white/5 py-2.5">
                                <dt className="text-[13px] text-[#a0a0ab]">Date</dt>
                                <dd className="text-[13px] text-[#ededef]">{paidAt}</dd>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 py-2.5">
                                <dt className="text-[13px] text-[#a0a0ab]">Payment status</dt>
                                <dd>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#22c55e]">
                                        <span aria-hidden="true" className="size-1.5 rounded-full bg-[#22c55e]" />
                                        Paid
                                    </span>
                                </dd>
                            </div>
                            <div className="flex items-center justify-between border-b border-white/5 py-2.5">
                                <dt className="text-[13px] text-[#a0a0ab]">Saved to account</dt>
                                <dd>
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                            stored ? "text-[#22c55e]" : "text-amber-300"
                                        }`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`size-1.5 rounded-full ${stored ? "bg-[#22c55e]" : "bg-amber-300"}`}
                                        />
                                        {stored ? "Yes" : "Pending"}
                                    </span>
                                </dd>
                            </div>
                            {sessionIdShort && (
                                <div className="flex items-center justify-between py-2.5">
                                    <dt className="text-[13px] text-[#a0a0ab]">Session</dt>
                                    <dd className="font-mono text-xs text-[#a0a0ab]">…{sessionIdShort}</dd>
                                </div>
                            )}
                        </dl>

                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                href={returnTo}
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white"
                            >
                                Continue where you left off
                            </Link>
                            <Link
                                href="/dashboard"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a1f] px-4 text-[13px] text-[#ededef] transition-colors hover:bg-[#232327]"
                            >
                                Go to Dashboard
                            </Link>
                        </div>

                        {/* toasts + returns the user to where they were */}
                        <SuccessReturn returnTo={returnTo} />
                    </section>
                ) : status === "processing" ? (
                    <section className="rounded-2xl bg-[#141418] p-8 text-center">
                        <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-400/15">
                            <Clock3 aria-hidden="true" className="size-8 text-amber-300" />
                        </span>
                        <h1 className="mt-5 font-heading text-[28px] leading-tight font-semibold text-[#ededef]">
                            Payment processing
                        </h1>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-[#a0a0ab]">
                            We've received your checkout but the payment hasn't cleared yet. Refresh this page in a
                            moment or check your billing page.
                        </p>
                        <Link
                            href="/dashboard"
                            className="mt-7 inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a1f] px-4 text-[13px] text-[#ededef] transition-colors hover:bg-[#232327]"
                        >
                            Go to Dashboard
                        </Link>
                    </section>
                ) : (
                    <section className="rounded-2xl bg-[#141418] p-8 text-center">
                        <span className="mx-auto grid size-14 place-items-center rounded-full bg-red-400/15">
                            <CircleAlert aria-hidden="true" className="size-8 text-red-400" />
                        </span>
                        <h1 className="mt-5 font-heading text-[28px] leading-tight font-semibold text-[#ededef]">
                            We couldn't verify this payment
                        </h1>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-[#a0a0ab]">
                            This payment link is missing or has expired. If you were charged, check your billing page
                            or contact support with your Stripe receipt.
                        </p>
                        <Link
                            href="/checkout?plan=pro"
                            className="mt-7 inline-flex h-10 items-center justify-center rounded-lg bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white"
                        >
                            Back to Checkout
                        </Link>
                    </section>
                )}
            </main>

            <SiteFooter />
        </div>
    )
}
