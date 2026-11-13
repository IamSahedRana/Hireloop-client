"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Checkbox } from "@/components/ui/checkbox"
import { jobQueryPath, type JobQuery, type JobType } from "@/components/jobs/job-query"

export type FilterOption = {
    value: string
    label: string
    count: number
}

/**
 * Figma "Aside - Sidebar Filters": "Filters" card with checkbox groups
 * (label + result count). The groups map one-to-one onto the `JobFormData`
 * fields the backend filters by — jobType, category and the remote flag.
 * Toggling any checkbox immediately rewrites the URL query, which re-renders
 * the server page with the new backend filter.
 */
export function FilterSidebar({
    query,
    typeOptions,
    categoryOptions,
}: {
    query: JobQuery
    typeOptions: FilterOption[]
    categoryOptions: FilterOption[]
}) {
    const router = useRouter()

    const update = React.useCallback(
        (partial: Partial<JobQuery>) => router.push(jobQueryPath({ ...query, ...partial })),
        [router, query],
    )

    const toggle = <T,>(list: T[], value: T) =>
        list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

    const hasActiveFilters =
        query.jobType.length > 0 || query.category.length > 0 || query.remoteOnly || !!query.search.trim()

    const groups: {
        title: string
        options: FilterOption[]
        checked: (value: string) => boolean
        onToggle: (value: string) => void
    }[] = [
        {
            title: "Job Type",
            options: typeOptions,
            checked: (value) => query.jobType.includes(value as JobType),
            onToggle: (value) => update({ jobType: toggle(query.jobType, value as JobType) }),
        },
        {
            title: "Category",
            options: categoryOptions,
            checked: (value) => query.category.includes(value),
            onToggle: (value) => update({ category: toggle(query.category, value) }),
        },
        {
            title: "Location",
            options: [{ value: "remote", label: "Remote only", count: 0 }],
            checked: () => query.remoteOnly,
            onToggle: () => update({ remoteOnly: !query.remoteOnly }),
        },
    ]

    return (
        <aside className="h-fit rounded-2xl bg-[#141418] p-6">
            <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-[22px] leading-7 font-semibold text-[#ededef]">Filters</h2>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => router.push("/browse-jobs")}
                        className="text-[13px] text-[#8b85ff] transition hover:text-white"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {groups.map((group) => (
                <section key={group.title} className="mt-6">
                    <h3 className="text-base text-[#ededef]">{group.title}</h3>
                    <ul className="mt-2.5 flex flex-col gap-1.5">
                        {group.options.map((option) => (
                            <li key={option.value}>
                                <label className="flex cursor-pointer items-center gap-3 rounded-md py-1 text-[13px] text-[#a0a0ab] transition-colors hover:text-[#ededef]">
                                    <Checkbox
                                        checked={group.checked(option.value)}
                                        onCheckedChange={() => group.onToggle(option.value)}
                                        className="size-5 rounded-[4px] border-white/10 bg-[#1a1a1f] data-checked:border-white data-checked:bg-white data-checked:text-[#141418]"
                                    />
                                    <span className="flex-1 capitalize">{option.label}</span>
                                    {option.count > 0 && <span className="text-xs text-[#6e6e78]">{option.count}</span>}
                                </label>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </aside>
    )
}
