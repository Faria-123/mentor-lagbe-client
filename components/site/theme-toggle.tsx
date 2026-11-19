"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

/**
 * Renders both icons and lets CSS pick one based on the `.dark` class so
 * there is no hydration mismatch and no mount effect is required.
 */
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className={cn("text-muted-foreground hover:text-foreground", className)}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </Button>
  )
}

export { ThemeToggle }
