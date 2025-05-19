"use client";

import React, { useEffect, useRef, useState } from 'react';

const BACKEND_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const WS_BASE_URL = typeof window !== 'undefined' && window.location.protocol === 'https:'
  ? `wss://${BACKEND_HOST}:8000`
  : `ws://${BACKEND_HOST}:8000`;

const WS_URL = `${WS_BASE_URL}/ws/logs`;

const getColor = (line: string) => {
  if (line.includes('ERROR')) return 'text-red-500';
  if (line.includes('WARNING') || line.includes('WARN')) return 'text-yellow-500';
  if (line.includes('INFO')) return 'text-blue-500';
  if (line.includes('DEBUG')) return 'text-gray-400';
  return 'text-white';
};

export const LogWebSocketViewer: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      setLogs((prev) => [...prev.slice(-500), event.data]);
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black rounded p-2 h-96 overflow-y-auto text-xs font-mono" ref={logRef}>
      {logs.map((line, i) => (
        <div key={i} className={getColor(line)}>{line}</div>
      ))}
    </div>
  );
}; 