/**
 * Recruiter applications. The backend (NEXT_PUBLIC_API_BASE_URL) is a flat
 * Express API today — there is no `GET /applications` yet, so this resolves to
 * an empty list and the UI shows its "no applications" state. As soon as the
 * endpoint exists the tables fill without further changes.
 */
export type ApplicationRow = {
    _id: string
    candidateName: string
    role: string
    dateApplied: string
    experience: string
    status: "New" | "Interviewing" | "Reviewing" | "Rejected"
}

export async function getApplications(): Promise<ApplicationRow[]> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
    try {
        const res = await fetch(`${BASE_URL}/applications`, { cache: "no-store" })
        if (!res.ok) return []
        const data = await res.json()
        if (!Array.isArray(data)) return []
        return data
            .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
            .map((item) => ({
                _id: String(item._id ?? ""),
                candidateName: String(item.candidateName ?? item.name ?? ""),
                role: String(item.role ?? ""),
                dateApplied: String(item.dateApplied ?? ""),
                experience: String(item.experience ?? ""),
                status: (["New", "Interviewing", "Reviewing", "Rejected"].includes(String(item.status))
                    ? String(item.status)
                    : "New") as ApplicationRow["status"],
            }))
            .sort((a, b) => (a.dateApplied < b.dateApplied ? 1 : -1))
    } catch {
        return []
    }
}
