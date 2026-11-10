import type { Metadata } from "next"

import { CompanyForm } from "@/app/components/CompanyForm"
import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"

export const metadata: Metadata = {
    title: "My Company — HireLoop",
}

export default function MyCompanyPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <DashboardPageHeader
                    section="My Company"
                    title="My Company"
                    subtitle="Your company profile shown to candidates — new job posts default to this company name."
                />
                <CompanyForm />
            </div>
        </div>
    )
}
