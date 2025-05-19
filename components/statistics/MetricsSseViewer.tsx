'use client';

import React, { useEffect, useState, useRef } from 'react';

const API_BASE_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8000` : 'http://localhost:8000';

type Metrics = {
  cpu: number | null;
  memory: number | null;
  disk: number | null;
  error?: string;
};

export const MetricsSseViewer: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({ cpu: null, memory: null, disk: null });
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      const apiKey = localStorage.getItem("api_key") || process.env.NEXT_PUBLIC_API_KEY || "";
      const streamUrl = `${API_BASE_URL}/metrics/stream?apiKey=${encodeURIComponent(apiKey)}`;

      eventSourceRef.current = new EventSource(streamUrl);

      eventSourceRef.current.onopen = () => {
        setIsConnected(true);
        setMetrics(prev => ({ ...prev, error: undefined })); // Clear previous error on connect
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const newMetrics = JSON.parse(event.data);
          setMetrics({ 
            cpu: newMetrics.cpu !== undefined ? newMetrics.cpu : null,
            memory: newMetrics.memory !== undefined ? newMetrics.memory : null,
            disk: newMetrics.disk !== undefined ? newMetrics.disk : null,
            error: newMetrics.error || undefined
          });
        } catch (e) {
          console.error("Failed to parse metrics:", e);
          setMetrics({ cpu: null, memory: null, disk: null, error: "Error parsing metrics data" });
        }
      };

      eventSourceRef.current.onerror = (err) => {
        console.error('EventSource failed:', err);
        setIsConnected(false);
        setMetrics({ cpu: null, memory: null, disk: null, error: "Connection to metrics stream failed. Reconnecting..." });
        eventSourceRef.current?.close();
        setTimeout(connect, 5000); 
      };
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const renderMetricCard = (title: string, value: number | null) => (
    <div className="bg-background border rounded-lg p-4 flex-1 text-center shadow-sm">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold">{value !== null ? `${value.toFixed(1)}%` : 'N/A'}</div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end space-x-2 text-xs text-muted-foreground">
        <span>Status:</span>
        <div 
          className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          title={isConnected ? 'Connected to metrics stream' : 'Disconnected from metrics stream'}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {renderMetricCard("CPU Usage", metrics.cpu)}
        {renderMetricCard("Memory Usage", metrics.memory)}
        {renderMetricCard("Disk Usage", metrics.disk)}
      </div>
      {metrics.error && (
        <div className="text-center text-red-600 dark:text-red-400 text-sm p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
          {metrics.error}
        </div>
      )}
    </div>
  );
}; 