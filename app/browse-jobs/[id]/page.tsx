import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Banknote, CalendarDays, Clock3, MapPin } from "lucide-react"

import { getJob } from "@/lib/api/jobs"
import { formatCompensation, formatDeadline } from "@/lib/types/job"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { ApplyJobButton } from "@/app/components/ApplyJobButton"
import { SaveJobButton } from "@/app/components/SaveJobButton"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { id } = await params
    const job = await getJob(id)
    return {
        title: job ? `${job.title} — HireLoop` : "Job not found — HireLoop",
        description: job ? `${job.title} at ${job.companyName}` : undefined,
    }
}

/** Textarea content → bullet items (blank lines dropped). */
const toItems = (text: string) =>
    text.split("\n").map((line) => line.trim()).filter(Boolean)

/** Dot bullet list used by the Responsibilities / Requirements sections. */
function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
                <li key={item} className="flex gap-3 text-[13px] leading-6 text-[#a0a0ab]">
                    <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-white" />
                    {item}
                </li>
            ))}
        </ul>
    )
}

export default async function JobDetailsPage({ params }: Params) {
    const { id } = await params
    const job = await getJob(id)

    if (!job) notFound()

    const responsibilities = toItems(job.responsibilities)
    const requirements = toItems(job.requirements)
    const initial = (job.companyName || "?").trim().charAt(0).toUpperCase()
    const locationLabel = job.isRemote
        ? job.location && job.location.toLowerCase() !== "remote"
            ? `${job.location} (Remote)`
            : "Remote"
        : job.location || "—"

    const facts = [
        { icon: Banknote, label: "Salary Range", value: formatCompensation(job) },
        { icon: MapPin, label: "Location", value: locationLabel },
        { icon: Clock3, label: "Job Type", value: job.jobType },
        { icon: CalendarDays, label: "Application Deadline", value: formatDeadline(job.deadline) },
    ]

    const overview = [
        { label: "Category", value: job.category || "—" },
        { label: "Posted", value: job.posted },
        { label: "Applicants", value: String(job.applicants) },
        { label: "Deadline", value: formatDeadline(job.deadline) },
    ]

    return (
        <div className="min-h-svh bg-[#08080a]">
            <SiteNavbar />

            <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-8">
                <Link href="/browse-jobs" className="text-sm text-[#a0a0ab] transition-colors hover:text-white">
                    ← Back to jobs
                </Link>

                {/* Figma "Header Section": logo, 32px title, save + Apply Now */}
                <section className="mt-4 flex flex-col gap-6 rounded-2xl bg-[#141418] p-6 sm:flex-row sm:items-center sm:justify-between sm:pr-6">
                    <div className="flex min-w-0 items-center gap-6">
                        <div
                            aria-hidden="true"
                            className="grid size-20 shrink-0 place-items-center rounded-xl bg-[#1a1a1f] text-3xl font-semibold text-white/80"
                        >
                            {initial}
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-heading text-[32px] leading-10 font-semibold text-[#ededef]">
                                {job.title}
                            </h1>
                            <p className="mt-1 flex items-center gap-3 text-base text-[#6e6e78]">
                                {job.companyName}
                                <span aria-hidden="true" className="size-1 rounded-full bg-[#8e9192]" />
                                {job.category}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                        <SaveJobButton
                            jobId={job._id}
                            title={job.title}
                            icon="bookmark"
                            className="size-12 rounded-lg bg-[#222228] text-[#e5e2e3] hover:text-white"
                        />
                        <ApplyJobButton
                            title={job.title}
                            className="h-12 rounded-lg bg-[#fafafa] px-4 text-base font-medium text-[#0b0b0c] hover:bg-white"
                        />
                    </div>
                </section>

                <div className="mt-6 grid gap-6 md:grid-cols-[1fr_397px] md:gap-8">
                    {/* main column: Figma "Bento Info Grid" + content sections */}
                    <div className="flex flex-col">
                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                            {facts.map((fact) => (
                                <article key={fact.label} className="rounded-xl bg-[#141418] p-6">
                                    <fact.icon aria-hidden="true" className="size-5 text-[#c4c7c8]" />
                                    <p className="mt-4 text-[13px] tracking-wide text-[#a0a0ab] uppercase">{fact.label}</p>
                                    <p className="mt-2 text-base text-[#ededef]">{fact.value}</p>
                                </article>
                            ))}
                        </div>

                        {(responsibilities.length > 0 || requirements.length > 0) && (
                            <section className="mt-6 rounded-2xl bg-[#141418] p-6 sm:p-8">
                                {responsibilities.length > 0 && (
                                    <div>
                                        <h2 className="font-heading text-[22px] leading-7 font-semibold text-[#ededef]">
                                            Responsibilities
                                        </h2>
                                        <BulletList items={responsibilities} />
                                    </div>
                                )}
                                {requirements.length > 0 && (
                                    <div className={responsibilities.length > 0 ? "mt-8 border-t border-white/5 pt-8" : ""}>
                                        <h2 className="font-heading text-[22px] leading-7 font-semibold text-[#ededef]">
                                            Requirements
                                        </h2>
                                        <BulletList items={requirements} />
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    {/* Figma "Aside - Sidebar": overview rows */}
                    <aside className="h-fit rounded-2xl bg-[#141418] p-6">
                        <h2 className="font-heading text-[22px] leading-7 font-semibold text-[#ededef]">
                            Job Overview
                        </h2>
                        <ul className="mt-2">
                            {overview.map((row) => (
                                <li
                                    key={row.label}
                                    className="flex items-center justify-between gap-4 border-b border-white/5 py-3.5 last:border-b-0"
                                >
                                    <span className="text-[13px] tracking-wide text-[#a0a0ab] uppercase">{row.label}</span>
                                    <span className="text-right text-base text-[#ededef]">{row.value}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </main>

            <SiteFooter />
        </div>
    )
}
