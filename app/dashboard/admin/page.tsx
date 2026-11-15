import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"

export const metadata: Metadata = {
    title: "Admin Dashboard — HireLoop",
}

export default async function AdminDashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login?redirect=/dashboard/admin")
    // role guard: only admins may stay here; everyone else goes to their own home
    if (session.user.role !== "admin") redirect(`/dashboard/${session.user.role ?? "seeker"}`)

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <h2 className="font-heading text-[22px] font-semibold text-[#ededef]">Admin Dashboard</h2>
                <p className="mt-1 text-sm text-[#a0a0ab]">
                    Welcome back, {session.user.name} — manage users, jobs and platform settings.
                </p>
            </div>
        </div>
    )
}
