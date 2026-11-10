import type { Metadata } from "next"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { SettingsForm } from "@/app/components/SettingsForm"

export const metadata: Metadata = {
    title: "Admin · Settings — HireLoop",
}

export default function AdminSettingsPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        Settings
                    </h1>
                    <p className="text-sm text-white/60">Account details and preferences.</p>
                </header>
                <div className="max-w-3xl">
                    <SettingsForm />
                </div>
            </div>
        </div>
    )
}
