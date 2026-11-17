"use client"

import * as React from "react"
import { Search, Download, ShieldOff, ShieldCheck, UserCog } from "lucide-react"

import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type AdminUser = {
    id: string
    name: string
    email: string
    role: string
    banned: boolean | null
    createdAt: string | Date
}

type RoleFilter = "all" | "seeker" | "recruiter" | "admin"

const inputClass =
    "h-10 w-full rounded-lg border border-white/10 bg-[#1A1A1F] pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#8f88ff]/50"
const chipBase = "inline-flex h-[22px] items-center rounded-full border px-2.5 text-[12px] font-medium"
const roleStyles: Record<string, string> = {
    seeker: "text-[#60a5fa] bg-[#60a5fa]/10 border-[#60a5fa]/25",
    recruiter: "text-[#8f88ff] bg-[#8f88ff]/10 border-[#8f88ff]/30",
    admin: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25",
}
const statusStyles = {
    active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
    suspended: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/25",
}
const actionButtonClass =
    "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#1A1A1F] px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white disabled:opacity-50"

const statCardClass =
    "flex flex-col rounded-xl p-5 min-h-[140px] bg-[#141418] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]"

function formatDate(value: string | Date) {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/**
 * `Admin / Manage Users` frame: stats bento, email search, and the users
 * table backed by better-auth's admin plugin (`/admin/list-users`,
 * `/admin/set-role`, `/admin/ban-user`, `/admin/unban-user`).
 */
export function AdminUsersManager() {
    const [users, setUsers] = React.useState<AdminUser[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [search, setSearch] = React.useState("")
    const [roleFilter, setRoleFilter] = React.useState<RoleFilter>("all")
    const [busyId, setBusyId] = React.useState<string | null>(null)

    const load = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        const { data, error: fetchError } = await authClient.admin.listUsers({
            query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
        })
        if (fetchError) {
            setError(fetchError.message ?? "Could not load users.")
            setUsers([])
        } else {
            setUsers((data?.users ?? []) as AdminUser[])
        }
        setLoading(false)
    }, [])

    React.useEffect(() => {
        void load()
    }, [load])

    const visible = users.filter((user) => {
        const matchesEmail = !search.trim() || user.email.toLowerCase().includes(search.trim().toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesEmail && matchesRole
    })

    const stats = React.useMemo(() => {
        const now = Date.now()
        return [
            {
                label: "Total Active Users",
                value: users.filter((user) => !user.banned).length,
                hint: `${users.length} total accounts`,
            },
            { label: "Recruiter Growth", value: users.filter((user) => user.role === "recruiter").length, hint: "recruiter accounts" },
            { label: "Suspended Accounts", value: users.filter((user) => user.banned).length, hint: "banned via admin" },
            {
                label: "New Signups 24h",
                value: users.filter((user) => now - new Date(user.createdAt).getTime() < 24 * 60 * 60 * 1000).length,
                hint: "last 24 hours",
            },
        ]
    }, [users])

    async function changeRole(user: AdminUser, role: "seeker" | "recruiter" | "admin") {
        setBusyId(user.id)
        const { error: updateError } = await authClient.admin.setRole({ userId: user.id, role: role as "user" })
        setBusyId(null)
        if (updateError) {
            toast.add({ title: "Role update failed", description: updateError.message ?? "Try again.", type: "error" })
            return
        }
        setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, role } : entry)))
        toast.add({ title: "Role updated", description: `${user.email} is now a ${role}.`, type: "success" })
    }

    async function toggleSuspend(user: AdminUser) {
        setBusyId(user.id)
        const { error: updateError } = user.banned
            ? await authClient.admin.unbanUser({ userId: user.id })
            : await authClient.admin.banUser({ userId: user.id, banReason: "Suspended by admin" })
        setBusyId(null)
        if (updateError) {
            toast.add({ title: user.banned ? "Unsuspend failed" : "Suspend failed", description: updateError.message ?? "Try again.", type: "error" })
            return
        }
        setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, banned: !entry.banned } : entry)))
        toast.add({
            title: user.banned ? "Account unsuspended" : "Account suspended",
            description: user.email,
            type: "success",
        })
    }

    function exportCsv() {
        const header = "Name,Email,Role,Join Date,Status\n"
        const rows = visible
            .map((user) => [user.name, user.email, user.role, formatDate(user.createdAt), user.banned ? "Suspended" : "Active"].join(","))
            .join("\n")
        const blob = new Blob([header + rows], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = "hireloop-users.csv"
        anchor.click()
        URL.revokeObjectURL(url)
        toast.add({ title: "Export ready", description: `${visible.length} users exported to CSV.`, type: "success" })
    }

    const filters: { key: RoleFilter; label: string }[] = [
        { key: "all", label: "All Roles" },
        { key: "seeker", label: "Seekers" },
        { key: "recruiter", label: "Recruiters" },
        { key: "admin", label: "Admins" },
    ]

    return (
        <div className="flex flex-col gap-6">
            {/* Bento stats — `Section - Stats Grid` of the frame */}
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, hint }) => (
                    <div key={label} className={cn(statCardClass, "text-left")}>
                        <dt className="text-[13px] text-[#a0a0ab]">{label}</dt>
                        <dd className="mt-3 font-inter text-[26px] font-semibold text-[#ededef]">
                            {value.toLocaleString("en-US")}
                        </dd>
                        <p className="mt-auto pt-3 text-xs text-[#6e6e78]">{hint}</p>
                    </div>
                ))}
            </dl>

            {/* Controls — `Header - Top App Bar` of the frame */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                    <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                    <input
                        type="email"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by email..."
                        className={inputClass}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {filters.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setRoleFilter(key)}
                            className={cn(
                                "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                                roleFilter === key
                                    ? "border-[#8f88ff]/40 bg-[#8f88ff]/15 text-[#b7b2ff]"
                                    : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white",
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={exportCsv}
                    className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-[#fafafa] px-4 text-sm font-medium text-[#0b0b0c] transition-colors hover:bg-white"
                >
                    <Download aria-hidden="true" className="size-4" />
                    Export List
                </button>
            </div>

            {/* Users table */}
            <div className="overflow-hidden rounded-xl border border-white/5 bg-[#141418] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left">
                        <thead>
                            <tr className="bg-[#1a1a1f]">
                                {["User Name", "Email Address", "Role", "Join Date", "Status", "Actions"].map((heading, index) => (
                                    <th
                                        key={heading}
                                        scope="col"
                                        className={cn(
                                            "px-4 py-3 text-[11px] font-medium text-[#6e6e78]",
                                            index === 3 && "hidden md:table-cell",
                                            index === 4 && "hidden sm:table-cell",
                                            index === 5 && "min-w-[220px]",
                                        )}
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#a0a0ab]">
                                        Loading users…
                                    </td>
                                </tr>
                            )}
                            {!loading && error && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#ef4444]">
                                        {error}
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && visible.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#a0a0ab]">
                                        No users match this view.
                                    </td>
                                </tr>
                            )}
                            {!loading &&
                                visible.map((user) => {
                                    const roleKey = roleStyles[user.role] ? user.role : "seeker"
                                    const otherRole = user.role === "recruiter" ? "seeker" : "recruiter"
                                    return (
                                        <tr
                                            key={user.id}
                                            className="border-t border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.02]"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        aria-hidden="true"
                                                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-[13px] font-medium text-[#a1a4aa]"
                                                    >
                                                        {(user.name.trim().charAt(0) || "·").toUpperCase()}
                                                    </span>
                                                    <span className="truncate text-[13px] font-medium text-[#ededef]">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-[13px] text-[#a0a0ab]">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={cn(chipBase, roleStyles[roleKey])}>{user.role}</span>
                                            </td>
                                            <td className="hidden px-4 py-3 text-[13px] whitespace-nowrap text-[#a0a0ab] md:table-cell">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="hidden px-4 py-3 sm:table-cell">
                                                <span className={cn(chipBase, user.banned ? statusStyles.suspended : statusStyles.active)}>
                                                    {user.banned ? "Suspended" : "Active"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {/* admins keep their role — never demote an admin from the table */}
                                                    {user.role !== "admin" && (
                                                        <button
                                                            type="button"
                                                            disabled={busyId === user.id}
                                                            onClick={() => changeRole(user, otherRole)}
                                                            className={actionButtonClass}
                                                            title={`Set role to ${otherRole}`}
                                                        >
                                                            <UserCog aria-hidden="true" className="size-3.5" />
                                                            Make {otherRole.charAt(0).toUpperCase() + otherRole.slice(1)}
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        disabled={busyId === user.id}
                                                        onClick={() => toggleSuspend(user)}
                                                        className={cn(actionButtonClass, user.banned && "text-emerald-300 hover:text-emerald-200")}
                                                    >
                                                        {user.banned ? (
                                                            <>
                                                                <ShieldCheck aria-hidden="true" className="size-3.5" />
                                                                Unsuspend
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShieldOff aria-hidden="true" className="size-3.5" />
                                                                Suspend
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
