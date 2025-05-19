"use client";

import React, { useEffect, useState } from 'react';

type Metrics = {
  cpu: number;
  memory: number;
  disk: number;
};

const BACKEND_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const WS_BASE_URL = typeof window !== 'undefined' && window.location.protocol === 'https:'
  ? `wss://${BACKEND_HOST}:8000`
  : `ws://${BACKEND_HOST}:8000`;

const WS_URL = `${WS_BASE_URL}/ws/metrics`;

export const MetricsWebSocketViewer: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({ cpu: 0, memory: 0, disk: 0 });

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      try {
        setMetrics(JSON.parse(event.data));
      } catch {}
    };
    return () => ws.close();
  }, []);

  return (
    <div className="flex gap-4 my-4">
      <div className="bg-gray-900 text-white rounded p-4 flex-1 text-center">
        <div className="text-xs text-gray-400">CPU Usage</div>
        <div className="text-2xl font-bold">{metrics.cpu}%</div>
      </div>
      <div className="bg-gray-900 text-white rounded p-4 flex-1 text-center">
        <div className="text-xs text-gray-400">Memory Usage</div>
        <div className="text-2xl font-bold">{metrics.memory}%</div>
      </div>
      <div className="bg-gray-900 text-white rounded p-4 flex-1 text-center">
        <div className="text-xs text-gray-400">Disk Usage</div>
        <div className="text-2xl font-bold">{metrics.disk}%</div>
      </div>
    </div>
  );
}; 