"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

/**
 * Shared sign-out flow for the site navbar and dashboard sidebar:
 * ends the better-auth session, returns to the landing page and refreshes
 * server components. Returns the pending state for "Logging out…" labels.
 */
export function useSignOut() {
    const router = useRouter()
    const [loggingOut, setLoggingOut] = React.useState(false)

    const signOut = React.useCallback(async () => {
        setLoggingOut(true)
        try {
            await authClient.signOut()
            router.replace("/")
            router.refresh()
        } finally {
            setLoggingOut(false)
        }
    }, [router])

    return { signOut, loggingOut }
}
