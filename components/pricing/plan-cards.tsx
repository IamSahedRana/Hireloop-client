import Link from "next/link"
import { ArrowRight, Check, Zap } from "lucide-react"

import { PLANS, type Plan } from "@/lib/plans"
import { cn } from "@/lib/utils"

/**
 * The two real HireLoop tiers (Free / Pro $20) as cards. Shared by the
 * /pricing page and the homepage pricing section so the marketing surfaces
 * always match what checkout actually sells.
 */
export function PlanCards({ className }: { className?: string }) {
    return (
        <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2", className)}>
            {PLANS.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} highlighted={index === 1} />
            ))}
        </div>
    )
}

function PlanCard({ plan, highlighted }: { plan: Plan; highlighted?: boolean }) {
    const isPro = plan.price > 0
    return (
        <article
            data-slot="plan-card"
            className={cn(
                "flex flex-col rounded-[24px] p-6 text-left sm:p-7",
                highlighted
                    ? "rounded-[32px] bg-[#151516] shadow-[inset_0_0_60px_rgba(120,120,120,0.25)]"
                    : "bg-[#0c0c0f] ring-1 ring-white/[0.06]",
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#1c1c1d]">
                        <Zap aria-hidden="true" className="size-6 text-white" />
                    </span>
                    <h3 className="font-display text-2xl tracking-[-0.5px] text-white">{plan.name}</h3>
                </div>
                <p className="flex items-start gap-1.5">
                    <span className="font-display text-[40px] leading-[48px] font-semibold tracking-[-0.02em] text-white">
                        {plan.price ? `$${plan.price}` : "Free"}
                    </span>
                    {isPro && <span className="pt-4 font-inter-tight text-sm text-white">one-time</span>}
                </p>
            </div>

            <p className="mt-6 font-inter text-[15px] leading-[24px] text-white/80">{plan.blurb}</p>

            <ul className="mt-6 flex flex-col gap-4">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[#595959]">
                            <Check aria-hidden="true" className="size-4 text-white" />
                        </span>
                        <span className="font-inter text-base text-white">{feature}</span>
                    </li>
                ))}
            </ul>

            <Link
                href={isPro ? `/checkout?plan=${plan.id}` : "/register"}
                className={cn(
                    "mt-auto flex h-[55px] w-full items-center justify-between rounded-[12px] px-6 pt-0 text-[16px] font-semibold transition",
                    highlighted ? "mt-8 bg-white text-[#010103] hover:bg-white/90" : "bg-[#595959] text-white hover:bg-[#595959]/80",
                )}
            >
                {isPro ? "Upgrade to Pro — $20" : "Start Free"}
                <ArrowRight aria-hidden="true" className="size-6" />
            </Link>

            <p className="mt-4 text-center text-xs text-white/50">
                {isPro
                    ? "Secure Stripe checkout · unlimited applications forever"
                    : "No card required · upgrade only when you need more"}
            </p>
        </article>
    )
}
