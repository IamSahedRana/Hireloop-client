import Link from "next/link"
import { ArrowRight, Briefcase, CircleDollarSign, MapPin } from "lucide-react"
import * as React from "react"

import { SectionHeader } from "@/components/home/section-header"
import { cn } from "@/lib/utils"

const cards = Array.from({ length: 6 })

function JobCard({ className }: { className?: string }) {
  return (
    <article
      data-slot="job-list-card"
      className={cn(
        "flex h-[363px] flex-col rounded-[24px] bg-[#151516] px-6 pt-8 pb-6 text-left",
        className,
      )}
    >
      <div>
        <h3 className="font-inter text-[28px] font-medium leading-tight text-white md:text-[32px] md:leading-[42px]">
          Frontend Developer
        </h3>
        <p className="mt-3 font-inter text-base leading-[27px] text-white/90 line-clamp-2">
          Showcase your commitment to diversity and inclusion by highlighting initiatives
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          <li className="flex h-9 items-center gap-2 rounded-full bg-[#1f1f1f] pr-4 pl-3">
            <MapPin aria-hidden="true" className="size-4 text-white" />
            <span className="font-inter-tight text-sm font-medium text-white">New York, USA</span>
          </li>
          <li className="flex h-9 items-center gap-2 rounded-full bg-[#1f1f1f] pr-4 pl-3">
            <Briefcase aria-hidden="true" className="size-4 text-white" />
            <span className="font-inter-tight text-sm font-medium text-white">Hybrid</span>
          </li>
          <li className="flex h-9 items-center gap-2 rounded-full bg-[#1f1f1f] pr-4 pl-3">
            <CircleDollarSign aria-hidden="true" className="size-4 text-white" />
            <span className="font-inter-tight text-sm font-medium text-white">€25–€40/hour</span>
          </li>
        </ul>
      </div>
      <Link
        href="/browse-jobs"
        className="mt-auto flex h-[55px] w-[154px] items-center justify-between rounded-[12px] bg-[#0b0b0c] px-6 text-[16px] font-semibold text-white transition hover:bg-[#0b0b0c]/70"
      >
        Apply Now
        <ArrowRight aria-hidden="true" className="size-6" />
      </Link>
    </article>
  )
}

export function JobGrid({ className }: React.ComponentProps<"section">) {
  return (
    <section className={cn("px-4 py-[88px] sm:px-8 lg:py-[120px]", className)} data-slot="job-grid">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader
          badge="Smart job discovery"
          title="The roles you'd never find by searching"
        />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((_, index) => (
            <JobCard key={index} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/browse-jobs"
            className="flex h-[58px] items-center rounded-[12px] bg-white px-6 text-[18px] font-medium text-[#0b0b14] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition hover:bg-white/90"
          >
            View all job open
          </Link>
        </div>
      </div>
    </section>
  )
}
