import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Globe2, Search, Briefcase, MapPin } from "lucide-react"

import { getJobs } from "@/lib/api/jobs"
import type { Job } from "@/lib/types/job"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"

export const metadata: Metadata = {
    title: "Companies — HireLoop",
    description: "Explore every company hiring on HireLoop and jump straight into their open roles.",
}

type SearchParams = { searchParams: Promise<{ q?: string }> }

type Company = {
    name: string
    jobs: Job[]
    locations: string[]
    categories: string[]
    remoteCount: number
    latestPost: string
}

/** Group the live job list by company (names are matched case-insensitively). */
function buildCompanies(jobs: Job[]): Company[] {
    const groups = new Map<string, Job[]>()
    for (const job of jobs) {
        const name = job.companyName.trim()
        if (!name) continue
        const key = name.toLowerCase()
        groups.set(key, [...(groups.get(key) ?? []), job])
    }
    return [...groups.entries()].map(([, companyJobs]) => {
        // keep a stable representative name (the most recent spelling)
        const name = companyJobs[0].companyName
        const newestFirst = [...companyJobs].sort((a, b) => (a._id < b._id ? 1 : -1))
        return {
            name,
            jobs: newestFirst,
            locations: [...new Set(companyJobs.map((job) => job.location).filter(Boolean))],
            categories: [...new Set(companyJobs.map((job) => job.category).filter(Boolean))],
            remoteCount: companyJobs.filter((job) => job.isRemote).length,
            latestPost: newestFirst[0].posted,
        }
    })
}

export default async function CompaniesPage({ searchParams }: SearchParams) {
    const { q } = await searchParams
    const search = (q ?? "").trim()

    const allJobs = await getJobs()
    const companies = buildCompanies(allJobs).filter((company) =>
        search ? company.name.toLowerCase().includes(search.toLowerCase()) : true,
    )
    // most open roles first
    companies.sort((a, b) => b.jobs.length - a.jobs.length)

    return (
        <div className="min-h-svh bg-[#08080a]">
            <SiteNavbar />

            <main className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-8">
                {/* header + search */}
                <header className="flex flex-col gap-6">
                    <div>
                        <h1 className="font-heading text-[32px] leading-tight font-semibold text-[#ededef]">
                            Companies hiring on HireLoop
                        </h1>
                        <p className="mt-2 text-[15px] text-[#a0a0ab]">
                            {companies.length} {companies.length === 1 ? "company" : "companies"} ·{" "}
                            {allJobs.length} live {allJobs.length === 1 ? "role" : "roles"}. Pick a company to see
                            its open roles.
                        </p>
                    </div>

                    {/* plain GET form — works with or without JS */}
                    <form action="/companies" method="get" role="search" className="flex gap-3 sm:max-w-[520px]">
                        <div className="relative flex-1">
                            <Search
                                aria-hidden="true"
                                className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8e9192]"
                            />
                            <input
                                name="q"
                                type="search"
                                defaultValue={search}
                                placeholder="Search companies..."
                                aria-label="Search companies"
                                className="h-[52px] w-full rounded-lg bg-[#1a1a1f] pr-4 pl-11 text-sm text-[#ededef] transition focus:ring-2 focus:ring-[#5c53fe]/40 focus:outline-none placeholder:text-[#a0a0ab]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="h-[52px] shrink-0 rounded-lg bg-white px-6 text-base font-medium text-[#2f3131] transition hover:bg-white/90"
                        >
                            Search
                        </button>
                    </form>
                </header>

                {/* company grid */}
                {companies.length === 0 ? (
                    <div className="mt-8 rounded-xl bg-[#141418] p-12 text-center">
                        <h2 className="font-heading text-lg font-semibold text-white">No companies found</h2>
                        <p className="mt-1 text-sm text-[#a0a0ab]">
                            Nothing matches "{search}". Try a different name or clear the search.
                        </p>
                    </div>
                ) : (
                    <ul className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {companies.map((company) => (
                            <li key={company.name.toLowerCase()}>
                                <article className="flex h-full flex-col rounded-xl bg-[#141418] p-6">
                                    <div className="flex items-start gap-5">
                                        <div
                                            aria-hidden="true"
                                            className="grid size-16 shrink-0 place-items-center rounded-lg bg-[#222228] text-xl font-semibold text-white/80"
                                        >
                                            {company.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate font-heading text-[22px] leading-7 font-semibold text-[#ededef]">
                                                {company.name}
                                            </h2>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#a0a0ab]">
                                                <Briefcase aria-hidden="true" className="size-3.5 shrink-0" />
                                                {company.jobs.length} open{" "}
                                                {company.jobs.length === 1 ? "role" : "roles"}
                                                <span aria-hidden="true">·</span>
                                                {company.latestPost.toLowerCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {company.remoteCount > 0 && (
                                            <span className="inline-flex h-[30px] items-center gap-1.5 rounded-md bg-[#22c55e]/10 px-3 text-[13px] text-[#22c55e]">
                                                <Globe2 aria-hidden="true" className="size-3.5" />
                                                {company.remoteCount} remote
                                            </span>
                                        )}
                                        {company.categories.slice(0, 3).map((category) => (
                                            <span
                                                key={category}
                                                className="inline-flex h-[30px] items-center rounded-md bg-[#1a1a1f] px-3 text-[13px] text-[#ededef]"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>

                                    {company.locations.length > 0 && (
                                        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#a0a0ab]">
                                            {company.locations.slice(0, 3).map((location) => (
                                                <span key={location} className="inline-flex items-center gap-1.5">
                                                    <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                                                    {location}
                                                </span>
                                            ))}
                                        </p>
                                    )}

                                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-5">
                                        {/* latest roles teaser */}
                                        <p className="min-w-0 truncate text-[13px] text-[#a0a0ab]">
                                            Latest: {company.jobs[0].title}
                                        </p>
                                        <Link
                                            href={`/browse-jobs?q=${encodeURIComponent(company.name)}`}
                                            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a1f] px-4 text-[13px] text-[#ededef] transition hover:bg-[#232327]"
                                        >
                                            View open roles
                                            <ArrowRight aria-hidden="true" className="size-3.5" />
                                        </Link>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            <SiteFooter />
        </div>
    )
}
