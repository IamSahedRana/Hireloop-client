import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

function WireframeGlobe() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 964"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <g fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5">
        {/* concentric latitude rings of the dome */}
        {[430, 560, 690, 820, 950, 1080, 1210].map((r) => (
          <ellipse key={r} cx="720" cy="1038" rx={r} ry={r * 0.42} />
        ))}
        {/* vertical meridians bending out from the dome */}
        {[-7, -5, -3, -1.5, 0, 1.5, 3, 5, 7].map((s) => (
          <path key={s} d={`M ${720 + s * 60} ${260 + Math.abs(s) * 14} Q ${720 + s * 95} ${700} ${720 + s * 12} ${1038}`} />
        ))}
        {/* horizontal parallels */}
        <ellipse cx="720" cy="520" rx="700" ry="80" opacity="0.5" />
        <ellipse cx="720" cy="330" rx="430" ry="55" opacity="0.4" />
      </g>
    </svg>
  )
}

export function Cta({ className }: React.ComponentProps<"section">) {
  return (
    <section className={cn("relative overflow-hidden bg-[#010103]", className)} data-slot="cta">
      {/* line-art dome background (50% opacity, faded to black at the bottom) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(92,83,254,0.4),transparent)] blur-[110px]" />
        <div className="absolute -top-10 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(220,2,206,0.18),transparent)] blur-[100px]" />
        <WireframeGlobe />
        {/* flickering fade like Rect 2 in the design */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-[rgba(0,0,0,0.55)] to-transparent" />
      </div>

      {/* ---------- CTA content ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1320px] max-lg:min-h-[620px] flex-col items-center px-4 pt-[100px] pb-[88px] text-center sm:px-8 lg:min-h-[964px] lg:pt-[153px]" data-slot="cta-content">
        <h2 className="max-w-[800px] font-rethink text-[40px] font-medium leading-[1.2] tracking-[-1.5px] text-white sm:text-[52px] lg:text-[64px] lg:leading-[77px]">
          Your next role is
          <br className="hidden sm:block" /> already looking for you
        </h2>
        <p className="mt-4 font-heading text-lg text-white sm:text-[20px]">
          Build a profile in three minutes. The matches start arriving tomorrow morning.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="flex h-[58px] items-center rounded-[12px] bg-white px-6 text-[18px] font-semibold text-[#0b0b14] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:bg-white/90"
          >
            Create a free account
          </Link>
          <Link
            href="#pricing"
            className="flex h-[58px] items-center rounded-[12px] bg-[#0e0b16] px-6 text-[18px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:bg-[#0e0b16]/70"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
