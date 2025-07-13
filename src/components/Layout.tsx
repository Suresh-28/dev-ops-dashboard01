
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isDark, setIsDark] = useState(() => {
    // Initialize from localStorage or default to dark
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    // Apply theme to document and save to localStorage
    console.log('Theme changing to:', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleThemeToggle = (checked: boolean) => {
    console.log('Toggle clicked, setting to:', checked ? 'dark' : 'light');
    setIsDark(checked);
  };

  return (
    <>
      <header className="h-14 border-b border-terminal-primary/30 bg-terminal-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-terminal-primary hover:text-terminal-primary/80" />
            <h1 className="text-xl font-bold text-terminal-primary terminal-cursor">
              DevOps Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Sun className={`h-4 w-4 transition-colors ${isDark ? 'text-muted-foreground' : 'text-terminal-primary'}`} />
            <Switch
              checked={isDark}
              onCheckedChange={handleThemeToggle}
              className="data-[state=checked]:bg-terminal-primary data-[state=unchecked]:bg-input"
            />
            <Moon className={`h-4 w-4 transition-colors ${isDark ? 'text-terminal-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-gradient-to-br from-terminal-bg via-terminal-bg to-slate-900">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
