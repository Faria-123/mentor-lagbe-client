"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useSession } from "@/components/session-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { menuItemByRole, roleLabels } from "@/lib/dashboard-menu"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useSession()
  const role = user?.role
  const items = role ? menuItemByRole[role] : []

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role ? `${roleLabels[role]} dashboard` : "Dashboard"}
          </SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  render={<Link href={item.url} />}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
