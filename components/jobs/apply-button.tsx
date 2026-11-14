"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { createApplication, fetchApplications } from "@/lib/api/applications"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const buttonClass =
    "inline-flex h-12 items-center justify-center rounded-lg px-4 text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"

/**
 * Figma "Apply Now" button, wired to the applications backend:
 * - signed out → links to /login?redirect=<redirectTo>, so after signing in
 *   the user lands back on the page they applied from
 * - signed in → POSTs the application, toasts and flips to a disabled
 *   "Applied" state (duplicate applications are prevented via the API list)
 */
export function ApplyButton({
    jobId,
    title,
    companyName,
    redirectTo,
    className,
}: {
    jobId: string
    title: string
    companyName: string
    /** Where "sign in first" should return to, e.g. the details page URL. */
    redirectTo: string
    className?: string
}) {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()
    const [applied, setApplied] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)

    // signed in → check whether this job is already applied to
    React.useEffect(() => {
        const userId = session?.user?.id
        if (!userId) return
        let cancelled = false
        void fetchApplications({ applicantId: userId }).then((applications) => {
            if (!cancelled) setApplied(applications.some((application) => application.jobId === jobId))
        })
        return () => {
            cancelled = true
        }
    }, [session, jobId])

    async function handleApply() {
        if (!session?.user) return
        setSubmitting(true)
        const ok = await createApplication({
            userId: session.user.id,
            jobId,
            jobTitle: title,
            companyName,
            candidateName: session.user.name ?? "",
        })
        setSubmitting(false)
        if (ok) {
            setApplied(true)
            toast.add({
                title: "Application submitted",
                description: `“${title}” — track it under Dashboard → Applications.`,
                type: "success",
            })
            router.refresh() // keeps the applicant counter in sync
        } else {
            toast.add({
                title: "Couldn't submit application",
                description: "The applications service didn't respond. Please try again.",
                type: "error",
            })
        }
    }

    // keep the Figma button shape while the session resolves
    if (isPending) {
        return <span aria-hidden="true" className={cn(buttonClass, "bg-[#fafafa] text-transparent", className)} />
    }

    if (applied) {
        return (
            <span className={cn(buttonClass, "cursor-default border border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e]", className)}>
                Applied
            </span>
        )
    }

    if (!session?.user) {
        return (
            <Link
                href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                className={cn(buttonClass, "bg-[#fafafa] text-[#0b0b0c] hover:bg-white", className)}
            >
                Apply Now
            </Link>
        )
    }

    return (
        <button
            type="button"
            onClick={() => void handleApply()}
            disabled={submitting}
            className={cn(buttonClass, "bg-[#fafafa] text-[#0b0b0c] hover:bg-white", className)}
        >
            {submitting ? "Submitting…" : "Apply Now"}
        </button>
    )
}
