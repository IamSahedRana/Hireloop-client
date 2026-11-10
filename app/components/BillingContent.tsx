"use client"

import * as React from "react"
import { Check, CircleCheck, Download, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

// Surfaces from the `Seeker / Billing & Subscription` Figma frame:
// #141418 cards, #1a1a1f secondary buttons, #22c55e success green.
const cardClass = "rounded-2xl border border-white/5 bg-[#141418] p-6 sm:p-7"
const headingClass = "font-heading text-[22px] font-semibold text-[#ededef]"
const chipClass = "inline-flex h-[21px] items-center rounded-[4px] px-3 text-[11px] font-medium"

type Plan = {
    id: string
    name: string
    price: number
    blurb: string
    features: string[]
}

const PLANS: Plan[] = [
    {
        id: "starter",
        name: "Starter Tier",
        price: 0,
        blurb: "Get to know the platform with core job discovery.",
        features: ["10 Applications / month", "Basic job matching", "Email support"],
    },
    {
        id: "standard",
        name: "Standard Tier",
        price: 12,
        blurb: "Level up your search with insights and faster apply.",
        features: ["Unlimited Applications", "Premium Job Insights", "Priority Candidate Badge"],
    },
    {
        id: "professional",
        name: "Professional Tier",
        price: 29,
        blurb: "Unlock global job insights and unlimited applications.",
        features: [
            "Unlimited Applications",
            "Premium Job Insights",
            "Priority Candidate Badge",
            "Direct Recruiter Messaging",
        ],
    },
]

const STORAGE_KEY = "hireloop:plan"

function readStoredPlan(): Plan {
    if (typeof window === "undefined") return PLANS[2] // Figma default: Professional Tier
    const id = window.localStorage.getItem(STORAGE_KEY)
    return PLANS.find((plan) => plan.id === id) ?? PLANS[2]
}

function nextBillingDate() {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

/**
 * Sample invoices until the backend exposes a payments/invoices endpoint —
 * the rows mirror the Billing History table in the Figma frame.
 */
const SAMPLE_INVOICES = [
    { date: "Sep 24, 2023", plan: "Professional Tier", amount: "$29.00", trx: "TRX-948102-HL" },
    { date: "Aug 24, 2023", plan: "Professional Tier", amount: "$29.00", trx: "TRX-771920-HL" },
    { date: "Jul 24, 2023", plan: "Professional Tier", amount: "$29.00", trx: "TRX-331005-HL" },
    { date: "Jun 24, 2023", plan: "Standard Tier", amount: "$12.00", trx: "TRX-220199-HL" },
]

const thClass = "px-4 py-3.5 text-left text-[12px] font-medium text-[#6e6e78]"
const tdClass = "px-4 py-3.5 text-[13px] text-[#ededef]"

/**
 * Subscription & Billing page body (Figma `Seeker / Billing & Subscription`),
 * shared by the recruiter "Payments" and seeker "Billing" routes.
 */
export function BillingContent({ area = "seeker" }: { area?: "seeker" | "recruiter" }) {
    const { data: session } = authClient.useSession()
    const [current, setCurrent] = React.useState<Plan | null>(null)
    const [billingOn, setBillingOn] = React.useState<string | null>(null)

    // Read localStorage after mount so SSR markup stays stable.
    React.useEffect(() => {
        setCurrent(readStoredPlan())
        setBillingOn(nextBillingDate())
    }, [])

    const applyPlan = (plan: Plan) => {
        const wasUpgrade = current ? plan.price > current.price : true
        window.localStorage.setItem(STORAGE_KEY, plan.id)
        setCurrent(plan)
        toast.add({
            title: wasUpgrade ? "Plan upgraded" : "Plan updated",
            description: `You're now on the ${plan.name}${plan.price ? ` — $${plan.price}/mo` : " — free"}.`,
            type: "success",
        })
    }

    const plan = current ?? PLANS[2]
    const holder = (session?.user?.name || "HireLoop User").toUpperCase()

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <header className="flex flex-col gap-1.5">
                <h1 className="font-heading text-2xl leading-tight font-semibold text-[#ededef] sm:text-[32px]">
                    Subscription &amp; Billing
                </h1>
                <p className="text-[15px] text-[#a0a0ab] sm:text-base">
                    Manage your {area === "recruiter" ? "hiring tier" : "professional tier"} features, recurring
                    payments, and billing history.
                </p>
            </header>

            {/* Bento Layout for Plan & Stripe Card */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[642fr_452fr]">
                {/* Current Plan Card (Bento Large) */}
                <section className={cn(cardClass, "relative overflow-hidden")}>
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-10 right-10 size-40 rounded-full bg-white/[0.04] blur-2xl"
                    />
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="flex min-w-0 flex-col gap-2.5">
                            <span className={cn(chipClass, "w-fit bg-white text-[#6e6e78]")}>CURRENT PLAN</span>
                            <h2 className={headingClass}>{plan.name}</h2>
                            <p className="text-[13px] text-[#a0a0ab]">{plan.blurb}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <p className="flex items-start gap-1">
                                <span className="font-heading text-[26px] font-semibold text-[#ededef]">
                                    {plan.price ? `$${plan.price}` : "Free"}
                                </span>
                                {plan.price > 0 && (
                                    <span className="pt-1 text-base font-semibold text-[#a0a0ab]">/mo</span>
                                )}
                            </p>
                            <p className="text-xs whitespace-nowrap text-[#a0a0ab]">
                                {plan.price > 0 && billingOn ? `Next billing date: ${billingOn}` : "No recurring billing"}
                            </p>
                        </div>
                    </div>

                    <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <CircleCheck aria-hidden="true" className="size-5 shrink-0 text-[#22c55e]" />
                                <span className="text-[13px] text-[#ededef]">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
                        <PlanPickerDialog
                            plans={PLANS}
                            currentId={plan.id}
                            onSelect={applyPlan}
                            trigger={
                                <Button className="h-8 bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] hover:bg-white">
                                    Upgrade Plan
                                </Button>
                            }
                        />
                        <PlanPickerDialog
                            plans={PLANS}
                            currentId={plan.id}
                            onSelect={applyPlan}
                            trigger={
                                <Button className="h-8 border border-white/10 bg-[#1a1a1f] px-4 text-[13px] text-[#ededef] hover:bg-[#232327]">
                                    Manage Plan
                                </Button>
                            }
                        />
                    </div>
                </section>

                {/* Stripe Card Management (Bento Small) */}
                <section className={cardClass}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className={headingClass}>Payment Method</h2>
                        <span className={cn(chipClass, "border border-white/10 text-[#6e6e78]")}>
                            SECURE BY STRIPE
                        </span>
                    </div>

                    {/* Card UI */}
                    <div
                        aria-label="Saved payment card"
                        className="mt-6 flex flex-col justify-between gap-8 rounded-xl bg-[linear-gradient(135deg,#312e81_0%,#1e1b4b_55%,#0b0b0c_100%)] p-5 ring-1 ring-white/10"
                    >
                        <div className="flex items-center justify-between">
                            <span aria-hidden="true" className="h-8 w-12 rounded-md bg-[linear-gradient(135deg,#facc15,#d97706)]" />
                            <span className="text-[13px] font-semibold tracking-wide text-[#ededef] italic">VISA</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="font-heading text-[22px] font-semibold tracking-wide text-[#ededef]">
                                •••• •••• •••• 4242
                            </p>
                            <div className="flex items-end justify-between gap-6">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-medium tracking-wide text-[#a0a0ab]">
                                        CARD HOLDER
                                    </span>
                                    <span className="truncate text-[13px] text-[#ededef]">{holder}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[11px] font-medium tracking-wide text-[#a0a0ab]">EXPIRES</span>
                                    <span className="text-[13px] text-[#ededef]">12/29</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={() =>
                            toast.add({
                                title: "Stripe integration coming soon",
                                description: "Card management activates with the payments backend.",
                                type: "info",
                            })
                        }
                        className="mt-6 h-9 w-full border border-white/10 bg-[#1a1a1f] text-[13px] text-[#a0a0ab] hover:bg-[#232327] hover:text-[#ededef]"
                    >
                        <Plus aria-hidden="true" className="size-4" />
                        Add New Payment Method
                    </Button>
                </section>
            </div>

            {/* Section - Payment History Table */}
            <section className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                    <h2 className={headingClass}>Billing History</h2>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => window.print()}
                        className="h-8 gap-2 px-3 text-[13px] text-[#a0a0ab] hover:bg-white/5 hover:text-[#ededef]"
                    >
                        <Download aria-hidden="true" className="size-4" />
                        Export PDF
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-white/5 bg-[#141418]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left">
                            <thead>
                                <tr className="bg-[#1a1a1f]">
                                    <th scope="col" className={thClass}>Date</th>
                                    <th scope="col" className={thClass}>Plan</th>
                                    <th scope="col" className={thClass}>Amount</th>
                                    <th scope="col" className={thClass}>Transaction ID</th>
                                    <th scope="col" className={cn(thClass, "text-right")}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SAMPLE_INVOICES.map((invoice) => (
                                    <tr key={invoice.trx} className="border-t border-white/5">
                                        <td className={cn(tdClass, "whitespace-nowrap")}>{invoice.date}</td>
                                        <td className={tdClass}>{invoice.plan}</td>
                                        <td className={cn(tdClass, "whitespace-nowrap")}>{invoice.amount}</td>
                                        <td className={cn(tdClass, "font-mono text-xs whitespace-nowrap text-[#a0a0ab]")}>
                                            {invoice.trx}
                                        </td>
                                        <td className={cn(tdClass, "text-right")}>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#22c55e]">
                                                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#22c55e]" />
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section className={cn(cardClass, "flex flex-wrap items-center justify-between gap-6")}>
                <div className="flex max-w-lg flex-col gap-1.5">
                    <h2 className={headingClass}>Need help with your invoice?</h2>
                    <p className="text-[13px] text-[#a0a0ab]">
                        Our support team is available 24/7 to help you resolve any payment issues or clarify billing
                        details.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        type="button"
                        onClick={() =>
                            toast.add({
                                title: "Support chat coming soon",
                                description: "Reach us at support@hireloop.example in the meantime.",
                                type: "info",
                            })
                        }
                        className="h-8 border border-white/10 bg-[#1a1a1f] px-4 text-[13px] text-[#ededef] hover:bg-[#232327]"
                    >
                        Contact Support
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                            toast.add({
                                title: "Refund policy",
                                description: "Full refund within 14 days of a billing mistake.",
                                type: "info",
                            })
                        }
                        className="h-8 px-3 text-[13px] text-[#a0a0ab] hover:bg-white/5 hover:text-[#ededef]"
                    >
                        Read Refund Policy
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-[#a0a0ab]">
                <p>© {new Date().getFullYear()} HireLoop Inc. All rights reserved.</p>
                <p className="flex items-center gap-6">
                    <a href="https://example.com/terms" className="transition-colors hover:text-[#ededef]">Terms of Service</a>
                    <a href="https://example.com/privacy" className="transition-colors hover:text-[#ededef]">Privacy Policy</a>
                </p>
            </footer>
        </div>
    )
}

/** Plan chooser shown by both "Upgrade Plan" and "Manage Plan". */
function PlanPickerDialog({
    plans,
    currentId,
    onSelect,
    trigger,
}: {
    plans: Plan[]
    currentId: string
    onSelect: (plan: Plan) => void
    trigger: React.ReactElement
}) {
    return (
        <Dialog>
            <DialogTrigger render={trigger} />
            <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-left">Choose your plan</DialogTitle>
                    <DialogDescription className="text-left">
                        Switch anytime — changes apply to your next billing cycle.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-3">
                    {plans.map((plan) => {
                        const isCurrent = plan.id === currentId
                        return (
                            <button
                                key={plan.id}
                                type="button"
                                disabled={isCurrent}
                                onClick={() => onSelect(plan)}
                                className={cn(
                                    "flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors",
                                    isCurrent
                                        ? "border-[#5c53fe]/60 bg-[#5c53fe]/10"
                                        : "border-white/10 bg-[#0c0c0f] hover:border-white/25",
                                )}
                            >
                                <span className="text-sm font-medium text-[#ededef]">{plan.name}</span>
                                <span className="flex items-start gap-1">
                                    <span className="font-heading text-xl font-semibold text-[#ededef]">
                                        {plan.price ? `$${plan.price}` : "Free"}
                                    </span>
                                    {plan.price > 0 && <span className="text-xs text-[#a0a0ab]">/mo</span>}
                                </span>
                                <ul className="flex flex-col gap-1.5">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-1.5 text-xs text-[#a0a0ab]">
                                            <Check aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[#22c55e]" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <span
                                    className={cn(
                                        "mt-auto text-xs font-medium",
                                        isCurrent ? "text-[#8f88ff]" : "text-[#a0a0ab]",
                                    )}
                                >
                                    {isCurrent ? "Current plan" : "Switch to this plan"}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}
