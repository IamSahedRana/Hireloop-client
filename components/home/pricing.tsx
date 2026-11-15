import * as React from "react"

import { SectionHeader } from "@/components/home/section-header"
import { PlanCards } from "@/components/pricing/plan-cards"
import { cn } from "@/lib/utils"

/**
 * Homepage pricing — the same two real tiers the /pricing page and Stripe
 * checkout sell (Free / Pro $20), so marketing and checkout never disagree.
 */
export function Pricing({ className }: React.ComponentProps<"section">) {
    return (
        <section id="pricing" className={cn("px-4 py-[88px] sm:px-8 lg:py-[120px]", className)} data-slot="pricing">
            <div className="mx-auto w-full max-w-[1320px]">
                <SectionHeader badge="Pricing" title="Pay for the leverage, not the listings" />

                <div className="mx-auto mt-12 w-full max-w-[960px]">
                    <PlanCards />
                </div>
            </div>
        </section>
    )
}
