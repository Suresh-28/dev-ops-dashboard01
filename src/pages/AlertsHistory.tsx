
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Filter, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { getAlerts, addAlert, toggleAlertResolved, Alert } from "@/utils/dataManager";

const AlertsHistory = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newAlertMessage, setNewAlertMessage] = useState("");
  const [newAlertSeverity, setNewAlertSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");

  useEffect(() => {
    const loadAlerts = () => {
      const allAlerts = getAlerts();
      setAlerts(allAlerts);
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = filterStatus === "all" 
      ? alerts 
      : filterStatus === "resolved"
      ? alerts.filter(alert => alert.resolved)
      : alerts.filter(alert => !alert.resolved);
    
    setFilteredAlerts(filtered.sort((a, b) => b.timestamp - a.timestamp));
  }, [alerts, filterStatus]);

  const handleAddAlert = () => {
    if (newAlertMessage.trim()) {
      addAlert({
        timestamp: Date.now(),
        message: newAlertMessage.trim(),
        resolved: false,
        severity: newAlertSeverity,
      });
      setNewAlertMessage("");
      setAlerts(getAlerts());
    }
  };

  const handleToggleResolved = (id: string) => {
    toggleAlertResolved(id);
    setAlerts(getAlerts());
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-terminal-error text-white';
      case 'medium':
        return 'bg-terminal-warning text-black';
      case 'low':
        return 'bg-terminal-secondary text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const alertCounts = {
    total: alerts.length,
    resolved: alerts.filter(a => a.resolved).length,
    unresolved: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-terminal-primary font-mono">Alerts History</h1>
          <p className="text-muted-foreground font-mono">Manage system alerts and incidents</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="font-mono">
            Total: {alertCounts.total}
          </Badge>
          <Badge variant="destructive" className="font-mono">
            Unresolved: {alertCounts.unresolved}
          </Badge>
          <Badge variant="default" className="font-mono">
            Resolved: {alertCounts.resolved}
          </Badge>
          {alertCounts.critical > 0 && (
            <Badge className="font-mono bg-red-600">
              Critical: {alertCounts.critical}
            </Badge>
          )}
        </div>
      </div>

      {/* Add New Alert */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={newAlertSeverity} onValueChange={(value: "low" | "medium" | "high" | "critical") => setNewAlertSeverity(value)}>
              <SelectTrigger className="w-32 terminal-input font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-terminal-bg border-terminal-primary/30 font-mono">
                <SelectItem value="low" className="font-mono">Low</SelectItem>
                <SelectItem value="medium" className="font-mono">Medium</SelectItem>
                <SelectItem value="high" className="font-mono">High</SelectItem>
                <SelectItem value="critical" className="font-mono">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter alert message..."
              value={newAlertMessage}
              onChange={(e) => setNewAlertMessage(e.target.value)}
              className="flex-1 terminal-input font-mono"
              onKeyPress={(e) => e.key === 'Enter' && handleAddAlert()}
            />
            <Button 
              onClick={handleAddAlert}
              className="terminal-button font-mono"
              disabled={!newAlertMessage.trim()}
            >
              Create Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-center">
            <span className="text-sm font-mono text-muted-foreground">Status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 terminal-input font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-terminal-bg border-terminal-primary/30 font-mono">
                <SelectItem value="all" className="font-mono">All Alerts</SelectItem>
                <SelectItem value="unresolved" className="font-mono">Unresolved</SelectItem>
                <SelectItem value="resolved" className="font-mono">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-mono text-muted-foreground ml-4">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground font-mono">
                No alerts match the current filter
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                    alert.resolved 
                      ? 'border-terminal-primary/30 bg-terminal-primary/5' 
                      : 'border-terminal-error/50 bg-terminal-error/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-0.5">
                        {alert.resolved ? (
                          <CheckCircle className="h-5 w-5 text-terminal-primary" />
                        ) : (
                          <XCircle className="h-5 w-5 text-terminal-error" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`text-xs font-mono px-2 py-1 ${getSeverityColor(alert.severity)}`}>
                            {getSeverityIcon(alert.severity)}
                            <span className="ml-1">{alert.severity.toUpperCase()}</span>
                          </Badge>
                          
                          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleString('en-US', {
                              hour12: false,
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          
                          <Badge 
                            variant={alert.resolved ? "default" : "destructive"}
                            className="text-xs font-mono"
                          >
                            {alert.resolved ? 'RESOLVED' : 'ACTIVE'}
                          </Badge>
                        </div>
                        
                        <div className="font-mono text-sm break-words">
                          {alert.message}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleToggleResolved(alert.id)}
                      variant="outline"
                      size="sm"
                      className={`font-mono text-xs whitespace-nowrap ${
                        alert.resolved
                          ? 'border-terminal-error text-terminal-error hover:bg-terminal-error hover:text-black'
                          : 'border-terminal-primary text-terminal-primary hover:bg-terminal-primary hover:text-black'
                      }`}
                    >
                      {alert.resolved ? 'Reopen' : 'Resolve'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-terminal-primary">
              {alertCounts.total}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Total Alerts</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-terminal-error">
              {alertCounts.unresolved}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Active</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-terminal-primary">
              {alertCounts.resolved}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Resolved</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-red-400">
              {alertCounts.critical}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Critical</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsHistory;
