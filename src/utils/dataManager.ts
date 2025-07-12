export interface MetricData {
  timestamp: number;
  cpu: number;
  memory: number;
  network: number;
}

export interface ServiceData {
  id: string;
  name: string;
  status: 'up' | 'down';
  uptime: number;
  lastChecked: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface Alert {
  id: string;
  timestamp: number;
  message: string;
  resolved: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Metrics Management
export const getMetrics = (): MetricData[] => {
  const data = localStorage.getItem('devops-metrics');
  return data ? JSON.parse(data) : [];
};

export const saveMetrics = (metrics: MetricData[]): void => {
  localStorage.setItem('devops-metrics', JSON.stringify(metrics));
};

export const addMetric = (metric: MetricData): void => {
  const metrics = getMetrics();
  metrics.push(metric);
  // Keep only last 100 data points
  if (metrics.length > 100) {
    metrics.splice(0, metrics.length - 100);
  }
  saveMetrics(metrics);
};

export const clearMetrics = (): void => {
  localStorage.removeItem('devops-metrics');
};

// Services Management
export const getServices = (): ServiceData[] => {
  const data = localStorage.getItem('devops-services');
  if (data) {
    return JSON.parse(data);
  }
  
  // Default services
  const defaultServices: ServiceData[] = [
    { id: '1', name: 'API Server', status: 'up', uptime: 99.9, lastChecked: Date.now() },
    { id: '2', name: 'Database', status: 'up', uptime: 99.8, lastChecked: Date.now() },
    { id: '3', name: 'Cache', status: 'up', uptime: 99.5, lastChecked: Date.now() },
    { id: '4', name: 'Auth Service', status: 'down', uptime: 98.2, lastChecked: Date.now() },
    { id: '5', name: 'File Storage', status: 'up', uptime: 99.7, lastChecked: Date.now() },
  ];
  
  saveServices(defaultServices);
  return defaultServices;
};

export const saveServices = (services: ServiceData[]): void => {
  localStorage.setItem('devops-services', JSON.stringify(services));
};

export const updateServiceStatus = (id: string, status: 'up' | 'down'): void => {
  const services = getServices();
  const service = services.find(s => s.id === id);
  if (service) {
    service.status = status;
    service.lastChecked = Date.now();
    // Simulate uptime calculation
    if (status === 'down') {
      service.uptime = Math.max(0, service.uptime - Math.random() * 2);
    }
    saveServices(services);
  }
};

// Logs Management
export const getLogs = (): LogEntry[] => {
  const data = localStorage.getItem('devops-logs');
  if (data) {
    return JSON.parse(data);
  }
  
  // Default logs
  const defaultLogs: LogEntry[] = [
    { id: '1', timestamp: Date.now() - 300000, level: 'info', message: 'System started successfully' },
    { id: '2', timestamp: Date.now() - 240000, level: 'warn', message: 'High memory usage detected' },
    { id: '3', timestamp: Date.now() - 180000, level: 'error', message: 'Auth service connection failed' },
    { id: '4', timestamp: Date.now() - 120000, level: 'info', message: 'Database backup completed' },
    { id: '5', timestamp: Date.now() - 60000, level: 'warn', message: 'CPU usage above 80%' },
  ];
  
  saveLogs(defaultLogs);
  return defaultLogs;
};

export const saveLogs = (logs: LogEntry[]): void => {
  localStorage.setItem('devops-logs', JSON.stringify(logs));
};

export const addLog = (log: Omit<LogEntry, 'id'>): void => {
  const logs = getLogs();
  const newLog: LogEntry = {
    ...log,
    id: Date.now().toString(),
  };
  logs.push(newLog);
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }
  saveLogs(logs);
};

// Alerts Management
export const getAlerts = (): Alert[] => {
  const data = localStorage.getItem('devops-alerts');
  if (data) {
    return JSON.parse(data);
  }
  
  // Default alerts
  const defaultAlerts: Alert[] = [
    { id: '1', timestamp: Date.now() - 600000, message: 'CPU usage critical (>95%)', resolved: true, severity: 'critical' },
    { id: '2', timestamp: Date.now() - 300000, message: 'Auth service is down', resolved: false, severity: 'high' },
    { id: '3', timestamp: Date.now() - 180000, message: 'Memory usage high (>85%)', resolved: false, severity: 'medium' },
    { id: '4', timestamp: Date.now() - 120000, message: 'Disk space running low', resolved: true, severity: 'medium' },
  ];
  
  saveAlerts(defaultAlerts);
  return defaultAlerts;
};

export const saveAlerts = (alerts: Alert[]): void => {
  localStorage.setItem('devops-alerts', JSON.stringify(alerts));
};

export const addAlert = (alert: Omit<Alert, 'id'>): void => {
  const alerts = getAlerts();
  const newAlert: Alert = {
    ...alert,
    id: Date.now().toString(),
  };
  alerts.push(newAlert);
  saveAlerts(alerts);
};

export const toggleAlertResolved = (id: string): void => {
  const alerts = getAlerts();
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.resolved = !alert.resolved;
    saveAlerts(alerts);
  }
};

// Real-time data simulation
export const generateMetricData = (): MetricData => {
  const lastMetrics = getMetrics();
  const lastMetric = lastMetrics[lastMetrics.length - 1];
  
  const baseValues = lastMetric ? {
    cpu: lastMetric.cpu,
    memory: lastMetric.memory,
    network: lastMetric.network,
  } : {
    cpu: 45,
    memory: 60,
    network: 30,
  };
  
  return {
    timestamp: Date.now(),
    cpu: Math.max(0, Math.min(100, baseValues.cpu + (Math.random() - 0.5) * 20)),
    memory: Math.max(0, Math.min(100, baseValues.memory + (Math.random() - 0.5) * 15)),
    network: Math.max(0, Math.min(100, baseValues.network + (Math.random() - 0.5) * 25)),
  };
};
