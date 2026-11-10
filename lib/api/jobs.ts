import { normalizeJob, type Job, type JobFormData } from "@/lib/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Server-side reads for the recruiter pages (server components).
 * `cache: "no-store"` so CRUD changes show up straight after router.refresh().
 */
async function apiFetch(path: string): Promise<unknown | null> {
    try {
        const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" })
        if (!res.ok) return null
        return await res.json()
    } catch {
        // backend offline during SSR — pages render their empty/error states instead of crashing
        return null
    }
}

export async function getJobs(): Promise<Job[]> {
    const data = await apiFetch("/jobs")
    if (!Array.isArray(data)) return []
    return data
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map(normalizeJob)
        .sort((a, b) => {
            // newest first — Mongo ObjectId hex prefix encodes the creation timestamp
            if (a._id < b._id) return 1
            if (a._id > b._id) return -1
            return 0
        })
}

export async function getJob(id: string): Promise<Job | null> {
    if (!/^[a-f\d]{24}$/i.test(id)) return null
    const data = await apiFetch(`/jobs/${id}`)
    if (!data || typeof data !== "object") return null
    return normalizeJob(data as Record<string, unknown>)
}
