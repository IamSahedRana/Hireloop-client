"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { jobQueryPath, type JobQuery } from "@/components/jobs/job-query"

/**
 * Figma "Section - Search & Quick Filters": dark input next to a white
 * "Search Jobs" button. Submitting rewrites the `q` param and keeps the
 * active sidebar filters.
 */
export function JobSearchBar({ query }: { query: JobQuery }) {
    const router = useRouter()

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const search = String(new FormData(event.currentTarget).get("q") ?? "")
        router.push(jobQueryPath({ ...query, search }))
    }

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="flex flex-col gap-3 rounded-2xl bg-[#141418] p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        >
            <div className="relative flex-1">
                <Search aria-hidden="true" className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#8e9192]" />
                <input
                    name="q"
                    type="search"
                    defaultValue={query.search}
                    placeholder="Search by job title, keywords..."
                    aria-label="Search jobs"
                    className="h-[52px] w-full rounded-lg bg-[#1a1a1f] pr-4 pl-11 text-sm text-[#ededef] transition focus:ring-2 focus:ring-[#5c53fe]/40 focus:outline-none placeholder:text-[#a0a0ab] sm:h-[58px]"
                />
            </div>
            <Button
                type="submit"
                className="h-[52px] shrink-0 rounded-lg bg-white px-6 text-base font-medium text-[#2f3131] hover:bg-white/90 sm:h-[58px]"
            >
                Search Jobs
            </Button>
        </form>
    )
}
