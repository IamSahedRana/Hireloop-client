import type { Metadata } from "next"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"

export const metadata: Metadata = {
    title: "Admin · Payments — HireLoop",
}

export default function AdminPaymentsPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <DashboardPageHeader
                    section="Admin"
                    title="Payments"
                    subtitle="Subscriptions and transactions across the platform."
                />
                <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                    <h2 className="font-heading text-lg font-semibold text-white">Payments oversight coming soon</h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-white/60">
                        Once Stripe is connected to the backend, plan revenue and transaction history appear here.
                    </p>
                </section>
            </div>
        </div>
    )
}
