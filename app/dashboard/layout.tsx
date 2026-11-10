import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toast"

import { DashboardSidebar } from "../components/DashboardSidebar"
import { auth } from "@/lib/auth"

// Recruiter dashboard surface colors straight from the Figma frame:
// sidebar #0b0b0c, content #0e0e11, items #232327 (active) / #1b1b1e (hover).
const sidebarThemeClass =
    "[--sidebar:#0b0b0c] [--sidebar-foreground:#a1a4aa] [--sidebar-border:#232327] " +
    "[--sidebar-accent:#232327] [--sidebar-accent-foreground:#f4f4f5] [--sidebar-ring:#5c53fe]"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    // Server-side gate — every dashboard route requires a signed-in session.
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) redirect("/login?redirect=/dashboard/recruiter")

    return (
        <SidebarProvider className={sidebarThemeClass}>
            <DashboardSidebar></DashboardSidebar>
            <main className="min-h-svh min-w-0 flex-1 flex-col bg-[#0e0e11] text-white">
                {children}
            </main>
            <Toaster />
        </SidebarProvider>
    )
}

export default DashboardLayout
