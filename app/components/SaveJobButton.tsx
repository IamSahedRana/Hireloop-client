"use client"

import * as React from "react"
import { Bookmark, Star } from "lucide-react"

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

/**
 * Save toggle on job cards — persists to localStorage and notifies on save.
 * `icon` picks the glyph (Figma uses a bookmark on the public pages, the
 * dashboard a star); `variant="ghost"` drops the boxed border for the
 * public list card.
 */
export function SaveJobButton({
    jobId,
    title,
    className,
    icon = "star",
    variant = "default",
}: {
    jobId: string
    title: string
    className?: string
    icon?: "star" | "bookmark"
    variant?: "default" | "ghost"
}) {
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

    const Icon = icon === "bookmark" ? Bookmark : Star

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${title} from saved jobs` : `Save ${title}`}
            className={cn(
                "flex shrink-0 items-center justify-center rounded-md border transition-colors",
                variant === "ghost"
                    ? "border-transparent bg-transparent"
                    : "size-8 border-white/10 bg-[#1A1A1F]",
                saved
                    ? variant === "ghost"
                        ? "border-transparent text-amber-300"
                        : "border-amber-400/40 bg-amber-400/15 text-amber-300"
                    : variant === "ghost"
                        ? "bg-transparent text-[#8e9192] hover:text-white"
                        : "text-white/50 hover:border-white/25 hover:text-white",
                className,
            )}
        >
            <Icon aria-hidden="true" className={cn("size-4", saved && "fill-current")} />
        </button>
    )
}
