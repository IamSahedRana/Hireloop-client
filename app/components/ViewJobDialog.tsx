"use client"

import * as React from "react"
import { Eye } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Job } from "@/lib/types/job"
import { formatCompensation, formatDeadline } from "@/lib/types/job"

const iconButtonClass =
    "flex size-8 items-center justify-center rounded-md border border-white/10 bg-[#1A1A1F] text-white/60 transition-colors hover:border-white/25 hover:text-white"

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium tracking-wide text-[#8B85FF] uppercase">{label}</p>
            {children}
        </div>
    )
}

/** Empty-field guard — Mongo docs from POST /jobs can have sparse strings. */
const orDash = (value: string) => value?.trim() || "—"

/** "Eye" action in the Manage Jobs table: read-only overview of the stored job. */
export function ViewJobDialog({ job }: { job: Job }) {
    return (
        <Dialog>
            <DialogTrigger render={<button type="button" aria-label={`View ${job.title}`} className={iconButtonClass} />}>
                <Eye />
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <DialogTitle className="text-left text-lg leading-tight font-semibold text-white">
                                {orDash(job.title)}
                            </DialogTitle>
                            <DialogDescription className="text-left">
                                {orDash(job.category)} · {job.isRemote ? "Remote" : orDash(job.location)}
                            </DialogDescription>
                        </div>
                        <span className="rounded-lg border border-white/10 bg-[#1A1A1F] px-2.5 py-1 text-xs capitalize text-white/80">
                            {job.jobType}
                        </span>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Section label="Company">
                        <span className="text-sm text-white">{orDash(job.companyName)}</span>
                    </Section>
                    <Section label="Location">
                        <span className="text-sm text-white">
                            {job.isRemote ? `Remote (${orDash(job.location)})` : orDash(job.location)}
                        </span>
                    </Section>
                    <Section label="Compensation">
                        <span className="text-sm whitespace-nowrap text-white">{formatCompensation(job)}</span>
                    </Section>
                    <Section label="Application deadline">
                        <span className="text-sm whitespace-nowrap text-white">{formatDeadline(job.deadline)}</span>
                    </Section>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Section label="Key responsibilities">
                            <p className="text-sm whitespace-pre-line text-white/80">{orDash(job.responsibilities)}</p>
                        </Section>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Section label="Qualifications & requirements">
                            <p className="text-sm whitespace-pre-line text-white/80">{orDash(job.requirements)}</p>
                        </Section>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
