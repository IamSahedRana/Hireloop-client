"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/ui/toast"

/**
 * Runs once on the verified checkout success page: confirms the upgrade with
 * a toast and returns the user to where they were before paying (the job
 * they were applying to, their billing page, …) after a short delay.
 */
export function SuccessReturn({ returnTo }: { returnTo: string }) {
    const router = useRouter()

    React.useEffect(() => {
        toast.add({
            title: "Payment successful",
            description: "You're on the Pro Plan — unlimited applications unlocked.",
            type: "success",
        })
        // give the user a moment to see the receipt, then continue automatically
        const timer = setTimeout(() => {
            router.replace(returnTo)
            router.refresh()
        }, 3500)
        return () => clearTimeout(timer)
    }, [returnTo, router])

    return null
}
