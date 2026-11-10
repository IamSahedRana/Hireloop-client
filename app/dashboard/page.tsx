import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

/** `/dashboard` is just an entry point — send the user to their role's home. */
export default async function DashboardIndexPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    const role = session?.user?.role ?? "seeker"

    redirect(`/dashboard/${role}`)
}
