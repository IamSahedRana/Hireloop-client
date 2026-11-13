"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jobQueryPath, type JobQuery, type JobSort } from "@/components/jobs/job-query"

const SORT_ITEMS = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest" },
] as const

/** Figma "Sort by:" dropdown in the results header — writes the `sort` param. */
export function SortSelect({ query }: { query: JobQuery }) {
    const router = useRouter()

    function handleValueChange(value: unknown) {
        const sort: JobSort = value === "oldest" ? "oldest" : "recent"
        router.push(jobQueryPath({ ...query, sort }))
    }

    return (
        <div className="flex items-center gap-2">
            <span className="hidden text-[13px] text-[#6e6e78] sm:block">Sort by:</span>
            <Select value={query.sort} items={SORT_ITEMS} onValueChange={handleValueChange}>
                <SelectTrigger
                    aria-label="Sort jobs"
                    className="h-9 w-[141px] rounded-lg border-white/10 bg-[#0c0c0f] text-[13px] text-[#ededef]"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {SORT_ITEMS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
