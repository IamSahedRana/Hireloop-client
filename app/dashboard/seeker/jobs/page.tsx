import type { Metadata } from "next"

import { MapPin } from "lucide-react"
import { getJobs } from "@/lib/api/jobs"
import { formatCompensation, formatDeadline, type Job } from "@/lib/types/job"
import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { ApplyJobButton } from "@/app/components/ApplyJobButton"
import { SaveJobButton } from "@/app/components/SaveJobButton"
import { ViewJobDialog } from "@/app/components/ViewJobDialog"

export const metadata: Metadata = {
    title: "Browse Jobs — HireLoop",
}

const cardClass =
    "rounded-xl border border-white/5 bg-[#141418] p-5 transition-colors hover:border-white/15 " +
    "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"

export default async function SeekerJobsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams
    const query = (q ?? "").trim().toLowerCase()
    const allJobs: Job[] = await getJobs()
    const jobs = query
        ? allJobs.filter((job) =>
            `${job.title} ${job.companyName} ${job.category} ${job.location}`.toLowerCase().includes(query),
        )
        : allJobs

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <DashboardPageHeader
                    section="Jobs"
                    title="Browse Jobs"
                    subtitle="Every live listing on HireLoop — save the interesting ones for later."
                />

                {query && (
                    <p className="mb-4 text-sm text-white/60">
                        Filtering by “{q}” — {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                    </p>
                )}

                {jobs.length === 0 ? (
                    <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                        <h2 className="font-heading text-lg font-semibold text-white">
                            {query ? "No matches" : "No jobs yet"}
                        </h2>
                        <p className="mt-1 text-sm text-white/60">
                            {query ? `Nothing matches “${q}”. Try another term.` : "Recruiters haven't posted any jobs yet."}
                        </p>
                    </section>
                ) : (
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {jobs.map((job) => (
                            <li key={job._id} className={cardClass}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 flex-col gap-1">
                                        <h3 className="truncate text-[15px] font-semibold text-[#ededef]">{job.title}</h3>
                                        <p className="truncate text-[13px] text-[#a0a0ab]">
                                            {job.companyName} · {job.category}
                                        </p>
                                    </div>
                                    <SaveJobButton jobId={job._id} title={job.title} />
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#a0a0ab]">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin aria-hidden="true" className="size-3.5" />
                                        {job.isRemote ? `Remote (${job.location})` : job.location}
                                    </span>
                                    <span className="capitalize">{job.jobType}</span>
                                    <span className="whitespace-nowrap text-[#ededef]">{formatCompensation(job)}</span>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                                    <span className="text-xs whitespace-nowrap text-[#6e6e78]">
                                        Apply by {formatDeadline(job.deadline)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <ViewJobDialog job={job} />
                                        <ApplyJobButton title={job.title} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
