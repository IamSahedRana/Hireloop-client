import Image from "next/image"
import Link from "next/link"
import { Flame, MapPin, Search, Star, Trophy, UserRound, FileSearch } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const stats = [
  { icon: FileSearch, value: "50K", label: "Active Jobs" },
  { icon: Trophy, value: "12K", label: "Companies" },
  { icon: UserRound, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  value: string
  label: string
}) {
  return (
    <div
      data-slot="site-hero-stat"
      className="flex h-[254px] flex-col rounded-[16px] border p-7 text-left bg-[radial-gradient(120%_90%_at_50%_0%,rgba(92,83,254,0.2),rgba(11,11,15,1)_65%)] border-white/[0.06]"
    >
      <Icon aria-hidden="true" className="size-6 text-white" />
      <div className="mt-auto">
        <dt className="sr-only">{label}</dt>
        <dd className="font-display text-4xl font-semibold text-white md:text-[56px]">{value}</dd>
        <dd className="mt-2 text-lg text-white/70">{label}</dd>
      </div>
    </div>
  )
}

export function SiteHero({ className }: React.ComponentProps<"section">) {
  return (
    <section className={cn("relative overflow-hidden bg-[#010103]", className)} data-slot="site-hero">
      {/* ---------- Background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* purple aura behind the headline */}
        <div className="absolute top-[16%] left-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(92,83,254,0.35),transparent)] blur-[90px]" />
        {/* magenta side glow (the excluded gradient shapes) */}
        <div className="absolute top-[38%] left-[6%] h-[340px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(220,2,206,0.2),transparent)] blur-[90px]" />
        <div className="absolute top-[38%] right-[6%] h-[340px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(220,2,206,0.2),transparent)] blur-[90px]" />
        {/* wireframe grid */}
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_42%,black,transparent)]" />
        {/* star particles */}
        <Image
          src="/images/stars.png"
          alt=""
          width={816}
          height={505}
          loading="eager"
          className="absolute top-[38%] left-1/2 w-[560px] max-w-none -translate-x-1/2 opacity-70"
        />
        {/* globe */}
        <Image
          src="/images/globe.png"
          alt=""
          width={1440}
          height={1882}
          priority
          className="absolute top-[430px] left-1/2 w-[200%] max-w-none -translate-x-1/2 sm:w-[1600px] lg:w-[1280px] [mask-image:linear-gradient(to_bottom,black_60%,rgba(0,0,0,0.45)_86%,transparent_99%)]"
        />
      </div>

      {/* ---------- Hero content ---------- */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-28 text-center sm:px-8 md:pt-36 lg:px-20">
        {/* announcement pill */}
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="hidden h-px w-16 bg-gradient-to-r from-transparent to-[#5c53fe]/60 sm:block" />
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#141416] py-2 pr-5 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <Flame aria-hidden="true" className="size-5 fill-orange-400 text-orange-400" />
            <span className="font-pixel text-sm text-white md:text-[20px]">50,000+ new jobs this month</span>
          </span>
          <span aria-hidden="true" className="hidden h-px w-16 bg-gradient-to-l from-transparent to-[#5c53fe]/60 sm:block" />
        </div>

        {/* headline */}
        <h1 className="mt-8 max-w-[900px] font-heading text-4xl font-bold tracking-[-0.02em] text-white md:text-6xl lg:text-[56px]">
          Find Your Dream Job Today
        </h1>
        <p className="mt-5 max-w-[784px] font-heading text-base font-normal text-white/90 md:text-xl">
          HireLoop connects top talent with world-class companies. Browse thousands of curated
          opportunities and land your next role — faster.
        </p>

        {/* search bar */}
        <form
          action="/browse-jobs"
          method="get"
          className="mt-9 flex h-16 w-full max-w-[784px] items-center rounded-[16px] border border-white/[0.09] bg-[#101010] p-1.5 transition focus-within:border-white/25"
        >
          <label className="sr-only" htmlFor="hero-search-query">
            Job title, skill or company
          </label>
          <Search aria-hidden="true" className="ml-3 size-5 shrink-0 text-white/50" />
          <input
            id="hero-search-query"
            name="q"
            type="search"
            placeholder="Job title, skill or company"
            className="min-w-0 flex-1 bg-transparent px-2 text-base text-white placeholder:text-white/60 focus:outline-none"
          />
          <span aria-hidden="true" className="hidden h-6 w-px bg-white/10 sm:block" />
          <label className="sr-only" htmlFor="hero-search-location">
            Location or Remote
          </label>
          <MapPin aria-hidden="true" className="ml-3 hidden size-5 shrink-0 text-white/50 sm:block" />
          <input
            id="hero-search-location"
            name="location"
            type="search"
            placeholder="Location or Remote"
            className="hidden min-w-0 flex-1 bg-transparent px-2 text-base text-white placeholder:text-white/60 focus:outline-none sm:block"
          />
          <button
            type="submit"
            className="flex h-12 shrink-0 items-center gap-2 rounded-[12px] bg-[#5c53fe] px-4 text-base font-medium text-white transition hover:bg-[#5c53fe]/85 md:px-5"
          >
            <Search aria-hidden="true" className="size-5 md:hidden" />
            <span className="hidden md:inline">Search</span>
          </button>
        </form>

        {/* trending chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <span className="font-heading text-sm text-white/90">Trending Position</span>
          {trending.map((title) => (
            <Link
              key={title}
              href={`/jobs?q=${encodeURIComponent(title)}`}
              className="rounded-full border border-white/[0.06] bg-[#1a1a1b] px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              {title}
            </Link>
          ))}
        </div>
      </div>

      {/* ---------- Stats over the globe ---------- */}
      <div className="relative z-10 mt-24 flex flex-col items-center px-4 pb-16 md:mt-36">
        <p className="max-w-[600px] text-center font-heading text-3xl font-medium text-white md:text-[40px] md:leading-[1.3]">
          Assisting over 15,000 job seekers find their dream positions.
        </p>
        <dl className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-0">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </dl>
      </div>
    </section>
  )
}

export default SiteHero
