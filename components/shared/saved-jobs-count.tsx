"use client"

import * as React from "react"

import { readSavedJobIds } from "@/app/components/SaveJobButton"

/**
 * Seeker dashboard stat — the saved-jobs shortlist lives in localStorage,
 * so the count has to be read on the client.
 */
export function SavedJobsCount() {
    const [count, setCount] = React.useState<number | null>(null)

    React.useEffect(() => {
        setCount(readSavedJobIds().length)
    }, [])

    return <>{count === null ? "—" : count}</>
}
