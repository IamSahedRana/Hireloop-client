import { cn } from "@/lib/utils"
import type { ApplicationRow } from "@/lib/api/applications"

const statusStyles: Record<ApplicationRow["status"], string> = {
    New: "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/25",
    Interviewing: "text-[#8f88ff] bg-[#8f88ff]/10 border-[#8f88ff]/30",
    Reviewing: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25",
    Rejected: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/25",
}

export function ApplicationStatusPill({ status }: { status: ApplicationRow["status"] }) {
    return (
        <span
            className={cn(
                "inline-flex h-[22px] items-center rounded-full border px-2.5 text-[12px] font-medium",
                statusStyles[status],
            )}
        >
            {status}
        </span>
    )
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

/**
 * `Section - Recent Applications` table from the Recruiter / Dashboard frame:
 * #141418 card, #1a1a1f header row, 13px rows with 32px candidate avatars.
 */
export function ApplicationsTable({ rows, className }: { rows: ApplicationRow[]; className?: string }) {
    return (
        <div
            data-slot="applications-table"
            className={cn("overflow-hidden rounded-xl border border-white/5 bg-[#141418]", "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]", className)}
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
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={headings.length} className="px-4 py-12 text-center">
                                    <p className="text-sm text-[#a0a0ab]">No applications yet</p>
                                    <p className="mt-1 text-xs text-[#6e6e78]">
                                        When the API starts returning applications they will appear here.
                                    </p>
                                </td>
                            </tr>
                        )}
                        {rows.map((row, index) => (
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
                                <td className={cn("px-4 py-3 text-[13px] text-[#a0a0ab]", colVis[1])}>
                                    {row.role}
                                </td>
                                <td className={cn("px-4 py-3 text-[13px] whitespace-nowrap text-[#a0a0ab]", colVis[2])}>
                                    {row.dateApplied}
                                </td>
                                <td className={cn("px-4 py-3 text-[13px] whitespace-nowrap text-[#a0a0ab]", colVis[3])}>
                                    {row.experience}
                                </td>
                                <td className="px-4 py-3">
                                    <ApplicationStatusPill status={row.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
