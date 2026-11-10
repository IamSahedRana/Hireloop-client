"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "hireloop:saved-jobs"

/** Saved job ids from localStorage (client-side until a backend collection exists). */
export function readSavedJobIds(): string[] {
    if (typeof window === "undefined") return []
    try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown
        return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []
    } catch {
        return []
    }
}

function writeSavedJobIds(ids: string[]) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

/** Star toggle on job cards — persists to localStorage and notifies on save. */
export function SaveJobButton({ jobId, title, className }: { jobId: string; title: string; className?: string }) {
    const [saved, setSaved] = React.useState(false)

    React.useEffect(() => {
        setSaved(readSavedJobIds().includes(jobId))
    }, [jobId])

    const toggle = () => {
        const ids = readSavedJobIds()
        const next = ids.includes(jobId) ? ids.filter((id) => id !== jobId) : [...ids, jobId]
        writeSavedJobIds(next)
        setSaved(next.includes(jobId))
        if (next.includes(jobId)) {
            toast.add({ title: "Job saved", description: `“${title}” added to your saved jobs.`, type: "success" })
        }
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${title} from saved jobs` : `Save ${title}`}
            className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors",
                saved
                    ? "border-amber-400/40 bg-amber-400/15 text-amber-300"
                    : "border-white/10 bg-[#1A1A1F] text-white/50 hover:border-white/25 hover:text-white",
                className,
            )}
        >
            <Star aria-hidden="true" className={cn("size-4", saved && "fill-current")} />
        </button>
    )
}
