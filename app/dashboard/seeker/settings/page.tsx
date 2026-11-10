import type { Metadata } from "next"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { SettingsForm } from "@/app/components/SettingsForm"

export const metadata: Metadata = {
    title: "Settings — HireLoop",
}

export default function SeekerSettingsPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[22px] font-semibold text-[#ededef]">Settings</h1>
                    <p className="text-[13px] text-[#a0a0ab]">
                        Manage your account details and professional profile.
                    </p>
                </header>
                <div className="max-w-3xl">
                    <SettingsForm />
                </div>
            </div>
        </div>
    )
}
