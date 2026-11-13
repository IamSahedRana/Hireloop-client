import type { Metadata } from "next"

import { getJobs } from "@/lib/api/jobs"
import type { Job } from "@/lib/types/job"
import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { JobListingCard } from "@/app/components/JobListingCard"

export const metadata: Metadata = {
    title: "Browse Jobs — HireLoop",
}

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
                            <li key={job._id}>
                                <JobListingCard job={job} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
