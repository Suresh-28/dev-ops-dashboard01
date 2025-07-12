
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import SystemMetrics from "./pages/SystemMetrics";
import ServiceStatus from "./pages/ServiceStatus";
import Logs from "./pages/Logs";
import AlertsHistory from "./pages/AlertsHistory";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MouseTrail } from "./components/MouseTrail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen w-full bg-terminal-bg">
            <MouseTrail />
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/metrics" element={<SystemMetrics />} />
                <Route path="/services" element={<ServiceStatus />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/alerts" element={<AlertsHistory />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
