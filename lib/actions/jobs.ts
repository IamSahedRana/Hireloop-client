import type { JobFormData } from "@/lib/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** Reads the Express error body when present, else a friendly message. */
async function toResult<T>(res: Response, fallback: T): Promise<T | { error: string }> {
    const data = await res.json().catch(() => null)
    if (!res.ok || (data && typeof data === "object" && "error" in data)) {
        return { error: data?.error ?? fallbackMessage(res.status) }
    }
    return data ?? fallback
}

function fallbackMessage(status: number) {
    if (status === 404) return "This job no longer exists."
    if (status === 400) return "The backend rejected the job payload."
    return "The backend request failed. Check that the API is running."
}

export const createJob = async (data: JobFormData) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    })
    return toResult(res, { acknowledged: false })
}

export const updateJob = async (jobId: string, data: Partial<JobFormData>) => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    })
    return toResult(res, { acknowledged: false })
}

export const deleteJob = async (jobId: string) => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, { method: "DELETE" })
    return toResult(res, { deletedCount: 0 })
}
