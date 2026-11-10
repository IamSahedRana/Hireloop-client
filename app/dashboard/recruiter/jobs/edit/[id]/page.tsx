import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JobForm } from "@/app/components/JobForm"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { getJob } from "@/lib/api/jobs"

export const metadata: Metadata = {
    title: "Edit Job Post — HireLoop",
}

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const job = await getJob(id)

    if (!job) notFound()

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <JobForm mode="edit" job={job} />
        </div>
    )
}
