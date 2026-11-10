"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

// Surfaces from the `Seeker / Settings` Figma frame: #141418 cards, #0c0c0f
// inputs, white primary button, #1a1a1f secondary button.
const cardClass = "rounded-2xl border border-white/5 bg-[#141418] p-6 sm:p-7"
const headingClass = "font-heading text-[22px] font-semibold text-[#ededef]"
const labelClass = "text-[13px] text-[#ededef]"
const inputClass =
    "h-[46px] border-white/10 bg-[#0c0c0f] text-[13px] text-[#ededef] placeholder:text-[#6e6e78] focus-visible:border-[#5c53fe]/60 focus-visible:ring-[#5c53fe]/30"
const primaryButton = "h-8 bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] hover:bg-white"
const secondaryButton = "h-8 border border-white/10 bg-[#1a1a1f] px-4 text-[13px] text-[#ededef] hover:bg-[#232327]"

/**
 * Shared account settings (Profile Information + Password), used by the
 * recruiter and seeker settings routes. Name and avatar persist through
 * better-auth (`authClient.updateUser`), password through
 * `authClient.changePassword`.
 */
export function SettingsForm() {
    const router = useRouter()
    const { data: session, refetch, isPending } = authClient.useSession()
    const user = session?.user

    const [name, setName] = React.useState("")
    const [savingProfile, setSavingProfile] = React.useState(false)

    const [currentPassword, setCurrentPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [savingPassword, setSavingPassword] = React.useState(false)

    // Sync the form once the session resolves (and after refetches).
    React.useEffect(() => {
        if (user?.name !== undefined) setName(user.name)
    }, [user?.name])

    const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!name.trim() || name.trim() === user?.name) {
            toast.add({ title: "Nothing to update", description: "Change your name before saving.", type: "info" })
            return
        }

        setSavingProfile(true)
        const result = await authClient.updateUser({ name: name.trim() })
        setSavingProfile(false)

        if (result?.error) {
            toast.add({ title: "Update failed", description: result.error.message ?? "Please try again.", type: "error" })
            return
        }

        toast.add({ title: "Profile updated", description: "Your name has been saved.", type: "success" })
        await refetch?.()
        router.refresh()
    }

    const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (newPassword.length < 8) {
            toast.add({ title: "Password too short", description: "Use at least 8 characters.", type: "warning" })
            return
        }
        if (newPassword !== confirmPassword) {
            toast.add({ title: "Passwords don't match", description: "Re-enter the new password.", type: "warning" })
            return
        }

        setSavingPassword(true)
        const result = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: false,
        })
        setSavingPassword(false)

        if (result?.error) {
            toast.add({
                title: "Password change failed",
                description: result.error.message ?? "Check your current password and try again.",
                type: "error",
            })
            return
        }

        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        toast.add({ title: "Password changed", description: "Use the new password on your next sign in.", type: "success" })
    }

    const changeAvatar = async (file: File | undefined) => {
        if (!file) return
        if (!file.type.startsWith("image/")) {
            toast.add({ title: "Not an image", description: "Choose a JPG, GIF or PNG file.", type: "warning" })
            return
        }
        if (file.size > 1024 * 1024) {
            toast.add({ title: "Image too large", description: "Use an image under 1 MB.", type: "warning" })
            return
        }

        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result))
            reader.onerror = () => reject(new Error("read-failed"))
            reader.readAsDataURL(file)
        }).catch(() => null)
        if (!dataUrl) {
            toast.add({ title: "Upload failed", description: "The file could not be read.", type: "error" })
            return
        }

        const result = await authClient.updateUser({ image: dataUrl })
        if (result?.error) {
            toast.add({ title: "Avatar update failed", description: result.error.message ?? "Please try again.", type: "error" })
            return
        }

        toast.add({ title: "Avatar updated", type: "success" })
        await refetch?.()
        router.refresh()
    }

    if (isPending) {
        return <p className="py-16 text-center text-sm text-[#a0a0ab]">Loading your account…</p>
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Profile Information */}
            <section className={cardClass}>
                <h2 className={headingClass}>Profile Information</h2>

                <form onSubmit={updateProfile} className="mt-6 flex flex-col gap-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-5">
                        {user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.image}
                                alt=""
                                className="size-24 rounded-full object-cover ring-1 ring-white/10"
                            />
                        ) : (
                            <span
                                aria-hidden="true"
                                className="flex size-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7b74ff,#5c53fe)] text-3xl font-semibold text-white ring-1 ring-white/15"
                            >
                                {(name.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()}
                            </span>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className={cn(secondaryButton, "inline-flex cursor-pointer items-center gap-2")}>
                                <Upload aria-hidden="true" className="size-4" />
                                Change Avatar
                                <input
                                    type="file"
                                    accept="image/jpeg,image/gif,image/png"
                                    className="sr-only"
                                    onChange={(event) => void changeAvatar(event.target.files?.[0])}
                                />
                            </label>
                            <p className="text-xs text-[#6e6e78]">JPG, GIF or PNG. Max size of 1MB.</p>
                        </div>
                    </div>

                    {/* Name + Email */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="settings-name" className={labelClass}>
                                Full Name
                            </Label>
                            <Input
                                id="settings-name"
                                required
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Jane Doe"
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="settings-email" className={labelClass}>
                                Email Address
                            </Label>
                            <Input
                                id="settings-email"
                                type="email"
                                disabled
                                value={user?.email ?? ""}
                                className={cn(inputClass, "opacity-60")}
                            />
                            <p className="text-xs text-[#6e6e78]">Email changes require verification — coming soon.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
                        <Button type="submit" disabled={savingProfile} className={primaryButton}>
                            {savingProfile ? "Saving…" : "Update Profile"}
                        </Button>
                    </div>
                </form>
            </section>

            {/* Password */}
            <section className={cardClass}>
                <h2 className={headingClass}>Password</h2>
                <p className="mt-1 text-[13px] text-[#a0a0ab]">
                    Choose a strong password of at least 8 characters.
                </p>

                <form onSubmit={changePassword} className="mt-6 flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="settings-current-password" className={labelClass}>
                                Current Password
                            </Label>
                            <Input
                                id="settings-current-password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="settings-new-password" className={labelClass}>
                                New Password
                            </Label>
                            <Input
                                id="settings-new-password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="settings-confirm-password" className={labelClass}>
                                Confirm New Password
                            </Label>
                            <Input
                                id="settings-confirm-password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
                        <Button type="submit" disabled={savingPassword} className={secondaryButton}>
                            {savingPassword ? "Updating…" : "Reset Password"}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    )
}
