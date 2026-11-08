"use client"

import * as React from "react"

import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Shared field primitives for the auth forms (sign in / sign up).
 * Keeps the dark `#101010` input + subtle border style consistent.
 */

export function AuthField({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  error?: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium text-white/90">
          {label}
        </label>
        {/* hint doubles as the "Forgot password?" slot on the login form */}
        {hint != null && (
          <span className="text-xs text-white/60">{hint}</span>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export const authInputClasses = cn(
  "h-11 w-full rounded-[12px] border border-white/[0.09] bg-[#101010] px-3.5",
  "text-base text-white placeholder:text-white/50",
  "focus:border-white/25 focus:outline-none",
  "disabled:opacity-50 transition-colors",
)

export function AuthInput({ className, ...props }: React.ComponentProps<"input">) {
  return <input {...props} className={cn(authInputClasses, className)} />
}

/** Password input with a show/hide toggle (eye button) on the right edge. */
export function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(authInputClasses, "pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        // announces correctly for screen readers as visibility flips
        aria-pressed={visible}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-[12px] text-white/50 transition hover:text-white focus:outline-none focus-visible:text-white disabled:opacity-50"
      >
        {visible ? (
          <EyeOff aria-hidden="true" className="size-4.5" />
        ) : (
          <Eye aria-hidden="true" className="size-4.5" />
        )}
      </button>
    </div>
  )
}
