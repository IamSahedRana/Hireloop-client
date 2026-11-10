"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    Bookmark,
    Building2,
    Briefcase,
    FileText,
    LayoutDashboard,
    LogOut,
    PlusCircle,
    Settings,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type Role = "seeker" | "recruiter" | "admin"

type MenuItem = {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

// Sidebar nav from the `HL 2.0/Sidebar` Figma component (per-role variants).
// The recruiter column follows the design order (Dashboard, My Company,
// Manage Jobs, Applications, Settings) plus two functional additions the
// design missed, requested by the user: "Add New Post" and "Payments".
const menuItemsByRole: Record<Role, MenuItem[]> = {
    seeker: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
        { id: "jobs", name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
        { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
        { id: "applications", name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
        { id: "billing", name: "Billing", url: "/dashboard/seeker/billing", icon: Wallet },
        { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
    ],
    recruiter: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
        { id: "my-company", name: "My Company", url: "/dashboard/recruiter/my-company", icon: Building2 },
        { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
        { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
        { id: "add-new-post", name: "Add New Post", url: "/dashboard/recruiter/jobs/new", icon: PlusCircle },
        { id: "payments", name: "Payments", url: "/dashboard/recruiter/payments", icon: Wallet },
        { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
    ],
    admin: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
        { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
        { id: "companies", name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
        { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
        { id: "payments", name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
        { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
    ],
}

/**
 * `HL 2.0/Nav Item` states: item 34px tall, gap 10, radius 12;
 * Default #a1a4aa → Hover bg #1b1b1e → Active bg #232327, label #f4f4f5 and a
 * 2x16 #5c53fe indicator pinned to the left edge.
 */
function NavLink({ item, active }: { item: MenuItem; active: boolean }) {
    return (
        <Link
            href={item.url}
            aria-current={active ? "page" : undefined}
            className={cn(
                "relative flex h-[34px] items-center gap-2.5 rounded-[12px] text-[13px] font-medium transition-colors",
                active
                    ? "bg-[#232327] text-[#f4f4f5] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
                    : "text-[#a1a4aa] hover:bg-[#1b1b1e]",
            )}
        >
            {active && (
                <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-[1px] bg-[#5c53fe]"
                />
            )}
            <item.icon className="mx-0.5 size-[18px] shrink-0" aria-hidden="true" />
            <span className="truncate pr-2">{item.name}</span>
        </Link>
    )
}

async function signOutAndLeave(router: ReturnType<typeof useRouter>) {
    await authClient.signOut()
    router.push("/")
    router.refresh()
}

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = authClient.useSession()

    // The sidebar follows the area in the URL (so /dashboard/recruiter always
    // shows recruiter nav), falling back to the signed-in user's role.
    const area = pathname.startsWith("/dashboard/recruiter")
        ? "recruiter"
        : pathname.startsWith("/dashboard/seeker")
            ? "seeker"
            : pathname.startsWith("/dashboard/admin")
                ? "admin"
                : null
    const role: Role = area ?? ((session?.user.role as Role) || "seeker")
    const items = menuItemsByRole[role]

    const matches = (url: string) =>
        pathname === url || (pathname.startsWith(`${url}/`) && url !== "/dashboard/recruiter" && url !== "/dashboard/seeker" && url !== "/dashboard/admin")

    // Longest matching URL wins, so "/jobs/new" highlights "Add New Post",
    // not the shorter "Manage Jobs" prefix.
    const activeId =
        [...items]
            .filter((item) => matches(item.url))
            .sort((a, b) => b.url.length - a.url.length)[0]?.id ?? null

    return (
        <Sidebar>
            <SidebarHeader className="p-3 pt-5">
                <Link href="/" className="flex items-center justify-center">
                    <Image src="/images/logo.png" alt="HireLoop" width={112} height={32} priority />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="px-3 py-4">
                    <nav aria-label="Dashboard" className="flex flex-col">
                        {items.map((item) => (
                            <NavLink key={item.id} item={item} active={item.id === activeId} />
                        ))}
                    </nav>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-3 pb-5">
                <button
                    type="button"
                    onClick={() => void signOutAndLeave(router)}
                    className="flex h-[34px] w-full items-center gap-2.5 rounded-[12px] px-2.5 text-[13px] font-medium text-[#a1a4aa] transition-colors hover:bg-[#1b1b1e]"
                >
                    <LogOut className="size-[18px] shrink-0" aria-hidden="true" />
                    <span className="truncate pr-2">Log out</span>
                </button>
            </SidebarFooter>
        </Sidebar>
    )
}
