"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

/**
 * One-click apply — the applications backend (POST /applications) doesn't
 * exist yet, so clicking tells the candidate the flow is coming instead of
 * navigating nowhere.
 */
export function ApplyJobButton({ title, className }: { title: string; className?: string }) {
    return (
        <Button
            type="button"
            size="sm"
            onClick={() =>
                toast.add({
                    title: "Apply flow coming soon",
                    description: `One-click applications for “${title}” activate with the applications backend.`,
                    type: "info",
                })
            }
            className={cn(
                "h-8 bg-[#5c53fe] px-4 text-[13px] font-medium text-white hover:bg-[#7b74ff]",
                className,
            )}
        >
            Apply
        </Button>
    )
}
