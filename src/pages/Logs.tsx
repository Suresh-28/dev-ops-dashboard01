
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Filter, Plus, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { getLogs, addLog, LogEntry } from "@/utils/dataManager";

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [newLogMessage, setNewLogMessage] = useState("");
  const [newLogLevel, setNewLogLevel] = useState<"info" | "warn" | "error">("info");
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadLogs = () => {
      const allLogs = getLogs();
      setLogs(allLogs);
    };

    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = filterLevel === "all" 
      ? logs 
      : logs.filter(log => log.level === filterLevel);
    setFilteredLogs(filtered.sort((a, b) => b.timestamp - a.timestamp));
  }, [logs, filterLevel]);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs]);

  const handleAddLog = () => {
    if (newLogMessage.trim()) {
      addLog({
        timestamp: Date.now(),
        level: newLogLevel,
        message: newLogMessage.trim(),
      });
      setNewLogMessage("");
      setLogs(getLogs());
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-terminal-error" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-terminal-warning" />;
      default:
        return <Info className="h-4 w-4 text-terminal-secondary" />;
    }
  };

  const getLogClassName = (level: string) => {
    switch (level) {
      case 'error':
        return 'log-error';
      case 'warn':
        return 'log-warn';
      default:
        return 'log-info';
    }
  };

  const logCounts = {
    total: logs.length,
    error: logs.filter(l => l.level === 'error').length,
    warn: logs.filter(l => l.level === 'warn').length,
    info: logs.filter(l => l.level === 'info').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-terminal-primary font-mono">System Logs</h1>
          <p className="text-muted-foreground font-mono">Monitor system events and messages</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="font-mono">
            Total: {logCounts.total}
          </Badge>
          <Badge variant="destructive" className="font-mono">
            Errors: {logCounts.error}
          </Badge>
          <Badge className="font-mono text-black bg-terminal-warning">
            Warnings: {logCounts.warn}
          </Badge>
          <Badge variant="default" className="font-mono">
            Info: {logCounts.info}
          </Badge>
        </div>
      </div>

      {/* Add New Log */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Log Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={newLogLevel} onValueChange={(value: "info" | "warn" | "error") => setNewLogLevel(value)}>
              <SelectTrigger className="w-32 terminal-input font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-terminal-bg border-terminal-primary/30 font-mono">
                <SelectItem value="info" className="font-mono">INFO</SelectItem>
                <SelectItem value="warn" className="font-mono">WARN</SelectItem>
                <SelectItem value="error" className="font-mono">ERROR</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter log message..."
              value={newLogMessage}
              onChange={(e) => setNewLogMessage(e.target.value)}
              className="flex-1 terminal-input font-mono"
              onKeyPress={(e) => e.key === 'Enter' && handleAddLog()}
            />
            <Button 
              onClick={handleAddLog}
              className="terminal-button font-mono"
              disabled={!newLogMessage.trim()}
            >
              Add Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-center">
            <span className="text-sm font-mono text-muted-foreground">Level:</span>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40 terminal-input font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-terminal-bg border-terminal-primary/30 font-mono">
                <SelectItem value="all" className="font-mono">All Levels</SelectItem>
                <SelectItem value="info" className="font-mono">Info Only</SelectItem>
                <SelectItem value="warn" className="font-mono">Warnings Only</SelectItem>
                <SelectItem value="error" className="font-mono">Errors Only</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm font-mono text-muted-foreground ml-4">
              Showing {filteredLogs.length} of {logs.length} logs
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Log Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-1 p-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-mono">
                  No logs match the current filter
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-md font-mono text-sm transition-all duration-200 hover:shadow-md ${getLogClassName(log.level)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getLogIcon(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs opacity-75">
                            {new Date(log.timestamp).toLocaleString('en-US', {
                              hour12: false,
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-mono px-2 py-0 ${
                              log.level === 'error' ? 'border-terminal-error text-terminal-error' :
                              log.level === 'warn' ? 'border-terminal-warning text-terminal-warning' :
                              'border-terminal-secondary text-terminal-secondary'
                            }`}
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="break-words">
                          {log.message}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-terminal-primary">
              {logCounts.total}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Total Logs</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-terminal-error">
              {logCounts.error}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Errors</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-terminal-warning">
              {logCounts.warn}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Warnings</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold font-mono text-terminal-secondary">
              {logCounts.info}
            </div>
            <div className="text-sm text-muted-foreground font-mono">Info</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
