import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Shared layout for the auth pages (sign in / sign up):
 * dark brand background, a soft aura, and a centered logo + card.
 */
export function AuthShell({
  children,
  className,
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="auth-shell"
      className={cn("relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#010103] px-4 py-12", className)}
    >
      {/* background aura — mirrors the hero's look */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(92,83,254,0.22),transparent)] blur-[90px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_60%_45%_at_50%_28%,black,transparent)]" />
      </div>

      <Link href="/" aria-label="HireLoop home" className="relative mb-8 flex items-center">
        <Image src="/images/logo.png" alt="HireLoop" width={154} height={44} priority />
      </Link>

      <div className="relative z-10 w-full max-w-[420px] rounded-[16px] border border-white/[0.06] bg-[#141416] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_4px_rgba(0,0,0,0.28)] sm:p-8">
        {children}
      </div>
    </main>
  )
}
