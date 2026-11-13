"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Calendar, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createJob, updateJob } from "@/lib/actions/jobs"
import { COMPANY_STORAGE_KEY } from "@/app/components/CompanyForm"
import type { Job, JobFormData, JobType } from "@/lib/types/job"
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/types/job"
import { cn } from "@/lib/utils"

const SALARY_FREQUENCIES = ["per hour", "per day", "per week", "per month", "per year"]

const inputClass =
    "bg-[#1A1A1F] border-white/10 focus-visible:border-[#5C53FE]/60 focus-visible:ring-[#5C53FE]/30 aria-invalid:border-destructive/60"
const sectionClass =
    "rounded-2xl border border-white/10 bg-[#101010]/95 p-6 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]"
const sectionHeadingClass =
    "mb-6 flex items-center gap-3 font-heading text-lg font-semibold tracking-[-0.02em] text-white"
const sectionBulletClass =
    "flex size-7 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-sm font-semibold text-[#8B85FF]"

const EMPTY_FORM: JobFormData = {
    title: "",
    companyName: "",
    category: "",
    jobType: "full-time",
    isRemote: false,
    location: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    salaryFrequency: "per hour",
    responsibilities: "",
    requirements: "",
}

function toForm(job: Job): JobFormData {
    const { _id: _id, applicants: _applicants, status: _status, posted: _posted, ...form } = job
    return form
}

/** Turn a Mongo date / protobuf timestamp string into YYYY-MM-DD for the date input. */
function toDateInput(value: string | undefined) {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toISOString().slice(0, 10)
}

const copy = {
    create: {
        overline: "Create New Listing",
        title: "Post a New Job",
        description: "Fill in the position specifications to attract qualified talent across our network.",
        submit: "Publish Job",
        success: "Job published",
    },
    edit: {
        overline: "Update Listing",
        title: "Edit Job Post",
        description: "Update the position specifications — changes go live for candidates immediately.",
        submit: "Save Changes",
        success: "Job updated",
    },
} as const

/**
 * "Post a New Job" form from the dashboard design, shared by
 * /jobs/new (create) and /jobs/edit/[id] (update it via PATCH /jobs/:id).
 */
export function JobForm({ mode, job }: { mode: "create" | "edit"; job?: Job | null }) {
    const router = useRouter()
    const [initial] = React.useState(() => (job ? toForm(job) : EMPTY_FORM))
    const [form, setForm] = React.useState<JobFormData>({ ...initial, deadline: toDateInput(job?.deadline) })
    const [submitting, setSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Creating a post: default the company name to the saved "My Company"
    // profile so recruiters don't retype it for every listing.
    React.useEffect(() => {
        if (mode !== "create") return
        try {
            const saved = JSON.parse(window.localStorage.getItem(COMPANY_STORAGE_KEY) ?? "{}") as { name?: string }
            const savedName = saved.name?.trim()
            if (savedName) {
                setForm((prev) => (prev.companyName.trim() ? prev : { ...prev, companyName: savedName }))
            }
        } catch {
            // ignore malformed localStorage — the field stays empty
        }
    }, [mode])

    // Generic flat setter so every field is just setField("key")(value).
    const set =
        <K extends keyof JobFormData>(key: K) =>
            (value: JobFormData[K]) =>
                setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        const result = mode === "edit" && job ? await updateJob(job._id, form) : await createJob(form)
        setSubmitting(false)

        if ("error" in result) {
            setError(result.error)
            toast.add({ title: mode === "edit" ? "Update failed" : "Publish failed", description: result.error, type: "error" })
            return
        }

        toast.add({
            title: copy[mode].success,
            description: `“${form.title}” — ${mode === "edit" ? "changes live now." : "candidates can apply."}`,
        })
        router.push("/dashboard/recruiter/jobs")
        router.refresh()
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium tracking-wide text-[#8B85FF] uppercase">
                        {copy[mode].overline}
                    </p>
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        {copy[mode].title}
                    </h1>
                    <p className="text-sm text-white/60">{copy[mode].description}</p>
                </div>
            </header>

            <form id="new-job-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 1. Basic Information */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className={sectionBulletClass}>1</span>
                        Basic Information
                    </h2>

                    <div className="flex flex-col gap-5">
                        {/* Job Title */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">Job title</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                minLength={3}
                                maxLength={80}
                                value={form.title}
                                onChange={(e) => set("title")(e.target.value)}
                                placeholder="e.g. Senior Product Designer"
                                className={inputClass}
                            />
                        </div>

                        {/* Company Name & Job Category */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="companyName">Company name</Label>
                                <div className="relative">
                                    <Briefcase
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        required
                                        value={form.companyName}
                                        onChange={(e) => set("companyName")(e.target.value)}
                                        placeholder="Acme Inc."
                                        className={`${inputClass} pl-9`}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="category">Job category</Label>
                                <Select
                                    value={form.category || ''}
                                    onValueChange={(value) => set("category")(value ?? "")}
                                >
                                    <SelectTrigger id="category" className={`${inputClass} w-full`}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JOB_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Job Type */}
                        <fieldset className="flex flex-col gap-2">
                            <legend className="text-sm text-[#EDEDEF]/80">Job type</legend>
                            <RadioGroup
                                value={form.jobType}
                                onValueChange={(value) => set("jobType")(value as JobType)}
                                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                            >
                                {JOB_TYPES.map((type) => {
                                    const selected = form.jobType === type

                                    return (
                                        <Label
                                            key={type}
                                            htmlFor={`job-type-${type}`}
                                            className={
                                                "flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm capitalize transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#5C53FE]/60 " +
                                                (selected
                                                    ? "border-[#5C53FE] bg-[#5C53FE]/15 text-white"
                                                    : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white")
                                            }
                                        >
                                            <RadioGroupItem
                                                value={type}
                                                id={`job-type-${type}`}
                                                className="sr-only"
                                            />
                                            {type}
                                        </Label>
                                    )
                                })}
                            </RadioGroup>
                        </fieldset>
                    </div>
                </section>

                {/* 2. Location, Compensation & Timeline */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className={sectionBulletClass}>2</span>
                        Location, Compensation &amp; Timeline
                    </h2>

                    <div className="flex flex-col gap-5">
                        {/* Remote Work Allowed (isRemote) */}
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#1A1A1F] p-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="isRemote" className="text-white/90">
                                    Remote work allowed
                                </Label>
                                <p className="text-xs text-white/50">
                                    Enable worldwide or distributed candidate applications
                                </p>
                            </div>
                            <Switch
                                id="isRemote"
                                checked={form.isRemote}
                                onCheckedChange={(checked) => set("isRemote")(checked)}
                            />
                        </div>

                        {/* Job Location & Application Deadline */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="location">
                                    Job location <span className="text-destructive/70">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="location"
                                        name="location"
                                        required={!form.isRemote}
                                        value={form.location}
                                        onChange={(e) => set("location")(e.target.value)}
                                        placeholder="e.g. New York, USA"
                                        className={`${inputClass} pl-9`}
                                    />
                                </div>
                                <p className="text-xs text-white/40">Required</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="deadline">Application deadline</Label>
                                <div className="relative">
                                    <Calendar
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="deadline"
                                        name="deadline"
                                        type="date"
                                        value={form.deadline}
                                        onChange={(e) => set("deadline")(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Salary Range (minSalary & maxSalary) */}
                        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="minSalary">Min salary / rate</Label>
                                <Input
                                    id="minSalary"
                                    name="minSalary"
                                    type="number"
                                    min={0}
                                    required
                                    placeholder="25"
                                    value={form.minSalary}
                                    onChange={(e) => set("minSalary")(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="maxSalary">Max salary / rate</Label>
                                <Input
                                    id="maxSalary"
                                    name="maxSalary"
                                    type="number"
                                    min={0}
                                    required
                                    placeholder="40"
                                    value={form.maxSalary}
                                    onChange={(e) => set("maxSalary")(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="salaryFrequency">Frequency</Label>
                                <Select
                                    value={form.salaryFrequency}
                                    onValueChange={(value) => set("salaryFrequency")(value ?? "")}
                                >
                                    <SelectTrigger id="salaryFrequency" className={`${inputClass} w-full`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SALARY_FREQUENCIES.map((frequency) => (
                                            <SelectItem key={frequency} value={frequency}>
                                                {frequency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Responsibilities & Requirements */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className={sectionBulletClass}>3</span>
                        Responsibilities &amp; Requirements
                    </h2>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="responsibilities">Key responsibilities</Label>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder="Describe the key responsibilities of the role…"
                                value={form.responsibilities}
                                onChange={(e) => set("responsibilities")(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="requirements">Qualifications &amp; requirements</Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder={"• 3+ years of experience with…\n• Solid understanding of…"}
                                value={form.requirements}
                                onChange={(e) => set("requirements")(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>
                {error && (
                    <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                        {error}
                    </p>
                )}
                <section className="flex items-center gap-3">
                    <Button type="submit" disabled={submitting} className="bg-[#5C53FE] hover:bg-[#7B74FF]">
                        <Briefcase aria-hidden />
                        {submitting ? "Saving…" : copy[mode].submit}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={submitting}
                        className="border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
                        onClick={() => router.push("/dashboard/recruiter/jobs")}
                    >
                        Cancel
                    </Button>
                </section>
            </form>
        </div>
    )
}

