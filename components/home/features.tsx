import {
  Bookmark,
  ChartColumn,
  FileText,
  Medal,
  MousePointerClick,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import * as React from "react"

import { SectionHeader } from "@/components/home/section-header"
import { cn } from "@/lib/utils"

const features = [
  { icon: Search, color: "#ffffff", title: "Smart Search", desc: "Find your ideal job with advanced filters." },
  { icon: ChartColumn, color: "#f7c2ff", title: "Salary Insights", desc: "Get real salary data to negotiate confidently." },
  { icon: Medal, color: "#ffffff", title: "Top Companies", desc: "Apply to vetted companies that are hiring." },
  { icon: Bookmark, color: "#f7c2ff", title: "Saved Jobs", desc: "Manage apps & favorites on your dashboard." },
  { icon: MousePointerClick, color: "#ffffff", title: "One-Click Apply", desc: "Simplify your job applications for an easier process!" },
  { icon: FileText, color: "#f7c2ff", title: "Resume Builder", desc: "Create professional resumes with modern templates." },
  { icon: Sparkles, color: "#ffffff", title: "Skill-Based Matching", desc: "Discover jobs that match your skills and experience." },
  { icon: TrendingUp, color: "#f7c2ff", title: "Career Growth Resources", desc: "Boost your career with quick interview tips." },
] as const

function FeatureItem({
  icon: Icon,
  color,
  title,
  desc,
}: (typeof features)[number]) {
  return (
    <div className="flex items-start gap-6">
      <span className="flex size-20 shrink-0 items-center justify-center rounded-[8px] bg-[linear-gradient(135deg,#010102,#313131)]">
        <Icon aria-hidden="true" className="size-8" style={{ color, fill: color === "#f7c2ff" ? color : "none" }} />
      </span>
      <div className="pt-1">
        <h3 className="font-inter-tight text-lg font-medium text-white">{title}</h3>
        <p className="mt-2 font-inter-tight text-base leading-[26px] text-white">{desc}</p>
      </div>
    </div>
  )
}

export function Features({ className }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("bg-[#151516] px-4 py-[88px] sm:px-8 lg:py-[120px]", className)}
      data-slot="features"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader badge="features job" title="Everything you need to succeed" />
        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
