"use client"

import * as React from "react"
import { Building2, ExternalLink, Globe, MapPin, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const cardClass = "rounded-2xl border border-white/5 bg-[#141418] p-6 sm:p-7"
const headingClass = "font-heading text-[22px] font-semibold text-[#ededef]"
const labelClass = "text-[13px] text-[#ededef]"
const inputClass =
    "h-[46px] border-white/10 bg-[#0c0c0f] text-[13px] text-[#ededef] placeholder:text-[#6e6e78] focus-visible:border-[#5c53fe]/60 focus-visible:ring-[#5c53fe]/30"

type CompanyProfile = {
    name: string
    tagline: string
    website: string
    location: string
    teamSize: string
    about: string
}

const EMPTY: CompanyProfile = { name: "", tagline: "", website: "", location: "", teamSize: "", about: "" }

/** Company profiles live in localStorage until the backend grows a companies collection. */
export const COMPANY_STORAGE_KEY = "hireloop:company"

function readCompany(): CompanyProfile {
    if (typeof window === "undefined") return EMPTY
    try {
        return { ...EMPTY, ...JSON.parse(window.localStorage.getItem(COMPANY_STORAGE_KEY) ?? "{}") }
    } catch {
        return EMPTY
    }
}

/**
 * "My Company" — the company profile new job posts default to. Saving here
 * prefills the company name in the "Post a New Job" form.
 */
export function CompanyForm() {
    const [form, setForm] = React.useState<CompanyProfile>(EMPTY)
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        setForm(readCompany())
        setReady(true)
    }, [])

    const set =
        <K extends keyof CompanyProfile>(key: K) =>
            (value: CompanyProfile[K]) =>
                setForm((prev) => ({ ...prev, [key]: value }))

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!form.name.trim()) {
            toast.add({ title: "Company name required", description: "Give your company a name first.", type: "warning" })
            return
        }
        window.localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(form))
        toast.add({
            title: "Company profile saved",
            description: `New job posts will default to “${form.name.trim()}”.`,
            type: "success",
        })
    }

    return (
        <form onSubmit={save} className="max-w-3xl">
            <section className={cardClass}>
                {/* Identity preview */}
                <div className="flex items-center gap-4">
                    <span
                        aria-hidden="true"
                        className="flex size-16 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7b74ff,#5c53fe)] text-2xl font-semibold text-white ring-1 ring-white/15"
                    >
                        {form.name.trim() ? form.name.trim().charAt(0).toUpperCase() : <Building2 className="size-7" />}
                    </span>
                    <div className="flex min-w-0 flex-col">
                        <p className="truncate font-heading text-lg font-semibold text-[#ededef]">
                            {form.name.trim() || "Your company"}
                        </p>
                        <p className="truncate text-[13px] text-[#a0a0ab]">
                            {form.tagline.trim() || "Add a short tagline below"}
                        </p>
                    </div>
                </div>

                <div className="mt-7 flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="company-name" className={labelClass}>Company Name</Label>
                            <Input
                                id="company-name"
                                required
                                value={form.name}
                                onChange={(event) => set("name")(event.target.value)}
                                placeholder="Acme Inc."
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="company-tagline" className={labelClass}>Tagline</Label>
                            <Input
                                id="company-tagline"
                                value={form.tagline}
                                onChange={(event) => set("tagline")(event.target.value)}
                                placeholder="Hiring tools that loop you in"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="company-website" className={labelClass}>
                                <span className="flex items-center gap-1.5">
                                    <Globe aria-hidden="true" className="size-3.5 text-[#a0a0ab]" /> Website
                                </span>
                            </Label>
                            <Input
                                id="company-website"
                                type="url"
                                value={form.website}
                                onChange={(event) => set("website")(event.target.value)}
                                placeholder="https://acme.com"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="company-location" className={labelClass}>
                                <span className="flex items-center gap-1.5">
                                    <MapPin aria-hidden="true" className="size-3.5 text-[#a0a0ab]" /> HQ Location
                                </span>
                            </Label>
                            <Input
                                id="company-location"
                                value={form.location}
                                onChange={(event) => set("location")(event.target.value)}
                                placeholder="New York, USA"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="company-size" className={labelClass}>
                                <span className="flex items-center gap-1.5">
                                    <Users aria-hidden="true" className="size-3.5 text-[#a0a0ab]" /> Team Size
                                </span>
                            </Label>
                            <Input
                                id="company-size"
                                value={form.teamSize}
                                onChange={(event) => set("teamSize")(event.target.value)}
                                placeholder="10–50"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="company-about" className={labelClass}>About</Label>
                        <Textarea
                            id="company-about"
                            rows={5}
                            maxLength={1200}
                            value={form.about}
                            onChange={(event) => set("about")(event.target.value)}
                            placeholder="What does your company do? What's the culture like?"
                            className={cn(inputClass, "h-auto py-3")}
                        />
                    </div>

                    {form.website.trim() !== "" && (
                        <a
                            href={form.website}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center gap-1.5 text-[13px] text-[#8f88ff] hover:underline"
                        >
                            Visit {form.website}
                            <ExternalLink aria-hidden="true" className="size-3.5" />
                        </a>
                    )}
                </div>

                <div className="mt-7 flex items-center gap-3 border-t border-white/5 pt-5">
                    <Button
                        type="submit"
                        disabled={!ready}
                        className="h-8 bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] hover:bg-white"
                    >
                        Save Company
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setForm(EMPTY)}
                        className="h-8 border border-white/10 bg-[#1a1a1f] px-4 text-[13px] text-[#ededef] hover:bg-[#232327]"
                    >
                        Clear
                    </Button>
                </div>
            </section>
        </form>
    )
}
