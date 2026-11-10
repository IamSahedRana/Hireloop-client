import type { Metadata } from "next"

import { JobForm } from "@/app/components/JobForm"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"

export const metadata: Metadata = {
    title: "Post a New Job — HireLoop",
}

export default function NewJobPage() {
    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <JobForm mode="create" />
        </div>
    )
}
