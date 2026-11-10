import type { Metadata } from "next"

import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { SettingsForm } from "@/app/components/SettingsForm"

export const metadata: Metadata = {
    title: "Settings — HireLoop",
}

export default function RecruiterSettingsPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <DashboardPageHeader
                    section="Settings"
                    title="Settings"
                    subtitle="Manage your account details and professional profile."
                />
                <div className="max-w-3xl">
                    <SettingsForm />
                </div>
            </div>
        </div>
    )
}
