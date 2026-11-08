import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { SiteNavbar } from "@/components/site-navbar"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Profile — HireLoop",
  description: "Manage your HireLoop account details and professional profile.",
}

const roleLabels: Record<string, { label: string; className: string }> = {
  seeker: { label: "Job Seeker", className: "border-[#5c53fe]/40 bg-[#5c53fe]/15 text-[#b3adff]" },
  recruiter: { label: "Recruiter", className: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" },
  admin: { label: "Admin", className: "border-amber-500/40 bg-amber-500/15 text-amber-300" },
}

function RoleBadge({ role }: { role: string | null | undefined }) {
  const badge = roleLabels[role ?? "seeker"] ?? roleLabels.seeker
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", badge.className)}>
      {badge.label}
    </span>
  )
}

/** Circle with the user's initial — same treatment as the navbar avatar, at Figma's 96px. */
function BigAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "U"
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex size-24 items-center justify-center rounded-full text-4xl font-semibold text-white",
        "bg-[linear-gradient(135deg,#7b74ff,#5c53fe)]",
        "shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_8px_24px_rgba(92,83,254,0.35)] ring-1 ring-white/20",
      )}
    >
      {initial}
    </div>
  )
}

export default async function ProfilePage() {
  const sessionData = await auth.api.getSession({ headers: await headers() })

  if (!sessionData?.user) redirect("/login?redirect=/profile")

  const { user, session } = sessionData
  const joined = session?.createdAt
    ? new Date(session.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null

  return (
    <div className="min-h-svh bg-[#010103]">
      <SiteNavbar />

      <main className="px-4 pt-10 pb-20 sm:px-8 lg:px-20">
        <div className="mx-auto w-full max-w-4xl">
          <header>
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl">Profile Information</h1>
            <p className="mt-2 text-base text-white/70">
              Manage your account details and professional profile.
            </p>
          </header>

          <section
            data-slot="profile-card"
            className="mt-6 rounded-[16px] border border-white/[0.06] bg-[#141416] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8"
          >
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <BigAvatar name={user.name ?? "User"} />
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">{user.name}</h2>
                  <RoleBadge role={user.role} />
                </div>
                <p className="mt-1 text-sm text-white/70">{user.email}</p>
                {joined && (
                  <p className="mt-1 text-sm text-white/50">Member since {joined}</p>
                )}
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
              <div className="rounded-[12px] border border-white/[0.06] bg-[#101010] p-4">
                <dt className="text-xs uppercase tracking-wide text-white/50">Full name</dt>
                <dd className="mt-1 text-base text-white">{user.name}</dd>
              </div>
              <div className="rounded-[12px] border border-white/[0.06] bg-[#101010] p-4">
                <dt className="text-xs uppercase tracking-wide text-white/50">Email</dt>
                <dd className="mt-1 text-base text-white">{user.email}</dd>
              </div>
            </dl>

            {/* TODO: editable fields (avatar upload, etc.) once the dashboard API exists */}
          </section>
        </div>
      </main>
    </div>
  )
}
