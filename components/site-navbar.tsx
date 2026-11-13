"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, LogOut, Menu, UserRound, X } from "lucide-react"
import * as React from "react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useSignOut } from "@/components/shared/use-sign-out"
import { cn } from "@/lib/utils"

// Nav items from the Figma `nav-bar` (Browse Jobs · Company · Pricing).
// "Dashboard" is a functional addition per request: signed-in users only.
const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard", authOnly: true },
]

function NavBarLinks({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  const pathname = usePathname()
  // Dashboard is session-gated: wait for the store to resolve (isPending)
  // so the signed-in state never leaks into SSR HTML or hydration flash.
  const { data: session, isPending } = authClient.useSession()

  const links = navLinks.filter((link) => !link.authOnly || (!isPending && !!session?.user))

  return (
    <nav aria-label="Main navigation" className={cn("flex flex-col gap-1", className)}>
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "px-2 py-1 text-base text-[#ededef] transition-colors hover:text-white data-[active=false]:font-normal data-[active=true]:font-semibold",
              itemClassName
            )}
            data-active={isActive}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

/** Right-side cluster for the navbar bar: buttons when signed out, avatar menu when signed in. */
function NavBarAuth({ className }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession()
  const { signOut, loggingOut } = useSignOut()

  const user = session?.user ?? null

  // keep the bar from jumping while the session resolves
  if (isPending) {
    return (
      <div className={cn("flex items-center gap-3 px-3", className)} aria-hidden="true">
        <span className="hidden h-2.5 w-24 rounded-full bg-white/10 xl:block" />
        <span className="size-8 rounded-full bg-white/10" />
      </div>
    )
  }

  // signed out → Figma's white "Sign In" + brand "Get Started"
  if (!user) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link href="/login" />}
          className="h-[38px] rounded-[12px] bg-white px-4 text-base font-medium text-[#645bff] hover:bg-white/90"
        >
          Sign In
        </Button>
        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link href="/register" />}
          className="hidden h-[52px] rounded-[12px] bg-[#5c53fe] px-6 text-base font-medium text-[#ededef] hover:bg-[#5c53fe]/85 sm:flex"
        >
          Get Started
        </Button>
      </div>
    )
  }

  return (
    <div data-slot="site-navbar-user" className={cn("flex items-center gap-2 px-2", className)}>
      <span className="hidden text-sm text-white/70 xl:inline">
        Welcome,{" "}
        <span className="font-semibold text-white">{user.name}</span>
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Account menu"
          data-slot="site-navbar-avatar"
          className={cn(
            "flex items-center gap-1 rounded-full p-1 outline-none transition",
            "hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/70",
          )}
        >
          <UserAvatar name={user.name} className="size-8" />
          <ChevronDown aria-hidden="true" className="size-4 text-white/60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className={cn(
            "w-64 rounded-[12px] border border-white/[0.09]",
            "bg-[#141416] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)]",
          )}
        >
          {/* header: who is signed in */}
          <div className="flex items-center gap-3 rounded-[10px] bg-[#1a1a1f] p-3">
            <UserAvatar name={user.name} className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-xs text-white/60">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator className="mx-1 my-1.5 bg-white/[0.09]" />
          <DropdownMenuItem
            render={<Link href="/profile" />}
            className={cn(
              "gap-2.5 rounded-[10px] px-3 py-2 text-sm text-[#ededef]",
              "hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white",
            )}
          >
            <UserRound aria-hidden="true" className="size-4 text-white/70" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => {
              event.preventDefault()
              void signOut()
            }}
            disabled={loggingOut}
            variant="destructive"
            className={cn(
              "gap-2.5 rounded-[10px] px-3 py-2 text-sm data-[variant=destructive]:text-red-400",
              "focus:bg-red-500/10 focus:text-red-300",
            )}
          >
            <LogOut aria-hidden="true" className="size-4 text-red-400" />
            {loggingOut ? "Logging out…" : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function SiteNavbar({ className }: React.ComponentProps<"header">) {
  const [open, setOpen] = React.useState(false)

  // Close the mobile menu whenever the route changes.
  const pathname = usePathname()
  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className={cn("px-4 pt-4 sm:px-8 lg:px-20", className)} data-slot="site-navbar">
      <div className="mx-auto w-full max-w-7xl">
        <div
          data-slot="site-navbar-bar"
          className="relative flex h-[68px] items-center justify-between rounded-[16px] bg-[#141418] py-2 pr-2 pl-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_4px_rgba(0,0,0,0.28)]"
        >
          {/* Logo */}
          <Link href="/" aria-label="HireLoop home" className="flex shrink-0 items-center rounded-lg">
            <Image src="/images/logo.png" alt="HireLoop" width={154} height={44} priority />
          </Link>

          {/* Desktop nav pill */}
          <div className="hidden h-full items-center gap-4 rounded-[16px] bg-[#1a1a1f] pr-2 pl-6 lg:flex" data-slot="site-navbar-desktop">
            <NavBarLinks className="flex-row items-center gap-5" itemClassName="px-0 py-0" />
            <span aria-hidden="true" className="h-6 w-px bg-[#a8a8a8]/40" />
            <NavBarAuth />
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-controls="site-navbar-mobile"
            aria-label={open ? "Close menu" : "Open menu"}
            className="size-10 rounded-[12px] bg-[#1a1a1f] text-[#ededef] hover:bg-[#1a1a1f]/70 hover:text-white lg:hidden"
            onClick={() => setOpen((previous) => !previous)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile menu panel */}
        {open ? (
          <div
            id="site-navbar-mobile"
            data-slot="site-navbar-mobile"
            className="mt-2 rounded-[16px] bg-[#1a1a1f] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.28)] lg:hidden"
          >
            <NavBarLinks className="gap-2" />
            <span aria-hidden="true" className="my-3 block h-px w-full bg-[#a8a8a8]/40" />
            <div className="flex flex-wrap items-center justify-end gap-3">
              <NavBarAuth />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default SiteNavbar
