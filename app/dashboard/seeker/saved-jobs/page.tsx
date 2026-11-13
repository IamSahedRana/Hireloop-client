"use client"

import * as React from "react"
import Link from "next/link"
import { Bookmark } from "lucide-react"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { JobListingCard } from "@/app/components/JobListingCard"
import { readSavedJobIds } from "@/app/components/SaveJobButton"
import { getJobs } from "@/lib/api/jobs"
import type { Job } from "@/lib/types/job"

/** Saved Jobs — jobs starred on the Browse Jobs page (localStorage-backed). */
export default function SeekerSavedJobsPage() {
    // getJobs works client-side too — the Express API allows cross-origin reads.
    const [allJobs, setAllJobs] = React.useState<Job[] | null>(null)
    const [savedIds, setSavedIds] = React.useState<string[]>([])

    React.useEffect(() => {
        setSavedIds(readSavedJobIds())
        void getJobs().then(setAllJobs)
    }, [])

    const jobs = (allJobs ?? []).filter((job) => savedIds.includes(job._id))

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        Saved Jobs
                    </h1>
                    <p className="text-sm text-white/60">Your shortlist — starred listings live here.</p>
                </header>

                {allJobs === null ? (
                    <p className="py-16 text-center text-sm text-[#a0a0ab]">Loading saved jobs…</p>
                ) : jobs.length === 0 ? (
                    <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                        <Bookmark aria-hidden="true" className="mx-auto size-6 text-white/40" />
                        <h2 className="mt-3 font-heading text-lg font-semibold text-white">No saved jobs yet</h2>
                        <p className="mt-1 text-sm text-white/60">
                            Star a listing on the Browse Jobs page and it will show up here.
                        </p>
                        <Link
                            href="/dashboard/seeker/jobs"
                            className="mt-6 inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#7b74ff]"
                        >
                            Browse Jobs
                        </Link>
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
