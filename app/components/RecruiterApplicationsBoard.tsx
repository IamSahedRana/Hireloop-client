"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { toast } from "@/components/ui/toast"
import { updateApplicationStatus, type ApplicationRow, type ApplicationStatus } from "@/lib/api/applications"
import { cn } from "@/lib/utils"

const STATUSES: ApplicationStatus[] = ["New", "Interviewing", "Reviewing", "Rejected"]

// Status chip colors lifted from the Figma `Recruiter / Dashboard` table
const statusStyles: Record<ApplicationStatus, string> = {
    New: "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/25",
    Interviewing: "text-[#8f88ff] bg-[#8f88ff]/10 border-[#8f88ff]/30",
    Reviewing: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25",
    Rejected: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/25",
}

const headings = ["Candidate Name", "Role", "Date Applied", "Experience", "Status"] as const
const colVis = [
    "", // candidate name always visible
    "hidden sm:table-cell", // role
    "hidden md:table-cell", // date
    "hidden lg:table-cell", // experience
    "", // status always visible
]
const headerClass = "px-4 py-3 text-[11px] font-medium text-[#6e6e78]"

function formatAppliedAt(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value || "—"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export type BoardJob = { _id: string; title: string }

/**
 * Recruiter "Applications" board:
 * - job filter chips (view applications by job)
 * - status dropdown per row that PATCHes the new status to the database
 */
export function RecruiterApplicationsBoard({
    jobs,
    applications,
    selectedJobId,
}: {
    jobs: BoardJob[]
    applications: ApplicationRow[]
    selectedJobId?: string
}) {
    const router = useRouter()
    // optimistic status state so the select reacts instantly; keyed by application id
    const [statuses, setStatuses] = React.useState<Record<string, ApplicationStatus>>(() =>
        Object.fromEntries(applications.map((row) => [row._id, row.status])),
    )
    const [savingId, setSavingId] = React.useState<string | null>(null)

    async function handleStatusChange(row: ApplicationRow, next: ApplicationStatus) {
        const previous = statuses[row._id]
        if (next === previous) return
        setSavingId(row._id)
        setStatuses((prev) => ({ ...prev, [row._id]: next }))
        const result = await updateApplicationStatus(row._id, next)
        setSavingId(null)
        if (result.ok) {
            toast.add({ title: "Status updated", description: `${row.candidateName} → ${next}.`, type: "success" })
            router.refresh() // keep dashboard stats in sync with the database
        } else {
            setStatuses((prev) => ({ ...prev, [row._id]: previous })) // roll back on failure
            toast.add({ title: "Update failed", description: result.message ?? "The backend rejected the change.", type: "error" })
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Job filter — `Recruiter view application by job` */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium tracking-wide text-white/50 uppercase">Filter by job</span>
                <Link
                    href="/dashboard/recruiter/applications"
                    className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                        !selectedJobId
                            ? "border-[#8f88ff]/40 bg-[#8f88ff]/15 text-[#b7b2ff]"
                            : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white",
                    )}
                >
                    All jobs
                </Link>
                {jobs.map((job) => {
                    const active = selectedJobId === job._id
                    return (
                        <Link
                            key={job._id}
                            href={`/dashboard/recruiter/applications?job=${job._id}`}
                            className={cn(
                                "max-w-[240px] truncate rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                                active
                                    ? "border-[#8f88ff]/40 bg-[#8f88ff]/15 text-[#b7b2ff]"
                                    : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white",
                            )}
                        >
                            {job.title}
                        </Link>
                    )
                })}
            </div>

            <div
                data-slot="applications-table"
                className="overflow-hidden rounded-xl border border-white/5 bg-[#141418] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left">
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
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={headings.length} className="px-4 py-12 text-center">
                                        <p className="text-sm text-[#a0a0ab]">No applications yet</p>
                                        <p className="mt-1 text-xs text-[#6e6e78]">
                                            {selectedJobId
                                                ? "No candidate has applied to this job yet."
                                                : "Applications to your job posts will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            )}
                            {applications.map((row, index) => (
                                <tr
                                    key={row._id || index}
                                    className="border-t border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.02]"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <span
                                                aria-hidden="true"
                                                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-[13px] font-medium text-[#a1a4aa]"
                                            >
                                                {(row.candidateName.trim().charAt(0) || "·").toUpperCase()}
                                            </span>
                                            <span className="truncate text-[13px] font-medium text-[#ededef]">
                                                {row.candidateName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={cn("px-4 py-3 text-[13px] text-[#a0a0ab]", colVis[1])}>{row.role}</td>
                                    <td className={cn("px-4 py-3 text-[13px] whitespace-nowrap text-[#a0a0ab]", colVis[2])}>
                                        {formatAppliedAt(row.dateApplied)}
                                    </td>
                                    <td className={cn("px-4 py-3 text-[13px] whitespace-nowrap text-[#a0a0ab]", colVis[3])}>
                                        {row.experience}
                                    </td>
                                    <td className="px-4 py-3">
                                        {/* Status selector — saving the change straight to the database */}
                                        <select
                                            aria-label={`Status for ${row.candidateName}`}
                                            value={statuses[row._id] ?? row.status}
                                            disabled={savingId === row._id}
                                            onChange={(event) =>
                                                handleStatusChange(row, event.target.value as ApplicationStatus)
                                            }
                                            className={cn(
                                                "h-[22px] cursor-pointer appearance-none rounded-full border px-2.5 pr-6 text-[12px] font-medium outline-none disabled:opacity-60",
                                                statusStyles[statuses[row._id] ?? row.status],
                                            )}
                                            style={{
                                                backgroundImage:
                                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a0a0ab' stroke-width='3'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "right 7px center",
                                            }}
                                        >
                                            {STATUSES.map((status) => (
                                                <option key={status} value={status} className="bg-[#1A1A1F] text-white">
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
