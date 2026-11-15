/**
 * Subscription tiers shared by BillingContent, the checkout page and the
 * Stripe checkout session. HireLoop has exactly two tiers:
 * Free (limited applications) and Pro ($20, unlimited applications).
 */
export type PlanId = "free" | "pro"

export type Plan = {
    id: PlanId
    name: string
    /** One-time price in USD; 0 = free tier. */
    price: number
    blurb: string
    features: string[]
}

export const PLANS: Plan[] = [
    {
        id: "free",
        name: "Free Plan",
        price: 0,
        blurb: "Get to know the platform with core job discovery.",
        features: ["3 Applications", "Basic job matching", "Email support"],
    },
    {
        id: "pro",
        name: "Pro Plan",
        price: 20,
        blurb: "Unlimited applications and priority visibility for your profile.",
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

/** "$20.00" — used on checkout/success surfaces. */
export function formatPrice(amount: number, currency = "usd"): string {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(
        amount,
    )
}
