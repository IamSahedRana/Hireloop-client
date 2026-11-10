import type { Metadata } from "next"

import { BillingContent } from "@/app/components/BillingContent"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"

export const metadata: Metadata = {
    title: "Billing & Subscription — HireLoop",
}

export default function SeekerBillingPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <BillingContent area="seeker" />
            </div>
        </div>
    )
}
