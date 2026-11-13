import { cn } from "@/lib/utils"

/**
 * Brand gradient avatar chip (Figma: 32×32 ellipse with the user's initial).
 * Falls back to the initial when no image URL is available, so the navbar,
 * dashboard top bar and settings can all share one implementation.
 */
export function UserAvatar({
    name,
    src,
    className,
    initialClassName,
}: {
    name?: string | null
    src?: string | null
    className?: string
    /** Font size of the fallback initial — scale it up for large avatars. */
    initialClassName?: string
}) {
    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt=""
                className={cn("shrink-0 rounded-full object-cover ring-1 ring-white/10", className)}
            />
        )
    }

    const initial = (name ?? "").trim().charAt(0).toUpperCase()

    return (
        <span
            aria-hidden="true"
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full",
                "bg-[linear-gradient(135deg,#7b74ff,#5c53fe)] text-sm font-semibold text-white",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/20",
                className,
            )}
        >
            <span className={cn("leading-none", initialClassName)}>{initial || "U"}</span>
        </span>
    )
}
