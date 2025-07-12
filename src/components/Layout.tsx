
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="text-terminal-primary hover:bg-terminal-primary/20"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
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
