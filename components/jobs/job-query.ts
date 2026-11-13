import type { JobType } from "@/lib/types/job"

export type { JobType }

/**
 * The browse-jobs page keeps every filter in the URL (shareable, works
 * without JS round-trips through SSR). These helpers are the single source
 * of truth for parsing it on the server and writing it on the client.
 */

export type JobSort = "recent" | "oldest"

export type JobQuery = {
    search: string
    jobType: JobType[]
    category: string[]
    remoteOnly: boolean
    sort: JobSort
}

export const defaultJobQuery: JobQuery = {
    search: "",
    jobType: [],
    category: [],
    remoteOnly: false,
    sort: "recent",
}

type SearchParams = Record<string, string | string[] | undefined>

const JOB_TYPE_SET = new Set<JobType>(["full-time", "part-time", "contract", "internship"])

const asArray = (value: string | string[] | undefined) =>
    value === undefined ? [] : Array.isArray(value) ? value : [value]

/** Next.js `searchParams` → JobQuery (unknown values are ignored). */
export function parseJobQuery(searchParams: SearchParams): JobQuery {
    const sort = searchParams.sort === "oldest" ? "oldest" : "recent"
    return {
        search: typeof searchParams.q === "string" ? searchParams.q : "",
        jobType: asArray(searchParams.jobType).filter((v): v is JobType =>
            (JOB_TYPE_SET as Set<string>).has(v),
        ),
        category: asArray(searchParams.category),
        remoteOnly: searchParams.remote === "1",
        sort,
    }
}

/** JobQuery → URLSearchParams, omitting defaults so empty filters stay clean. */
export function jobQueryToSearchParams(query: JobQuery): URLSearchParams {
    const params = new URLSearchParams()
    if (query.search.trim()) params.set("q", query.search.trim())
    for (const type of query.jobType) params.append("jobType", type)
    for (const category of query.category) params.append("category", category)
    if (query.remoteOnly) params.set("remote", "1")
    if (query.sort !== "recent") params.set("sort", query.sort)
    return params
}

/** JobQuery → a path for `router.push`, e.g. "/browse-jobs?q=react&remote=1". */
export function jobQueryPath(query: JobQuery): string {
    const params = jobQueryToSearchParams(query).toString()
    return params ? `/browse-jobs?${params}` : "/browse-jobs"
}
