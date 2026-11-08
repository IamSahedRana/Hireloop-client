"use client"

import Link from "next/link"
import { ArrowRight, Check, Zap } from "lucide-react"
import * as React from "react"

import { SectionHeader } from "@/components/home/section-header"
import { cn } from "@/lib/utils"

const sharedFeatures = [
  "Daily AI match brief (top 5)",
  "Verified salary bands",
  "Company insight dashboards",
  "1‑click apply, unlimited",
]

const premiumFeatures = [
  "Everything in Pro",
  "Multi-profile career portfolios",
  "Shared talent rooms",
  "Recruiter view (read-only)",
]

function PriceCard({
  plan,
  price,
  features,
  highlighted,
  className,
}: {
  plan: string
  price: string
  features: readonly string[]
  highlighted?: boolean
  className?: string
}) {
  return (
    <article
      data-slot="price-card"
      className={cn(
        "flex h-[450px] flex-col rounded-[24px] p-6 text-left",
        highlighted ? "rounded-[32px] bg-[#151516] shadow-[inset_0_0_60px_rgba(120,120,120,0.25)]" : "bg-[#010103]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#1c1c1d]">
            <Zap aria-hidden="true" className="size-6 text-white" />
          </span>
          <h3 className="font-display text-2xl tracking-[-0.5px] text-white">{plan}</h3>
        </div>
        <p className="flex items-start gap-2">
          <span className="font-display text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-white">
            {price}
          </span>
          <span className="pt-4 font-inter-tight text-sm text-white">/month</span>
        </p>
      </div>

      <p className="mt-8 font-inter text-[18px] leading-[27px] text-white">
        Start building your insights hub:
      </p>
      <ul className="mt-[13px] flex flex-col gap-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[#595959]">
              <Check aria-hidden="true" className="size-4 text-white" />
            </span>
            <span className="font-inter text-base text-white">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/register"
        className={cn(
          "mt-auto flex h-[55px] w-full items-center justify-between rounded-[12px] px-6 text-[16px] font-semibold transition",
          highlighted ? "bg-white text-[#010103] hover:bg-white/90" : "bg-[#595959] text-white hover:bg-[#595959]/80",
        )}
      >
        Choose This Plan
        <ArrowRight aria-hidden="true" className="size-6" />
      </Link>
    </article>
  )
}

export function Pricing({ className }: React.ComponentProps<"section">) {
  const [billing, setBilling] = React.useState<"monthly" | "yearly">("yearly")

  return (
    <section id="pricing" className={cn("px-4 py-[88px] sm:px-8 lg:py-[120px]", className)} data-slot="pricing">
      <div className="mx-auto w-full max-w-[1320px]">
        <SectionHeader badge="Pricing" title="Pay for the leverage, not the listings" />

        <div className="mt-16 flex justify-center">
          <div className="flex w-[257px] items-center rounded-[36px] bg-white p-2">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
              className={cn(
                "flex h-[43px] w-[101px] items-center justify-center rounded-[40px] bg-[#090a15]/0 text-[18px] font-medium tracking-[-0.02em] text-[#010103]/40 transition",
                billing === "monthly" && "bg-[#090a15] text-white",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              aria-pressed={billing === "yearly"}
              className={cn(
                "flex h-[43px] items-center justify-center gap-[10px] rounded-[40px] bg-[#090a15]/0 px-3 text-[18px] font-medium tracking-[-0.02em] text-[#010103]/40 transition",
                billing === "yearly" && "bg-[#090a15] text-white",
              )}
            >
              Yearly
              <span
                className={cn(
                  "flex h-[27px] items-center rounded-[24px] bg-[#010103]/10 px-[10px] pt-px font-sans text-[16px] transition",
                  billing === "yearly" ? "bg-[#dc02ce] text-white" : "text-[#010103]",
                )}
              >
                25%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PriceCard plan="Starter" price="$0" features={sharedFeatures} />
          <PriceCard plan="Growth" price="$17" features={sharedFeatures} highlighted />
          <PriceCard plan="Premium" price="$99" features={premiumFeatures} />
        </div>
      </div>
    </section>
  )
}
