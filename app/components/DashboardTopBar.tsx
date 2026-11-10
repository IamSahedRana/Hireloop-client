"use client"

import { useRouter } from "next/navigation"
import { Bell, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

/**
 * `Header - TopAppBar (Shared Component)` from the Recruiter / Dashboard frame:
 * 56px tall, search on the left, notification + profile chip on the right.
 */
export function DashboardTopBar({ className }: React.ComponentProps<"header">) {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const user = session?.user

    const name = user?.name || ""
    const role = typeof user?.role === "string" ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const q = String(new FormData(event.currentTarget).get("q") ?? "").trim()
        if (q) router.push(`/dashboard/recruiter/jobs?q=${encodeURIComponent(q)}`)
    }

    return (
        <header className={cn("flex h-14 shrink-0 items-center gap-4 bg-[#0e0e11] pr-4 sm:pr-8", className)}>
            {/* Collapse trigger (the Figma sidebar stays fixed, so the trigger lives here) */}
            <SidebarTrigger className="text-[#a1a4aa] hover:text-white" aria-label="Toggle sidebar" />

            {/* Search (submits to the recruiter job table filter) */}
            <form onSubmit={submit} className="flex min-w-0 flex-1 items-center" role="search">
                <div className="relative w-full max-w-[320px]">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-[#6b7280]"
                    />
                    <input
                        type="search"
                        name="q"
                        placeholder="Search applications, jobs, or talent..."
                        aria-label="Search applications, jobs or talent"
                        className="h-9 w-full rounded-lg border border-transparent bg-[#0c0c0f] pl-[52px] pr-3 text-[13px] text-[#ededef] placeholder:text-[#6b7280]/60 focus:border-[#5c53fe]/50 focus:outline-none"
                    />
                </div>
            </form>

            {/* Right cluster: notifications + profile */}
            <div className="ml-auto flex items-center gap-4">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex size-8 items-center justify-center"
                >
                    <Bell className="fill-[#e5e2e3] text-[#e5e2e3] size-4" aria-hidden="true" />
                    <span
                        aria-hidden="true"
                        className="absolute top-1 right-0 size-2 rounded-full bg-[#ef4444]"
                    />
                </button>
                <span aria-hidden="true" className="h-8 w-px bg-[#444748]" />
                <div className="flex items-center gap-2.5">
                    <div className="hidden flex-col sm:flex">
                        <span className="text-[13px] font-medium text-[#ededef]">{name}</span>
                        <span className="text-[11px] text-[#ededef]/40">{role}</span>
                    </div>
                    {user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.image}
                            alt=""
                            aria-hidden="true"
                            className="size-[34px] rounded-full object-cover"
                        />
                    ) : (
                        <span
                            aria-hidden="true"
                            className="flex size-[34px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#7b74ff,#5c53fe)] text-sm font-semibold text-white ring-1 ring-white/15"
                        >
                            {(name.charAt(0) || "U").toUpperCase()}
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}
