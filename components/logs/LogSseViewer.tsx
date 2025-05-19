'use client';

import React, { useEffect, useRef, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const getBaseLogStyle = (line: string) => {
  if (line.toUpperCase().includes('ERROR')) return 'text-red-400';
  if (line.toUpperCase().includes('WARNING') || line.toUpperCase().includes('WARN')) return 'text-yellow-400';
  if (line.toUpperCase().includes('INFO')) return 'text-blue-400';
  if (line.toUpperCase().includes('DEBUG')) return 'text-gray-500';
  return 'text-gray-200'; // Default for plain messages
};

const getSystemMessageStyle = (line: string) => {
  if (line.includes('Connection established')) return 'text-green-400 italic';
  if (line.includes('Connection error') || line.includes('failed')) return 'text-orange-400 italic';
  return 'text-purple-400 italic'; // Other system messages
};

interface LogLine {
  id: string;
  text: string;
  isSystemMessage: boolean;
}

export const LogSseViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const addLog = (text: string, isSystemMessage = false) => {
    setLogs(prev => [...prev.slice(-500), { id: Date.now().toString() + Math.random().toString(), text, isSystemMessage }]);
  };

  useEffect(() => {
    const connect = () => {
      const apiKey = localStorage.getItem("api_key") || process.env.NEXT_PUBLIC_API_KEY || "";
      const streamUrl = `${API_BASE_URL}/logs/stream/general?apiKey=${encodeURIComponent(apiKey)}`;
      
      eventSourceRef.current = new EventSource(streamUrl);

      eventSourceRef.current.onopen = () => {
        setIsConnected(true);
        addLog('SSE Connection established. Streaming logs...', true);
      };

      eventSourceRef.current.onmessage = (event) => {
        addLog(event.data);
      };

      eventSourceRef.current.onerror = (err) => {
        console.error('EventSource failed:', err);
        setIsConnected(false);
        addLog('SSE Connection error. Attempting to reconnect...', true);
        eventSourceRef.current?.close();
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally run once on mount to establish connection

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-900 dark:bg-black border border-gray-700 dark:border-gray-800 rounded-md p-1 shadow-md">
      <div className="flex items-center justify-end p-2 space-x-2 text-xs text-muted-foreground border-b border-gray-700 dark:border-gray-800 mb-2">
        <span>Status:</span>
        <div 
          className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          title={isConnected ? 'Connected to log stream' : 'Disconnected from log stream'}
        />
      </div>
      <div className="h-96 overflow-y-auto text-xs font-mono px-3 pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {logs.map((logLine) => (
          <div 
            key={logLine.id} 
            className={logLine.isSystemMessage ? getSystemMessageStyle(logLine.text) : getBaseLogStyle(logLine.text)}
          >
            {logLine.text}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}; 