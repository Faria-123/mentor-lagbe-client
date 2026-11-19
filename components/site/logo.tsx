import Link from "next/link"
import { GraduationCapIcon } from "lucide-react"
import { cn } from "cn"

type LogoProps = {
  className?: string
  href?: string
  /** Use light text colours, e.g. on the dark footer. */
  onDark?: boolean
  /** Hide the "MentorLagbe" wordmark and render the mark only. */
  markOnly?: boolean
}

function Logo({
  className,
  href = "/",
  onDark = false,
  markOnly = false,
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="MentorLagbe home"
      className={cn(
        "group/logo inline-flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-brand to-emerald-600 text-white shadow-sm ring-1 ring-brand/30 transition-transform duration-200 group-hover/logo:-rotate-6 dark:to-emerald-500">
        <GraduationCapIcon className="size-5" strokeWidth={2.1} />
      </span>
      {!markOnly && (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight",
            onDark ? "text-white" : "text-foreground"
          )}
        >
          Mentor
          <span className={onDark ? "text-emerald-300" : "text-brand"}>
            Lagbe
          </span>
        </span>
      )}
    </Link>
  )
}

export { Logo }
