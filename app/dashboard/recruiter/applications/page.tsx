import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { RecruiterApplicationsBoard } from "@/app/components/RecruiterApplicationsBoard"
import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { auth } from "@/lib/auth"
import { fetchApplications, type ApplicationRow } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"

export const metadata: Metadata = {
    title: "Applications — HireLoop",
}

export default async function RecruiterApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ job?: string }>
}) {
    const { job } = await searchParams

    // role guard + scoping: recruiters review applications to their own jobs only
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect("/login?redirect=/dashboard/recruiter/applications")
    if (session.user.role !== "recruiter") redirect(`/dashboard/${session.user.role ?? "seeker"}`)
    const recruiterId = String(session.user.id)

    const selectedJobId = job?.trim() || undefined
    const [ownJobs, applications] = await Promise.all([
        getJobs({ createdBy: recruiterId }),
        fetchApplications(selectedJobId ? { jobId: selectedJobId, ownerId: recruiterId } : { ownerId: recruiterId }),
    ])

    // the selector only lists this recruiter's jobs
    const boardJobs = ownJobs.map((job) => ({ _id: job._id, title: job.title }))
    const rows: ApplicationRow[] = applications.map((app) => ({
        _id: app._id,
        candidateName: app.candidateName,
        role: app.jobTitle,
        dateApplied: app.appliedAt,
        experience: "—",
        status: app.status,
    }))

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                {/* Same breadcrumb pattern as the Manage Jobs page */}
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <span className="text-white/50">Applications</span>
                    <span aria-hidden className="text-white/30">/</span>
                    <span className="text-white/90">All Applications</span>
                </nav>

                <header className="mb-8 flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        Applications
                    </h1>
                    <p className="text-sm text-white/60">
                        Every candidate that applied across your job posts, newest first. Change a status to move a
                        candidate through the pipeline.
                    </p>
                </header>

                <RecruiterApplicationsBoard jobs={boardJobs} applications={rows} selectedJobId={selectedJobId} />
            </div>
        </div>
    )
}
