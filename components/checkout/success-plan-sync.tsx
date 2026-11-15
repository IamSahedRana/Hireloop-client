"use client"

import * as React from "react"

import { toast } from "@/components/ui/toast"
import { getPlan } from "@/lib/plans"

const STORAGE_KEY = "hireloop:plan"

/**
 * Runs once on the verified checkout success page: persists the purchased
 * plan (the same key BillingContent reads) and confirms with a toast.
 */
export function SuccessPlanSync({ planId, planName }: { planId: string; planName: string }) {
    React.useEffect(() => {
        const plan = getPlan(planId)
        if (!plan) return
        window.localStorage.setItem(STORAGE_KEY, plan.id)
        toast.add({
            title: "Payment successful",
            description: `You're now on the ${plan.name} — ${plan.price ? `$${plan.price}/mo` : "free"}.`,
            type: "success",
        })
    }, [planId, planName])

    return null
}
