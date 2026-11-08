import * as React from "react"

import { cn } from "@/lib/utils"

export function SectionHeader({
  badge,
  title,
  className,
}: {
  badge: string
  title: string
  className?: string
}) {
  return (
    <div className={cn("mx-auto flex max-w-[600px] flex-col items-center text-center", className)}>
      <p className="flex items-center gap-4">
        <span aria-hidden="true" className="size-2 rounded-full bg-[#5c53fe]" />
        <span className="font-pixel text-[20px] leading-6 text-white">{badge}</span>
        <span aria-hidden="true" className="size-2 rounded-full bg-[#5c53fe]" />
      </p>
      <h2 className="mt-4 font-heading text-[40px] font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[48px]">
        {title}
      </h2>
    </div>
  )
}
