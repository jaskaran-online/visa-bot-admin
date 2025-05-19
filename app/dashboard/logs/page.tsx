"use client"; // Required for WebSocket components if they use hooks like useEffect

import { LogSseViewer } from '@/components/logs/LogSseViewer';
import { MetricsSseViewer } from '@/components/statistics/MetricsSseViewer';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogsDashboardPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <h1 className="text-3xl font-bold tracking-tight">Live Logs & Server Metrics (SSE)</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Server Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricsSseViewer />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Log Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <LogSseViewer />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
} 