import type { Metadata } from "next"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"

export const metadata: Metadata = {
    title: "Admin · Companies — HireLoop",
}

export default function AdminCompaniesPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <DashboardPageHeader
                    section="Admin"
                    title="Companies"
                    subtitle="Company profiles across the platform."
                />
                <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                    <h2 className="font-heading text-lg font-semibold text-white">Company management coming soon</h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-white/60">
                        Company profiles currently live on the recruiter's "My Company" page — a directory lands here
                        with the companies collection.
                    </p>
                </section>
            </div>
        </div>
    )
}
