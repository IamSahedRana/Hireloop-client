import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Bookmark, FileText, Briefcase } from "lucide-react"

import { auth } from "@/lib/auth"
import { getJobs } from "@/lib/api/jobs"
import { fetchApplications } from "@/lib/api/applications"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { SavedJobsCount } from "@/components/shared/saved-jobs-count"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "Seeker Dashboard — HireLoop",
}

const statCardClass =
    "flex flex-col rounded-xl p-6 min-h-[166px] bg-[#141418] " +
    "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]"
const statTileClass = "flex size-10 items-center justify-center rounded-[10px] bg-[#222228]"

export default async function SeekerDashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login?redirect=/dashboard/seeker")

    const jobs = await getJobs()
    const activeJobs = jobs.filter((job) => job.status === "active").length
    const applications = await fetchApplications({ applicantId: session.user.id })

    const stats = [
        { label: "Open Roles", value: activeJobs as ReactNode, Icon: Briefcase },
        { label: "My Applications", value: applications.length as ReactNode, Icon: FileText },
        { label: "Saved Jobs", value: <SavedJobsCount />, Icon: Bookmark },
    ]

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <h1 className="font-heading text-[22px] font-semibold text-[#ededef]">
                    Welcome back, {session.user.name}
                </h1>

                <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
                    {stats.map(({ label, value, Icon }) => (
                        <div key={label} className={statCardClass}>
                            <span className={statTileClass}>
                                <Icon aria-hidden="true" className="size-5 text-[#e5e2e3]" />
                            </span>
                            <dt className="mt-5 text-[13px] text-[#a0a0ab]">{label}</dt>
                            <dd className="mt-auto pt-4 font-inter text-[26px] font-semibold text-[#ededef]">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#141418] p-6 sm:p-7">
                    <div className="flex flex-col gap-1.5">
                        <h2 className="font-heading text-[22px] font-semibold text-[#ededef]">
                            {activeJobs > 0 ? `${activeJobs} new role${activeJobs === 1 ? "" : "s"} waiting` : "Your next role is out there"}
                        </h2>
                        <p className="text-[13px] text-[#a0a0ab]">
                            Browse live listings, star the interesting ones and apply in one click.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/seeker/jobs"
                        className={cn(
                            "inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#7b74ff]",
                        )}
                    >
                        Browse Jobs
                    </Link>
                </section>
            </div>
        </div>
    )
}
