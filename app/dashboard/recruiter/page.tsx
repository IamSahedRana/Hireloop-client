import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Briefcase, Archive, FileText, Plus, Users } from "lucide-react"

import { auth } from "@/lib/auth"
import { getJobs } from "@/lib/api/jobs"
import { getApplications } from "@/lib/api/applications"
import { ApplicationsTable } from "@/app/components/ApplicationsTable"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "Recruiter Dashboard — HireLoop",
}

// `Section - Stats Row` cards: #141418, 40px icon tile #222228, 13px label
// #a0a0ab, 26px Inter SemiBold value #ededef.
const statCardClass =
    "flex flex-col rounded-xl p-6 min-h-[166px] bg-[#141418] " +
    "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]"
const statTileClass = "flex size-10 items-center justify-center rounded-[10px] bg-[#222228]"
const sectionHeading = "font-inter text-[22px] font-semibold text-[#ededef]"

export default async function RecruiterDashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login?redirect=/dashboard/recruiter")

    const [jobs, applications] = await Promise.all([getJobs(), getApplications()])

    const totals = {
        posts: jobs.length,
        applicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
        active: jobs.filter((job) => job.status === "active").length,
        closed: jobs.filter((job) => job.status === "expired").length,
    }

    const stats = [
        { label: "Total Job Posts", value: totals.posts, Icon: Briefcase },
        { label: "Total Applicants", value: totals.applicants, Icon: Users },
        { label: "Active Jobs", value: totals.active, Icon: FileText },
        { label: "Jobs Closed", value: totals.closed, Icon: Archive },
    ]

    return (
        <div className="flex h-svh flex-col overflow-hidden">
            <DashboardTopBar />

            {/* scrollable content column */}
            <div className="flex-1 overflow-y-auto px-4 pb-24 sm:px-6 lg:px-8">
                {/* Welcome header */}
                <h1 className={cn(sectionHeading, "pt-6")}>
                    Welcome back, {session.user.name}
                </h1>

                {/* Stats row */}
                <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {stats.map(({ label, value, Icon }) => (
                        <div key={label} className={cn(statCardClass, "text-left")}>
                            <span className={statTileClass}>
                                <Icon aria-hidden="true" className="size-5 text-[#e5e2e3]" />
                            </span>
                            <dt className="mt-5 text-[13px] text-[#a0a0ab]">{label}</dt>
                            <dd className="mt-auto pt-4 font-inter text-[26px] font-semibold text-[#ededef]">
                                {value.toLocaleString("en-US")}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* Recent applications (2/3 split in the frame, full width on smaller screens) */}
                <section className="mt-8">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className={sectionHeading}>Recent Applications</h2>
                        <Link
                            href="/dashboard/recruiter/applications"
                            className="text-[13px] text-[#ededef] underline-offset-4 hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <ApplicationsTable rows={applications.slice(0, 4)} className="mt-6" />
                </section>
            </div>

            {/* Floating Action Button - Contextual */}
            <Link
                href="/dashboard/recruiter/jobs/new"
                className="group fixed right-4 bottom-4 z-30 flex items-center sm:right-6 sm:bottom-6"
            >
                <span className="flex min-h-[30px] items-center rounded-lg bg-[#fafafa] px-3 text-[13px] font-medium text-[#0b0b0c] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-sm:hidden">
                    Create Job Post
                </span>
                <span className="ml-3 flex size-14 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform group-hover:scale-105">
                    <Plus aria-hidden="true" className="size-[18px] text-[#101010]" strokeWidth={2.5} />
                </span>
            </Link>
        </div>
    )
}
