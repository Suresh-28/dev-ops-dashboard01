
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity, Cpu, HardDrive, Wifi, RotateCcw } from "lucide-react";
import { getMetrics, addMetric, clearMetrics, generateMetricData } from "@/utils/dataManager";

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState(getMetrics());
  const [currentStats, setCurrentStats] = useState({ cpu: 0, memory: 0, network: 0 });

  useEffect(() => {
    const updateMetrics = () => {
      const newMetric = generateMetricData();
      addMetric(newMetric);
      const updatedMetrics = getMetrics();
      setMetrics(updatedMetrics);
      setCurrentStats({
        cpu: newMetric.cpu,
        memory: newMetric.memory,
        network: newMetric.network
      });
    };

    // Initial data if empty
    if (metrics.length === 0) {
      updateMetrics();
    } else {
      const latest = metrics[metrics.length - 1];
      setCurrentStats({
        cpu: latest.cpu,
        memory: latest.memory,
        network: latest.network
      });
    }

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearMetrics = () => {
    clearMetrics();
    setMetrics([]);
    setCurrentStats({ cpu: 0, memory: 0, network: 0 });
  };

  const formatChartData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    }));
  };

  const chartData = formatChartData(metrics.slice(-20)); // Show last 20 data points

  const statCards = [
    {
      title: "CPU Usage",
      value: currentStats.cpu.toFixed(1),
      icon: Cpu,
      color: currentStats.cpu > 80 ? "text-terminal-error" : "text-terminal-primary"
    },
    {
      title: "Memory Usage",
      value: currentStats.memory.toFixed(1),
      icon: HardDrive,
      color: currentStats.memory > 85 ? "text-terminal-error" : "text-terminal-primary"
    },
    {
      title: "Network Usage",
      value: currentStats.network.toFixed(1),
      icon: Wifi,
      color: currentStats.network > 90 ? "text-terminal-error" : "text-terminal-primary"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-terminal-primary font-mono">System Metrics</h1>
          <p className="text-muted-foreground font-mono">Real-time system performance monitoring</p>
        </div>
        <Button 
          onClick={handleClearMetrics}
          variant="outline"
          className="terminal-button font-mono"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear Data
        </Button>
      </div>

      {/* Current Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const percentage = parseFloat(stat.value);
          
          return (
            <Card key={stat.title} className="bg-card/50 border-terminal-primary/30 terminal-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-terminal-primary font-mono">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold font-mono ${stat.color}`}>
                  {stat.value}%
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      percentage > 80 ? 'bg-terminal-error' : 'bg-terminal-primary'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {percentage > 80 ? 'High usage detected' : 'Normal operation'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Line Chart */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00ff88/20" />
                <XAxis 
                  dataKey="time" 
                  stroke="#00ff88" 
                  fontSize={10}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#00ff88" 
                  fontSize={10}
                  fontFamily="monospace"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0f111a',
                    border: '1px solid #00ff88',
                    borderRadius: '8px',
                    fontFamily: 'monospace'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#00ff88" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="CPU %"
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#0099ff" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Memory %"
                />
                <Line 
                  type="monotone" 
                  dataKey="network" 
                  stroke="#ffaa00" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Network %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart for Current Values */}
      <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
        <CardHeader>
          <CardTitle className="text-terminal-primary font-mono">Current Resource Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'CPU', value: currentStats.cpu, color: '#00ff88' },
                { name: 'Memory', value: currentStats.memory, color: '#0099ff' },
                { name: 'Network', value: currentStats.network, color: '#ffaa00' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00ff88/20" />
                <XAxis 
                  dataKey="name" 
                  stroke="#00ff88" 
                  fontSize={12}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#00ff88" 
                  fontSize={10}
                  fontFamily="monospace"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0f111a',
                    border: '1px solid #00ff88',
                    borderRadius: '8px',
                    fontFamily: 'monospace'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#00ff88"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* System Load Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardHeader>
            <CardTitle className="text-terminal-primary font-mono">System Load Average</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between font-mono text-sm">
              <span>1 min:</span>
              <span className="text-terminal-primary">{(currentStats.cpu / 100 * 4).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>5 min:</span>
              <span className="text-terminal-primary">{(currentStats.cpu / 100 * 3.8).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>15 min:</span>
              <span className="text-terminal-primary">{(currentStats.cpu / 100 * 3.5).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-terminal-primary/30 terminal-glow">
          <CardHeader>
            <CardTitle className="text-terminal-primary font-mono">Memory Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between font-mono text-sm">
              <span>Total:</span>
              <span className="text-terminal-primary">16.0 GB</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>Used:</span>
              <span className="text-terminal-primary">{(currentStats.memory / 100 * 16).toFixed(1)} GB</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>Available:</span>
              <span className="text-terminal-primary">{(16 - (currentStats.memory / 100 * 16)).toFixed(1)} GB</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemMetrics;
