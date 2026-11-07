"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

function NavBarLinks({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation" className={cn("flex flex-col gap-1", className)}>
      {navLinks.map((link) => {
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

function NavBarActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
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
        className="h-[52px] rounded-[12px] bg-[#5c53fe] px-6 text-base font-medium text-[#ededef] hover:bg-[#5c53fe]/85"
      >
        Get Started
      </Button>
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
          <div className="hidden h-full items-center gap-6 rounded-[16px] bg-[#1a1a1f] px-6 lg:flex" data-slot="site-navbar-desktop">
            <NavBarLinks className="flex-row items-center gap-5" itemClassName="px-0 py-0" />
            <span aria-hidden="true" className="h-6 w-px bg-[#a8a8a8]/40" />
            <div className="flex items-center gap-3">
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
                className="h-[52px] rounded-[12px] bg-[#5c53fe] px-6 text-base font-medium text-[#ededef] hover:bg-[#5c53fe]/85"
              >
                Get Started
              </Button>
            </div>
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
            <NavBarActions />
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default SiteNavbar


