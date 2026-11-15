/**
 * Subscription tiers shared by BillingContent, the checkout page and the
 * Stripe checkout session (Figma `Seeker / Billing & Subscription`).
 */
export type PlanId = "starter" | "standard" | "professional"

export type Plan = {
    id: PlanId
    name: string
    /** Monthly price in USD; 0 = free tier. */
    price: number
    blurb: string
    features: string[]
}

export const PLANS: Plan[] = [
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

export function getPlan(id: string | null | undefined): Plan | undefined {
    return PLANS.find((plan) => plan.id === id)
}

/** "$29.00" — used on checkout/success surfaces. */
export function formatPrice(amount: number, currency = "usd"): string {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(
        amount,
    )
}
