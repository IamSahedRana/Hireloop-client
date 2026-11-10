import type { Metadata } from "next"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"

export const metadata: Metadata = {
    title: "My Company — HireLoop",
}

export default async function MyCompanyPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <span className="text-white/50">My Company</span>
                    <span aria-hidden className="text-white/30">/</span>
                    <span className="text-white/90">Company Profile</span>
                </nav>

                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        My Company
                    </h1>
                    <p className="text-sm text-white/60">
                        Your company profile shown to candidates on the job listings.
                    </p>
                </header>

                <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                    <h2 className="font-heading text-lg font-semibold text-white">No company profile yet</h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-white/60">
                        Company details come from the backend profile API. Job posts currently carry the
                        company name you type into the listing form.
                    </p>
                </section>
            </div>
        </div>
    )
}
