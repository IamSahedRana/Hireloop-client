import { MapPin } from "lucide-react"

import type { Job } from "@/lib/types/job"
import { formatCompensation, formatDeadline } from "@/lib/types/job"
import { ApplyJobButton } from "@/app/components/ApplyJobButton"
import { SaveJobButton } from "@/app/components/SaveJobButton"
import { ViewJobDialog } from "@/app/components/ViewJobDialog"

const cardClass =
    "rounded-xl border border-white/5 bg-[#141418] p-5 transition-colors hover:border-white/15 " +
    "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"

/**
 * Job listing card shared by the seeker "Browse Jobs" and "Saved Jobs" grids:
 * title/company header with save star, meta row, and actions footer.
 */
export function JobListingCard({ job }: { job: Job }) {
    return (
        <article className={cardClass}>
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
        </article>
    )
}
