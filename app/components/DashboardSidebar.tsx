import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton

} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
const menuItemByRole = {
    student: [],
    tutor: [],
    admin: []
}
export function DashboardSidebar() {
    const { data: session, isPending } = useSession()
    const role = session?.user?.role || "student"
    const projects = menuItemByRole[role] || []
    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
                <SidebarGroup />
                <SidebarMenu>
                    {/* {projects.map((project) => (
                        <SidebarMenuItem key={project.id}>
                            <SidebarMenuButton render={<a href={project.url} />}>
                                <project.icon />
                                <span>{project.name}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))} */}
                </SidebarMenu>
                <SidebarGroup />

            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}