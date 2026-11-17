import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AdminUsersManager } from "@/app/components/AdminUsersManager"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
    title: "Admin · Users — HireLoop",
}

export default async function AdminUsersPage() {
    // role guard: only admins reach user management
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login?redirect=/dashboard/admin/users")
    if (session.user.role !== "admin") redirect(`/dashboard/${session.user.role ?? "seeker"}`)

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <DashboardPageHeader
                    section="Admin"
                    title="User Management"
                    subtitle="Review, filter, and manage platform access for all users."
                />
                <AdminUsersManager />
            </div>
        </div>
    )
}
