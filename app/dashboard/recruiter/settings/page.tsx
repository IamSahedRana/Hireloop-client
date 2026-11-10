import type { Metadata } from "next"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"

export const metadata: Metadata = {
    title: "Settings — HireLoop",
}

export default function RecruiterSettingsPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <span className="text-white/50">Settings</span>
                    <span aria-hidden className="text-white/30">/</span>
                    <span className="text-white/90">Account</span>
                </nav>

                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        Settings
                    </h1>
                    <p className="text-sm text-white/60">Account details and preferences.</p>
                </header>

                <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                    <h2 className="font-heading text-lg font-semibold text-white">Settings coming with the backend</h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-white/60">
                        Account management hooks into the auth API once the settings endpoints are live.
                    </p>
                </section>
            </div>
        </div>
    )
}
