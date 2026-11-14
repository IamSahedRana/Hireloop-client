"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * HireLoop is a dark-only design (every surface uses hardcoded dark colors,
 * e.g. #08080a / #141418, plus the dark CSS variables in globals.css).
 * Forcing the theme keeps `<html class="dark">` on every device — with
 * `defaultTheme="system"` a light-mode OS left the `dark` class off, so
 * CSS-var surfaces like the mobile sidebar Sheet (`bg-sidebar`) rendered
 * with the light values and flashed white.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="dark"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
