/**
 * Payments. The backend records a payment after re-verifying the Stripe
 * checkout session server-side; the client only ever passes session ids.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type PaymentRecord = {
    sessionId: string
    userId: string
    plan: string
    amount: number
    currency: string
    status: string
    paidAt: string
}

/** Is this account on the paid plan? (drives the billing page + paywall UI) */
export async function fetchPaymentStatus(userId: string): Promise<{ paid: boolean; payment: PaymentRecord | null }> {
    try {
        const res = await fetch(`${BASE_URL}/payments/status?userId=${encodeURIComponent(userId)}`, {
            cache: "no-store",
        })
        if (!res.ok) return { paid: false, payment: null }
        const data = await res.json()
        return { paid: !!data?.paid, payment: data?.payment ?? null }
    } catch {
        return { paid: false, payment: null }
    }
}

/**
 * Ask the backend to record a completed checkout session. The backend
 * re-verifies the session against Stripe with its own secret key, credits
 * the buyer from the session metadata and is idempotent (safe on refresh).
 */
export async function recordPayment(
    sessionId: string,
): Promise<{ ok: boolean; alreadyRecorded: boolean; payment?: PaymentRecord }> {
    try {
        const res = await fetch(`${BASE_URL}/payments/record`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ sessionId }),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) return { ok: false, alreadyRecorded: false }
        return { ok: true, alreadyRecorded: !!data?.alreadyRecorded, payment: data?.payment }
    } catch {
        return { ok: false, alreadyRecorded: false }
    }
}
