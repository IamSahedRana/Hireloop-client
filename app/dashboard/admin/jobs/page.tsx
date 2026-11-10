import type { Metadata } from "next"

import { DashboardTopBar } from "@/app/components/DashboardTopBar"
import { cn } from "@/lib/utils"
import { DashboardPageHeader } from "@/app/components/DashboardPageHeader"
import { getJobs } from "@/lib/api/jobs"

export const metadata: Metadata = {
    title: "Admin · Jobs — HireLoop",
}

const thClass = "px-4 py-3.5 text-left text-xs font-medium text-[#6e6e78]"
const tdClass = "px-4 py-3.5 text-[13px] text-[#ededef]"

export default async function AdminJobsPage() {
    const jobs = await getJobs()

    return (
        <div className="h-svh overflow-y-auto">
            <DashboardTopBar />
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                <DashboardPageHeader
                    section="Admin"
                    title="Jobs"
                    subtitle="Every job post in the platform, live from the jobs collection."
                />

                {jobs.length === 0 ? (
                    <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-12 text-center">
                        <h2 className="font-heading text-lg font-semibold text-white">No job posts yet</h2>
                        <p className="mt-1 text-sm text-white/60">Posts appear here as recruiters publish them.</p>
                    </section>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-[#141418]">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left">
                                <thead>
                                    <tr className="bg-[#1a1a1f]">
                                        <th scope="col" className={thClass}>Job title</th>
                                        <th scope="col" className={thClass}>Company</th>
                                        <th scope="col" className={thClass}>Posted</th>
                                        <th scope="col" className={thClass}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job._id} className="border-t border-white/5">
                                            <td className={cn(tdClass, "max-w-[280px] truncate font-medium")}>{job.title}</td>
                                            <td className={tdClass}>{job.companyName}</td>
                                            <td className={cn(tdClass, "whitespace-nowrap text-[#a0a0ab]")}>{job.posted}</td>
                                            <td className={tdClass}>
                                                <span className="capitalize">{job.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

