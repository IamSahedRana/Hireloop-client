import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { fetchApplications, type Application } from "@/lib/api/applications"
import { ApplicationStatusPill } from "@/app/components/ApplicationsTable"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "My Applications — HireLoop",
}

/** ISO timestamp → "Nov 14, 2026" (falls back to the raw value). */
function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value || "—"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const headings = ["Role", "Company", "Date Applied", "Status"] as const
const colVis = [
    "", // role always visible
    "hidden sm:table-cell", // company
    "hidden md:table-cell", // date
    "", // status always visible
]
const headerClass = "px-4 py-3 text-[11px] font-medium text-[#6e6e78]"

export default async function SeekerApplicationsPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login?redirect=/dashboard/seeker/applications")

    const applications = await fetchApplications({ applicantId: session.user.id })

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
                            When you apply to a job it shows up here with its current status.
                        </p>
                        <Link
                            href="/dashboard/seeker/jobs"
                            className="mt-6 inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#7b74ff]"
                        >
                            Browse Jobs
                        </Link>
                    </section>
                ) : (
                    <ApplicationsCard applications={applications} />
                )}
            </div>
        </div>
    )
}

/**
 * Seeker's applications table: role, company, when it was applied and the
 * current status. Follows the recruiter table's dark card styling.
 */
function ApplicationsCard({ applications }: { applications: Application[] }) {
    return (
        <div
            data-slot="applications-table"
            className={cn(
                "overflow-hidden rounded-xl border border-white/5 bg-[#141418]",
                "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]",
            )}
        >
            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left">
                    <thead>
                        <tr className="bg-[#1a1a1f]">
                            {headings.map((heading, index) => (
                                <th key={heading} scope="col" className={cn(headerClass, colVis[index])}>
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application, index) => (
                            <tr
                                key={application._id || index}
                                className="border-t border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.02]"
                            >
                                <td className="px-4 py-3">
                                    <span className="block truncate text-[13px] font-medium text-[#ededef]">
                                        {application.jobTitle}
                                    </span>
                                </td>
                                <td className={cn("px-4 py-3 text-[13px] text-[#a0a0ab]", colVis[1])}>
                                    {application.companyName}
                                </td>
                                <td className={cn("px-4 py-3 text-[13px] whitespace-nowrap text-[#a0a0ab]", colVis[2])}>
                                    {formatDate(application.appliedAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <ApplicationStatusPill status={application.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
