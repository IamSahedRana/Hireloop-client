"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useState } from "react"

import { authClient } from "@/lib/auth-client"
import { AuthField, AuthInput, PasswordInput } from "@/components/auth/auth-fields"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { cn } from "@/lib/utils"

type Role = "seeker" | "recruiter"

const roles: { value: Role; label: string; blurb: string }[] = [
  { value: "seeker", label: "Job seeker", blurb: "Find and apply to jobs" },
  { value: "recruiter", label: "Recruiter", blurb: "Post jobs and hire" },
]

function RegisterFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [role, setRole] = useState<Role>("seeker")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const target = searchParams.get("redirect") ?? "/"

  const confirmError =
    confirm.length > 0 && confirm !== password ? "Passwords don't match" : undefined
  const passwordError =
    password.length > 0 && password.length < 8
      ? "Use at least 8 characters"
      : undefined

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    if (password !== confirm) {
      setFormError("Passwords don't match")
      return
    }
    setPending(true)
    const { error: resError } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
    })
    if (resError) {
      setFormError(resError.message ?? "Something went wrong. Please try again.")
      setPending(false)
      return
    }
    router.replace(target)
    router.refresh()
  }

  return (
    <div className="flex flex-col">
      <header className="flex flex-col items-start">
        <h1 className="font-heading text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-white/70">
          Join HireLoop — it only takes a minute.
        </p>
      </header>

      {formError && (
        <div
          role="alert"
          className="mt-5 rounded-[12px] border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        {/* role segmented control */}
        <div
          role="radiogroup"
          aria-label="I am joining as"
          className="grid grid-cols-2 gap-2 self-stretch"
        >
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              role="radio"
              aria-checked={role === r.value}
              onClick={() => setRole(r.value)}
              className={cn(
                "rounded-[12px] border px-3 py-2.5 text-left transition",
                role === r.value
                  ? "border-[#5c53fe] bg-[#5c53fe]/15"
                  : "border-white/[0.09] bg-[#101010] hover:bg-white/[0.04]",
              )}
            >
              <span className="block text-sm font-medium text-white">{r.label}</span>
              <span className="mt-0.5 block text-xs text-white/60">{r.blurb}</span>
            </button>
          ))}
        </div>

        <AuthField label="Full name" htmlFor="register-name">
          <AuthInput
            id="register-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Sahed Rana"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full"
          />
        </AuthField>

        <AuthField label="Email" htmlFor="register-email">
          <AuthInput
            id="register-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full"
          />
        </AuthField>

        <AuthField label="Password" htmlFor="register-password" error={passwordError}>
          <PasswordInput
            id="register-password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full"
            aria-invalid={passwordError != null || undefined}
          />
        </AuthField>

        <AuthField label="Confirm password" htmlFor="register-confirm" error={confirmError}>
          <PasswordInput
            id="register-confirm"
            name="confirmPassword"
            required
            autoComplete="new-password"
            placeholder="Re-type your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 w-full"
            aria-invalid={confirmError != null || undefined}
          />
        </AuthField>

        <button
          type="submit"
          disabled={pending || confirmError != null || passwordError != null}
          className="mt-1 flex h-11 w-full items-center justify-center rounded-[12px] bg-[#5c53fe] text-base font-medium text-white transition hover:bg-[#5c53fe]/85 disabled:opacity-60"
        >
          {pending ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              <span className="ml-2.5">Creating account…</span>
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      {/* divider */}
      <div className="mt-6 flex items-center gap-3">
        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.09]" />
        <span className="text-xs text-white/60">or sign up with</span>
        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.09]" />
      </div>

      <GoogleSignInButton callbackURL={target} className="mt-5" />

      <p className="mt-6 text-center text-sm text-white/70">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#8f88ff] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}

export function RegisterForm() {
  return (
    <Suspense fallback={null}>
      <RegisterFormContent />
    </Suspense>
  )
}
