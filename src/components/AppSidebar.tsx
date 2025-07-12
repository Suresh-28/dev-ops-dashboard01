
import { 
  Activity, 
  Server, 
  ScrollText, 
  AlertTriangle,
  Home,
  ChevronRight
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "System Metrics", url: "/metrics", icon: Activity },
  { title: "Service Status", url: "/services", icon: Server },
  { title: "Logs", url: "/logs", icon: ScrollText },
  { title: "Alerts History", url: "/alerts", icon: AlertTriangle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r border-terminal-primary/30 bg-sidebar terminal-glow transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="text-terminal-primary font-mono text-xs uppercase tracking-wider px-4 py-2">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 font-mono text-sm
                        ${isActive 
                          ? 'bg-terminal-primary/20 text-terminal-primary border-l-2 border-terminal-primary shadow-lg' 
                          : 'text-muted-foreground hover:bg-terminal-primary/10 hover:text-terminal-primary'
                        }
                      `}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {isActive(item.url) && <ChevronRight className="h-3 w-3" />}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
