
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, ScrollText, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServices, getAlerts, getMetrics } from "@/utils/dataManager";

const Index = () => {
  const [stats, setStats] = useState({
    servicesUp: 0,
    totalServices: 0,
    unresolvedAlerts: 0,
    totalAlerts: 0,
    avgCpuUsage: 0,
    avgMemoryUsage: 0,
  });

  useEffect(() => {
    const updateStats = () => {
      const services = getServices();
      const alerts = getAlerts();
      const metrics = getMetrics();
      
      const servicesUp = services.filter(s => s.status === 'up').length;
      const unresolvedAlerts = alerts.filter(a => !a.resolved).length;
      
      let avgCpu = 0, avgMemory = 0;
      if (metrics.length > 0) {
        const recentMetrics = metrics.slice(-10); // Last 10 data points
        avgCpu = recentMetrics.reduce((sum, m) => sum + m.cpu, 0) / recentMetrics.length;
        avgMemory = recentMetrics.reduce((sum, m) => sum + m.memory, 0) / recentMetrics.length;
      }
      
      setStats({
        servicesUp,
        totalServices: services.length,
        unresolvedAlerts,
        totalAlerts: alerts.length,
        avgCpuUsage: avgCpu,
        avgMemoryUsage: avgMemory,
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const dashboardCards = [
    {
      title: "System Metrics",
      description: "Monitor CPU, Memory & Network",
      icon: Activity,
      link: "/metrics",
      stats: `CPU: ${stats.avgCpuUsage.toFixed(1)}% | Memory: ${stats.avgMemoryUsage.toFixed(1)}%`,
      color: "text-terminal-secondary"
    },
    {
      title: "Service Status",
      description: "Track service health & uptime",
      icon: Server,
      link: "/services",
      stats: `${stats.servicesUp}/${stats.totalServices} services up`,
      color: stats.servicesUp === stats.totalServices ? "text-terminal-primary" : "text-terminal-error"
    },
    {
      title: "Logs",
      description: "View system logs & events",
      icon: ScrollText,
      link: "/logs",
      stats: "Real-time log monitoring",
      color: "text-terminal-warning"
    },
    {
      title: "Alerts History",
      description: "Manage alerts & incidents",
      icon: AlertTriangle,
      link: "/alerts",
      stats: `${stats.unresolvedAlerts} unresolved alerts`,
      color: stats.unresolvedAlerts > 0 ? "text-terminal-error" : "text-terminal-primary"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-terminal-primary font-mono">
          DevOps Monitoring Dashboard
        </h1>
        <p className="text-muted-foreground font-mono">
          Real-time system monitoring and alerting platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.link}>
              <Card className="bg-card/50 border-terminal-primary/30 hover:border-terminal-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-terminal-primary/20 terminal-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-terminal-primary font-mono">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground font-mono mb-2">
                    {card.description}
                  </div>
                  <div className={`text-sm font-mono font-semibold ${card.color}`}>
                    {card.stats}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardHeader>
            <CardTitle className="text-terminal-primary font-mono">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/metrics"
                className="p-3 border border-terminal-primary/30 rounded-md hover:bg-terminal-primary/10 transition-colors font-mono text-sm text-center"
              >
                View Metrics
              </Link>
              <Link
                to="/services"
                className="p-3 border border-terminal-primary/30 rounded-md hover:bg-terminal-primary/10 transition-colors font-mono text-sm text-center"
              >
                Check Services
              </Link>
              <Link
                to="/logs"
                className="p-3 border border-terminal-primary/30 rounded-md hover:bg-terminal-primary/10 transition-colors font-mono text-sm text-center"
              >
                Recent Logs
              </Link>
              <Link
                to="/alerts"
                className="p-3 border border-terminal-primary/30 rounded-md hover:bg-terminal-primary/10 transition-colors font-mono text-sm text-center"
              >
                Alert Center
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardHeader>
            <CardTitle className="text-terminal-primary font-mono">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-mono">
                <span>Overall Health</span>
                <span className={stats.servicesUp === stats.totalServices ? "status-up" : "status-down"}>
                  {stats.servicesUp === stats.totalServices ? "HEALTHY" : "DEGRADED"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span>Active Alerts</span>
                <span className={stats.unresolvedAlerts === 0 ? "status-up" : "status-down"}>
                  {stats.unresolvedAlerts}
                </span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span>Avg CPU Usage</span>
                <span className={stats.avgCpuUsage > 80 ? "status-down" : "status-up"}>
                  {stats.avgCpuUsage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span>Avg Memory Usage</span>
                <span className={stats.avgMemoryUsage > 85 ? "status-down" : "status-up"}>
                  {stats.avgMemoryUsage.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
