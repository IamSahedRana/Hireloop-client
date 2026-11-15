import type { Metadata } from "next"
import Link from "next/link"
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react"

import { PlanCards } from "@/components/pricing/plan-cards"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"

export const metadata: Metadata = {
    title: "Pricing — HireLoop",
    description: "Two simple plans: Free (3 applications) and Pro ($20 one-time, unlimited applications).",
}

const faqs = [
    {
        q: "Is Pro a subscription?",
        a: "No — Pro is a one-time $20 payment. You keep unlimited applications forever, no recurring billing and no card stored for renewals.",
    },
    {
        q: "How many applications does the Free plan include?",
        a: "Three applications in total. After that, upgrade to Pro to keep applying — your existing applications stay exactly where they are.",
    },
    {
        q: "How is the payment handled?",
        a: "Checkout runs on Stripe's hosted page. Your HireLoop account details prefill the contact info, the payment is verified server-side, and your Pro access unlocks immediately.",
    },
]

export default function PricingPage() {
    return (
        <div className="min-h-svh bg-[#010103]">
            <SiteNavbar />

            <main className="px-4 pt-16 pb-20 sm:px-8">
                {/* header */}
                <header className="mx-auto flex max-w-[720px] flex-col items-center text-center">
                    <p className="flex items-center gap-4">
                        <span aria-hidden="true" className="size-2 rounded-full bg-[#5c53fe]" />
                        <span className="font-pixel text-[20px] leading-6 text-white">Pricing</span>
                        <span aria-hidden="true" className="size-2 rounded-full bg-[#5c53fe]" />
                    </p>
                    <h1 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.02em] text-white md:text-[48px]">
                        Two plans. Zero surprises.
                    </h1>
                    <p className="mt-4 font-heading text-base text-white/80 md:text-lg">
                        Start free and apply to three roles. When you're ready to accelerate, Pro unlocks unlimited
                        applications for a single $20 payment.
                    </p>
                </header>

                {/* plans */}
                <div className="mx-auto mt-12 w-full max-w-[960px]">
                    <PlanCards />
                </div>

                {/* trust row */}
                <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2">
                        <LockKeyhole aria-hidden="true" className="size-4 text-[#22c55e]" />
                        Stripe-secured checkout
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <ShieldCheck aria-hidden="true" className="size-4 text-[#22c55e]" />
                        Payment verified server-side
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <CreditCard aria-hidden="true" className="size-4 text-[#22c55e]" />
                        No recurring billing
                    </span>
                </div>

                {/* FAQs */}
                <section aria-label="Pricing questions" className="mx-auto mt-20 w-full max-w-[720px]">
                    <h2 className="text-center font-heading text-[28px] font-semibold text-white">
                        Pricing questions
                    </h2>
                    <ul className="mt-8 flex flex-col gap-4">
                        {faqs.map((faq) => (
                            <li key={faq.q} className="rounded-2xl bg-[#0c0c0f] p-6 ring-1 ring-white/[0.06]">
                                <h3 className="font-heading text-[17px] font-semibold text-[#ededef]">{faq.q}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#a0a0ab]">{faq.a}</p>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-10 text-center text-sm text-white/60">
                        Questions about billing?{" "}
                        <Link href="/dashboard/seeker/billing" className="text-[#8f88ff] underline-offset-4 hover:underline">
                            Manage it from your dashboard
                        </Link>{" "}
                        or reach us at support@hireloop.example.
                    </p>
                </section>
            </main>

            <SiteFooter />
        </div>
    )
}
