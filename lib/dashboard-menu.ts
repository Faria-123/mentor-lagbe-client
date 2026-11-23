import type { LucideIcon } from "lucide-react"
import {
  BookOpenIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react"

import type { UserRole } from "@/lib/types"

export type DashboardMenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

export const roleLabels: Record<UserRole, string> = {
  student: "Student",
  tutor: "Tutor",
  admin: "Admin",
}

/**
 * Sidebar links per role, mirroring the dashboard routes in the assignment
 * brief. Keep in sync with `app/dashboard/<role>/` pages.
 */
export const menuItemByRole: Record<UserRole, DashboardMenuItem[]> = {
  student: [
    {
      id: "student-overview",
      name: "Overview",
      url: "/dashboard/student",
      icon: LayoutDashboardIcon,
    },
    {
      id: "student-applications",
      name: "My Applications",
      url: "/dashboard/student/my-applications",
      icon: FileTextIcon,
    },
  ],
  tutor: [
    {
      id: "tutor-overview",
      name: "Overview",
      url: "/dashboard/tutor",
      icon: LayoutDashboardIcon,
    },
    {
      id: "tutor-post-tuition",
      name: "Post a Tuition",
      url: "/dashboard/tutor/post-tuition",
      icon: PlusCircleIcon,
    },
    {
      id: "tutor-my-tuitions",
      name: "My Tuitions",
      url: "/dashboard/tutor/my-tuitions",
      icon: BookOpenIcon,
    },
    {
      id: "tutor-applicants",
      name: "Applicants",
      url: "/dashboard/tutor/applicants",
      icon: UsersIcon,
    },
  ],
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboardIcon,
    },
    {
      id: "admin-users",
      name: "Users",
      url: "/dashboard/admin/users",
      icon: UserCogIcon,
    },
    {
      id: "admin-tuitions",
      name: "Tuition Approvals",
      url: "/dashboard/admin/tuitions",
      icon: ShieldCheckIcon,
    },
    {
      id: "admin-transactions",
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: ReceiptIcon,
    },
  ],
}
