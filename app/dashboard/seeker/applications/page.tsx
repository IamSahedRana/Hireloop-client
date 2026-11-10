import type { Metadata } from "next"
import Link from "next/link"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { ApplicationsTable } from "@/app/components/ApplicationsTable"
import { getApplications } from "@/lib/api/applications"

export const metadata: Metadata = {
    title: "My Applications — HireLoop",
}

export default async function SeekerApplicationsPage() {
    const applications = await getApplications()

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        My Applications
                    </h1>
                    <p className="text-sm text-white/60">
                        Track every role you've applied to and where it stands.
                    </p>
                </header>

                {applications.length === 0 ? (
                    <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                        <h2 className="font-heading text-lg font-semibold text-white">No applications yet</h2>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-white/60">
                            One-click apply activates with the applications backend. Browse live listings in the
                            meantime.
                        </p>
                        <Link
                            href="/dashboard/seeker/jobs"
                            className="mt-6 inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#7b74ff]"
                        >
                            Browse Jobs
                        </Link>
                    </section>
                ) : (
                    <ApplicationsTable rows={applications} />
                )}
            </div>
        </div>
    )
}
