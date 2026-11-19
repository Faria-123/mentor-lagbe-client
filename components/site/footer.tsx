import Link from "next/link"
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { Logo } from "@/components/site/logo"
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/site/social-icons"

const footerColumns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/tuitions", label: "Browse Tuitions" },
      { href: "/pricing", label: "Pricing & Pro Plans" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/about", label: "About MentorLagbe" },
    ],
  },
  {
    title: "For Students",
    links: [
      { href: "/sign-up", label: "Create an account" },
      { href: "/sign-in", label: "Sign in" },
      { href: "/dashboard/student/my-applications", label: "My applications" },
      { href: "/pricing", label: "Upgrade to Pro" },
    ],
  },
  {
    title: "For Tutors",
    links: [
      { href: "/dashboard/tutor/post-tuition", label: "Post a tuition" },
      { href: "/dashboard/tutor/my-tuitions", label: "My tuitions" },
      { href: "/dashboard/tutor/applicants", label: "Manage applicants" },
      { href: "/pricing", label: "Go Pro — unlimited posts" },
    ],
  },
]

const socialLinks = [
  { href: "https://x.com/mentorlagbe", label: "X (Twitter)", Icon: XIcon },
  {
    href: "https://facebook.com/mentorlagbe",
    label: "Facebook",
    Icon: FacebookIcon,
  },
  {
    href: "https://linkedin.com/company/mentorlagbe",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  {
    href: "https://instagram.com/mentorlagbe",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://youtube.com/@mentorlagbe",
    label: "YouTube",
    Icon: YouTubeIcon,
  },
]

const contactItems = [
  {
    href: "mailto:hello@mentorlagbe.com",
    label: "hello@mentorlagbe.com",
    Icon: MailIcon,
  },
  {
    href: "tel:+8801712345678",
    label: "+880 1712 345 678",
    Icon: PhoneIcon,
  },
  {
    href: "https://maps.google.com/?q=Dhanmondi,Dhaka,Bangladesh",
    label: "Dhanmondi, Dhaka 1209, Bangladesh",
    Icon: MapPinIcon,
  },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <Logo onDark />
            <p className="mt-4 text-sm leading-relaxed text-footer-muted">
              MentorLagbe connects students with verified tutors for
              subject-wise batches and 1-on-1 mentorship — online or in person,
              across Bangladesh and beyond.
            </p>

            <ul className="mt-6 space-y-2.5">
              {contactItems.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-flex items-center gap-2.5 text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-footer-border text-footer-muted transition-colors hover:border-footer-foreground/30 hover:bg-white/10 hover:text-footer-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:col-span-2 sm:grid-cols-3 lg:col-span-3"
          >
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xs font-semibold tracking-wider text-footer-foreground uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-footer-border py-6 text-xs text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} MentorLagbe. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Secure Pro payments powered by Stripe
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
