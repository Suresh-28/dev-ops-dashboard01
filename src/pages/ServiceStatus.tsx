
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";
import { getServices, updateServiceStatus, ServiceData } from "@/utils/dataManager";

const ServiceStatus = () => {
  const [services, setServices] = useState<ServiceData[]>([]);

  useEffect(() => {
    const loadServices = () => {
      setServices(getServices());
    };

    loadServices();
    const interval = setInterval(loadServices, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleService = (id: string, currentStatus: 'up' | 'down') => {
    const newStatus = currentStatus === 'up' ? 'down' : 'up';
    updateServiceStatus(id, newStatus);
    setServices(getServices());
  };

  const handleRefreshAll = () => {
    // Simulate refreshing all services
    services.forEach(service => {
      updateServiceStatus(service.id, service.status);
    });
    setServices(getServices());
  };

  const upServices = services.filter(s => s.status === 'up').length;
  const totalServices = services.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-terminal-primary font-mono">Service Status</h1>
          <p className="text-muted-foreground font-mono">Monitor service health and uptime</p>
        </div>
        <div className="flex gap-3">
          <Badge 
            variant={upServices === totalServices ? "default" : "destructive"}
            className="font-mono text-sm px-3 py-1"
          >
            {upServices}/{totalServices} Services Up
          </Badge>
          <Button 
            onClick={handleRefreshAll}
            variant="outline"
            className="terminal-button font-mono"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Overall Status Card */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-terminal-primary">
                {upServices}
              </div>
              <div className="text-sm text-muted-foreground font-mono">Services Up</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-terminal-error">
                {totalServices - upServices}
              </div>
              <div className="text-sm text-muted-foreground font-mono">Services Down</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-terminal-warning">
                {services.reduce((sum, s) => sum + s.uptime, 0) / services.length || 0}%
              </div>
              <div className="text-sm text-muted-foreground font-mono">Avg Uptime</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold font-mono ${upServices === totalServices ? 'status-up' : 'status-down'}`}>
                {upServices === totalServices ? 'HEALTHY' : 'DEGRADED'}
              </div>
              <div className="text-sm text-muted-foreground font-mono">Overall Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className={`bg-card/50 border-terminal-primary/30 terminal-glow transition-all duration-300 hover:shadow-lg ${
              service.status === 'up' 
                ? 'hover:shadow-terminal-primary/20' 
                : 'hover:shadow-terminal-error/20'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-terminal-primary">
                  {service.name}
                </CardTitle>
                {service.status === 'up' ? (
                  <CheckCircle className="h-5 w-5 status-up" />
                ) : (
                  <XCircle className="h-5 w-5 status-down" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-muted-foreground">Status</span>
                  <Badge
                    variant={service.status === 'up' ? "default" : "destructive"}
                    className="font-mono text-xs"
                  >
                    {service.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-muted-foreground">Uptime</span>
                  <span className={`text-sm font-mono font-semibold ${
                    service.uptime > 99 ? 'status-up' : service.uptime > 95 ? 'text-terminal-warning' : 'status-down'
                  }`}>
                    {service.uptime.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono text-muted-foreground">Last Check</span>
                  <span className="text-sm font-mono text-terminal-primary flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(service.lastChecked).toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Uptime Bar */}
              <div className="space-y-1">
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      service.uptime > 99 
                        ? 'bg-terminal-primary' 
                        : service.uptime > 95 
                        ? 'bg-terminal-warning' 
                        : 'bg-terminal-error'
                    }`}
                    style={{ width: `${Math.min(service.uptime, 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handleToggleService(service.id, service.status)}
                variant="outline"
                size="sm"
                className={`w-full font-mono text-xs ${
                  service.status === 'up'
                    ? 'border-terminal-error text-terminal-error hover:bg-terminal-error hover:text-black'
                    : 'border-terminal-primary text-terminal-primary hover:bg-terminal-primary hover:text-black'
                }`}
              >
                {service.status === 'up' ? 'Simulate Outage' : 'Restore Service'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Timeline */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono">Service Health Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center gap-4 p-3 border border-terminal-primary/20 rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  {service.status === 'up' ? (
                    <CheckCircle className="h-4 w-4 status-up" />
                  ) : (
                    <XCircle className="h-4 w-4 status-down" />
                  )}
                  <span className="font-mono text-sm text-terminal-primary">{service.name}</span>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  Last updated: {new Date(service.lastChecked).toLocaleString('en-US', {
                    hour12: false,
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <Badge
                  variant={service.status === 'up' ? "default" : "destructive"}
                  className="font-mono text-xs"
                >
                  {service.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceStatus;
