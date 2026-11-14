/**
 * Applications. The Express backend stores one document per application:
 * `{ userId, jobId, candidateName, jobTitle, companyName, status, appliedAt }`.
 * The same docs feed the seeker's "My Applications" list, the recruiter
 * table and the "already applied" check on the job details page.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type ApplicationStatus = "New" | "Interviewing" | "Reviewing" | "Rejected"

const STATUSES: ApplicationStatus[] = ["New", "Interviewing", "Reviewing", "Rejected"]

export type Application = {
    _id: string
    userId: string
    jobId: string
    candidateName: string
    jobTitle: string
    companyName: string
    status: ApplicationStatus
    /** ISO timestamp the list is sorted by. */
    appliedAt: string
}

function normalize(item: Record<string, unknown>): Application {
    const status = String(item.status ?? "New")
    return {
        _id: String(item._id ?? ""),
        userId: String(item.userId ?? ""),
        jobId: String(item.jobId ?? ""),
        candidateName: String(item.candidateName ?? ""),
        jobTitle: String(item.jobTitle ?? item.role ?? ""),
        companyName: String(item.companyName ?? ""),
        status: (STATUSES.includes(status as ApplicationStatus) ? status : "New") as ApplicationStatus,
        appliedAt: String(item.appliedAt ?? item.dateApplied ?? ""),
    }
}

/** `GET /applications` — optionally narrowed to one applicant. */
export async function fetchApplications(filters: { applicantId?: string } = {}): Promise<Application[]> {
    const params = new URLSearchParams()
    if (filters.applicantId) params.set("applicantId", filters.applicantId)
    const query = params.toString()
    try {
        const res = await fetch(`${BASE_URL}/applications${query ? `?${query}` : ""}`, { cache: "no-store" })
        if (!res.ok) return []
        const data = await res.json()
        if (!Array.isArray(data)) return []
        return data
            .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
            .map(normalize)
            .sort((a, b) => (a.appliedAt < b.appliedAt ? 1 : -1))
    } catch {
        return []
    }
}

/** `POST /applications` — one-click apply for a signed-in candidate. */
export async function createApplication(input: {
    userId: string
    jobId: string
    jobTitle: string
    companyName: string
    candidateName: string
}): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/applications`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...input, status: "New", appliedAt: new Date().toISOString() }),
        })
        return res.ok
    } catch {
        return false
    }
}

/** Recruiter table shape (legacy view over the same documents). */
export type ApplicationRow = {
    _id: string
    candidateName: string
    role: string
    dateApplied: string
    experience: string
    status: ApplicationStatus
}

export async function getApplications(): Promise<ApplicationRow[]> {
    const applications = await fetchApplications()
    return applications.map((app) => ({
        _id: app._id,
        candidateName: app.candidateName,
        role: app.jobTitle,
        dateApplied: app.appliedAt,
        experience: "—",
        status: app.status,
    }))
}
