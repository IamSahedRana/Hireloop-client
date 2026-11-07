import { SiteHero } from "@/components/site-hero"
import { SiteNavbar } from "@/components/site-navbar"

export default function Page() {
  return (
    <div className="bg-[#010103] min-h-svh">
      <SiteNavbar />
      <SiteHero />
    </div>
  )
}
