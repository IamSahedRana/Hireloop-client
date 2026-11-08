import Image from "next/image"
import * as React from "react"

import { cn } from "@/lib/utils"

const columns = [
  {
    heading: "Product",
    links: ["Job discovery", "Worker AI", "Companies", "Salary data"],
  },
  {
    heading: "Navigations",
    links: ["Help center", "Career library", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Brand Guideline", "Newsroom"],
  },
] as const

function PinterestIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 4.915 2.955 9.134 7.176 10.982-.102-.916-.194-2.323.04-3.325.216-.925 1.396-5.918 1.396-5.918s-.356-.712-.356-1.766c0-1.654.959-2.89 2.152-2.89 1.016 0 1.506.762 1.506 1.676 0 1.02-.651 2.547-.986 3.96-.281 1.186.594 2.152 1.764 2.152 2.117 0 3.745-2.233 3.745-5.457 0-2.854-2.052-4.85-4.983-4.85-3.395 0-5.387 2.547-5.387 5.18 0 1.026.395 2.122.889 2.72a.36.36 0 0 1 .083.343c-.091.377-.292 1.186-.332 1.352-.052.218-.173.264-.4.159-1.493-.695-2.425-2.876-2.425-4.629 0-3.767 2.739-7.229 7.897-7.229 4.144 0 7.37 2.954 7.37 6.9 0 4.121-2.6 7.439-6.21 7.439-1.213 0-2.353-.63-2.743-1.376 0 0-.6 2.284-.746 2.842-.27 1.04-1 2.343-1.488 3.138A12 12 0 1 0 12 0Z" />
    </svg>
  )
}

function FacebookIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.955.93-1.955 1.886v2.267h3.328l-.532 3.489h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  )
}

function LinkedinIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  )
}

const socials = [
  { name: "Facebook", bg: "bg-white", fg: "text-[#010103]", Icon: FacebookIcon },
  { name: "Pinterest", bg: "bg-[#5c53fe]", fg: "text-white", Icon: PinterestIcon },
  { name: "LinkedIn", bg: "bg-white", fg: "text-[#010103]", Icon: LinkedinIcon },
] as const

export function SiteFooter({ className }: React.ComponentProps<"footer">) {
  return (
    <footer className={cn("px-4 pb-10 sm:px-8", className)} data-slot="site-footer">
      <div className="mx-auto w-full max-w-[1320px] rounded-[16px] bg-[#010103] px-6 pt-10 pb-10 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Brand */}
          <div className="max-w-[288px]">
            <Image src="/images/logo.png" alt="HireLoop" width={154} height={44} />
            <p className="mt-6 font-heading text-base text-white">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:w-[632px] lg:justify-items-start">
            {columns.map((column) => (
              <div key={column.heading} className="lg:w-[163px]">
                <h3 className="font-inter-tight text-lg font-medium text-[#5c53fe]">{column.heading}</h3>
                <ul className="mt-6 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="font-heading text-base leading-[30px] text-[#d0d5dd] transition hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {socials.map(({ name, bg, fg, Icon }) => (
              <a
                key={name}
                href="#"
                aria-label={name}
                className={cn("flex size-10 items-center justify-center rounded-[8px] transition hover:opacity-80", bg, fg)}
              >
                <Icon className="size-6" />
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 lg:w-[536px] lg:justify-center">
            <p className="font-heading text-base text-[#acabb2]">Copyright 2024 —Programming Hero</p>
            <p className="font-heading text-base text-[#acabb2]">Terms &amp; Policy - Privacy Guideline</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
