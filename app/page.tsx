import { Cta } from "@/components/home/cta"
import { Features } from "@/components/home/features"
import { JobGrid } from "@/components/home/job-grid"
import { Pricing } from "@/components/home/pricing"
import { SiteFooter } from "@/components/site-footer"
import { SiteHero } from "@/components/site-hero"
import { SiteNavbar } from "@/components/site-navbar"

export default function Page() {
  return (
    <div className="min-h-svh bg-[#010103]">
      <SiteNavbar />
      <SiteHero />
      <JobGrid />
      <Features />
      <Pricing />
      <Cta />
      <SiteFooter />
    </div>
  )
}
