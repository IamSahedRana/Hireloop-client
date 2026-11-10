import type { Metadata } from "next"

import { BillingContent } from "@/app/components/BillingContent"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"

export const metadata: Metadata = {
    title: "Payments — HireLoop",
}

export default function RecruiterPaymentsPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <BillingContent area="recruiter" />
            </div>
        </div>
    )
}
