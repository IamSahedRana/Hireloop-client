// Shared contract between the "Post a New Job" form, the jobs table and the
// backend (NEXT_PUBLIC_API_BASE_URL). The flat field names mirror both the Figma
// layer names (isRemote, deadline, minSalary…) and what `POST /jobs` stores.

export type JobType = "full-time" | "part-time" | "contract" | "internship"

/** Options shared by the "Post a New Job" form and the browse-jobs filters. */
export const JOB_TYPES: JobType[] = ["full-time", "part-time", "contract", "internship"]

/** Categories shared by the "Post a New Job" form and the browse-jobs filters. */
export const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design",
    "Product",
    "Marketing",
    "Infrastructure",
    "Quality",
]

export type JobFormData = {
    title: string
    companyName: string
    category: string
    jobType: JobType
    isRemote: boolean
    location: string
    deadline: string
    minSalary: string
    maxSalary: string
    salaryFrequency: string
    responsibilities: string
    requirements: string
}

export type JobStatus = "active" | "expired"

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

/** Mongo document (raw JSON from the Express API) → the shape the UI renders. */
export type Job = JobFormData & {
    _id: string
    applicants: number
    status: JobStatus
    /** Relative "Posted 4d ago" label derived from createdAt / _id / updatedAt. */
    posted: string
}

/**
 * A job is "active" while the application deadline is still in the future.
 * Jobs without a deadline never expire, so they stay active too.
 */
export function deriveStatus(deadline: string | undefined | null): JobStatus {
    if (!deadline) return "active"
    const raw = String(deadline)
    const asDate = new Date(ISO_DATE.test(raw) ? `${raw.slice(0, 10)}T23:59:59` : raw)
    if (Number.isNaN(asDate.getTime())) return "active"
    return asDate.getTime() < Date.now() ? "expired" : "active"
}

/** "25", "40", "per hour" → "€25 – €40 / hr" (as in the Figma rows). */
export function formatCompensation(job: Pick<JobFormData, "minSalary" | "maxSalary" | "salaryFrequency">) {
    const frequency = String(job.salaryFrequency || "").replace("per ", "")
    const unit =
        { hour: "hr", day: "day", week: "wk", month: "mo", year: "yr" }[frequency] ?? frequency
    return `€${job.minSalary} – €${job.maxSalary} / ${unit}`
}

/** "2025-05-30" → "May 30, 2025". Fixed en-US so SSR and client agree. */
export function formatDeadline(deadline: string | undefined | null) {
    if (!deadline) return "—"
    const raw = String(deadline)
    // plain YYYY-MM-DD so the calendar date survives any local timezone
    const asDate = new Date(ISO_DATE.test(raw) ? `${raw.slice(0, 10)}T12:00:00` : raw)
    if (Number.isNaN(asDate.getTime())) return "—"
    return asDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

/** Mongo `createdAt`, `updatedAt` or the ObjectId's embedded timestamp → "Posted 4d ago". */
export function timeAgoLabel(value: string | Date | undefined | null, prefix = "Posted") {
    let date = value instanceof Date ? value : new Date(value ?? "")
    // _id's first 8 hex characters carry the creation timestamp —
    // that's the only source we can trust when createdAt/updatedAt are missing
    if (!value || Number.isNaN(date.getTime())) {
        const hex = typeof value === "string" ? value : String(value ?? "")
        if (/^[a-f\d]{24}$/i.test(hex)) date = new Date(parseInt(hex.slice(0, 8), 16) * 1000)
    }
    if (Number.isNaN(date.getTime())) return prefix
    const diffMs = Date.now() - date.getTime()
    const days = Math.floor(diffMs / 86_400_000)
    if (days > 30) {
        const months = Math.floor(days / 30)
        return `${prefix} ${months}mo ago`
    }
    if (days >= 1) return `${prefix} ${days}d ago`
    const hours = Math.max(1, Math.floor(diffMs / 3_600_000))
    return `${prefix} ${hours}h ago`
}

/** Anything the backend returns (raw Mongo doc) → Job. Missing fields get safe defaults. */
export function normalizeJob(raw: Record<string, unknown>): Job {
    const str = (key: keyof JobFormData) =>
        typeof raw[key] === "string" ? (raw[key] as string) : String(raw[key] ?? "")
    const deadline = str("deadline")
    const updatedAt = (raw.updatedAt ?? raw.createdAt) as string | undefined
    // newest first: use updatedAt, then createdAt, then the _id's embedded timestamp
    const recencySource = (updatedAt ?? String(raw._id ?? "")) || undefined
    return {
        title: str("title"),
        companyName: str("companyName"),
        category: str("category"),
        jobType: str("jobType") as JobType,
        isRemote: raw.isRemote === true || raw.isRemote === "true",
        location: str("location"),
        deadline,
        minSalary: str("minSalary"),
        maxSalary: str("maxSalary"),
        salaryFrequency: str("salaryFrequency") || "per hour",
        responsibilities: str("responsibilities"),
        requirements: str("requirements"),
        _id: (raw._id as string) ?? "",
        applicants: typeof raw.applicants === "number" ? (raw.applicants as number) : 0,
        status: deriveStatus(deadline),
        posted: timeAgoLabel(recencySource),
    }
}
