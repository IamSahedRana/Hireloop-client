import type { Metadata } from "next"

import { getJobs } from "@/lib/api/jobs"
import type { Job } from "@/lib/types/job"
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/types/job"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { parseJobQuery } from "@/components/jobs/job-query"
import { FilterSidebar, type FilterOption } from "@/components/jobs/filter-sidebar"
import { JobCard } from "@/components/jobs/job-card"
import { JobSearchBar } from "@/components/jobs/job-search-bar"
import { SortSelect } from "@/components/jobs/sort-select"

export const metadata: Metadata = {
    title: "Browse Jobs — HireLoop",
    description: "Search and filter every live job on HireLoop by title, type, category and remote work.",
}

/** Static form categories first, then anything else found in live data. */
function categoryOptions(jobs: Job[]): string[] {
    const extra = jobs.map((job) => job.category).filter((name) => name && !JOB_CATEGORIES.includes(name))
    return [...JOB_CATEGORIES, ...new Set(extra)]
}

/** "Most Recent" is getJobs' default order; "oldest" simply flips it. */
function applySort(jobs: Job[], sort: "recent" | "oldest") {
    return sort === "oldest" ? [...jobs].reverse() : jobs
}

export default async function BrowseJobsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const query = parseJobQuery(await searchParams)
    const filters = {
        search: query.search,
        jobType: query.jobType,
        category: query.category,
        isRemote: query.remoteOnly || undefined,
    }

    // unfiltered set drives the sidebar counts, the filtered set is the result list
    const [allJobs, jobs] = await Promise.all([getJobs(), getJobs(filters)])
    const visibleJobs = applySort(jobs, query.sort)

    const countBy = (key: (job: Job) => string) =>
        allJobs.reduce<Record<string, number>>((acc, job) => {
            const name = key(job)
            acc[name] = (acc[name] ?? 0) + 1
            return acc
        }, {})

    const typeCounts = countBy((job) => job.jobType)
    const categoryCounts = countBy((job) => job.category)
    const remoteCount = allJobs.filter((job) => job.isRemote).length

    const toOptions = (values: string[], counts: Record<string, number>): FilterOption[] =>
        values.map((value) => ({ value, label: value, count: counts[value] ?? 0 }))

    return (
        <div className="min-h-svh bg-[#08080a]">
            <SiteNavbar />

            <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-8">
                <JobSearchBar query={query} />

                <div className="mt-8 grid gap-6 md:grid-cols-[296px_1fr] md:gap-8">
                    <FilterSidebar
                        query={query}
                        typeOptions={toOptions(JOB_TYPES, typeCounts)}
                        categoryOptions={toOptions(categoryOptions(allJobs), categoryCounts)}
                    />

                    <section aria-label="Job results">
                        <div className="flex items-center justify-between gap-4">
                            <h1 className="font-heading text-[22px] leading-7 font-semibold text-[#ededef]">
                                Found {visibleJobs.length} {visibleJobs.length === 1 ? "Job" : "Jobs"}
                            </h1>
                            <SortSelect query={query} />
                        </div>

                        {visibleJobs.length === 0 ? (
                            <div className="mt-6 rounded-xl bg-[#141418] p-12 text-center">
                                <h2 className="font-heading text-lg font-semibold text-white">No matches</h2>
                                <p className="mt-1 text-sm text-[#a0a0ab]">
                                    Nothing matches your search or filters. Try clearing a few of them.
                                </p>
                            </div>
                        ) : (
                            <ul className="mt-6 flex flex-col gap-5">
                                {visibleJobs.map((job) => (
                                    <li key={job._id}>
                                        <JobCard job={job} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
