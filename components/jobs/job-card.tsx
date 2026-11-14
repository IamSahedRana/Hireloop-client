import Link from "next/link"
import { Banknote, Clock3 } from "lucide-react"

import type { Job } from "@/lib/types/job"
import { formatCompensation } from "@/lib/types/job"
import { SaveJobButton } from "@/app/components/SaveJobButton"

const chipClass =
    "inline-flex h-[30px] items-center gap-1.5 rounded-md bg-[#1a1a1f] px-3 text-[13px] text-[#ededef]"

/**
 * Figma "Article - Job Card" from the Public / Browse Jobs frame:
 * logo block, 22px title (links to the job details page), "Company •
 * Location" line, info chips and a single ghost save icon top-right.
 */
export function JobCard({ job }: { job: Job }) {
    const initial = (job.companyName || "?").trim().charAt(0).toUpperCase()
    // "Dhaka (Remote)" reads better than "Remote (Remote)" for remote listings
    const locationLabel = job.isRemote
        ? job.location && job.location.toLowerCase() !== "remote"
            ? `${job.location} (Remote)`
            : "Remote"
        : job.location

    return (
        <article className="flex gap-5 rounded-xl bg-[#141418] p-6">
            <div
                aria-hidden="true"
                className="grid size-16 shrink-0 place-items-center rounded-lg bg-[#222228] text-xl font-semibold text-white/80"
            >
                {initial}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate font-heading text-[22px] leading-7 font-semibold text-[#ededef]">
                            <Link href={`/browse-jobs/${job._id}`} className="transition-colors hover:text-white">
                                {job.title}
                            </Link>
                        </h3>
                        <p className="mt-1 truncate text-base text-[#6e6e78]">
                            {job.companyName} • {locationLabel}
                        </p>
                    </div>
                    <SaveJobButton
                        jobId={job._id}
                        title={job.title}
                        icon="bookmark"
                        variant="ghost"
                        className="size-10 shrink-0"
                    />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <span className={chipClass}>
                        <Banknote aria-hidden="true" className="size-3.5 text-[#e5e2e3]" />
                        {formatCompensation(job)}
                    </span>
                    <span className={`${chipClass} capitalize`}>
                        <Clock3 aria-hidden="true" className="size-3.5 text-[#e5e2e3]" />
                        {job.jobType}
                    </span>
                </div>
            </div>
        </article>
    )
}
