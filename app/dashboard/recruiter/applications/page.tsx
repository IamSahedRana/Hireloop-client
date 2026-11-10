import type { Metadata } from "next"

import { ApplicationsTable } from "@/app/components/ApplicationsTable"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { getApplications } from "@/lib/api/applications"

export const metadata: Metadata = {
    title: "Applications — HireLoop",
}

export default async function RecruiterApplicationsPage() {
    const applications = await getApplications()

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                {/* Same breadcrumb pattern as the Manage Jobs page */}
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <span className="text-white/50">Applications</span>
                    <span aria-hidden className="text-white/30">/</span>
                    <span className="text-white/90">All Applications</span>
                </nav>

                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        Applications
                    </h1>
                    <p className="text-sm text-white/60">
                        Every candidate that applied across your job posts, newest first.
                    </p>
                </header>

                <ApplicationsTable rows={applications} />
            </div>
        </div>
    )
}
