"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"

import { authClient } from "@/lib/auth-client"
import { AuthField, AuthInput, PasswordInput } from "@/components/auth/auth-fields"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending: sessionLoading } = authClient.useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const target = searchParams.get("redirect") ?? "/"

  // Already signed in — go to the target page.
  useEffect(() => {
    if (!sessionLoading && session) router.replace(target)
  }, [session, sessionLoading, router, target])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const { error: resError } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    })
    if (resError) {
      // Surface better-auth's own message (invalid credentials, etc.)
      setError(resError.message ?? "Something went wrong. Please try again.")
      setPending(false)
      return
    }
    router.replace(target)
    router.refresh()
  }

  return (
    <div className="flex flex-col">
      {/* heading */}
      <header className="flex flex-col items-start">
        <h1 className="font-heading text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-white/70">
          Sign in to continue your job hunt.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-[12px] border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <AuthField label="Email" htmlFor="login-email">
          <AuthInput
            id="login-email"
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

        <AuthField label="Password" htmlFor="login-password">
          <PasswordInput
            id="login-password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full"
          />
        </AuthField>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/80">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 accent-[#5c53fe]"
          />
          Remember me
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex h-11 w-full items-center justify-center rounded-[12px] bg-[#5c53fe] text-base font-medium text-white transition hover:bg-[#5c53fe]/85 disabled:opacity-60"
        >
          {pending ? (
            <>
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              <span className="ml-2.5">Signing in…</span>
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* divider */}
      <div className="mt-6 flex items-center gap-3">
        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.09]" />
        <span className="text-xs text-white/60">or continue with</span>
        <span aria-hidden="true" className="h-px flex-1 bg-white/[0.09]" />
      </div>

      <GoogleSignInButton callbackURL={target} className="mt-5" />

      <p className="mt-6 text-center text-sm text-white/70">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#8f88ff] underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormContent />
    </Suspense>
  )
}
