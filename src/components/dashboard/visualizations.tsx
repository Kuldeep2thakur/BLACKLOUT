'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Ticket } from '@/types';
import { TicketTrendsBarChart } from './ticket-trends-bar-chart';
import { TicketStatusPieChart3D } from './ticket-status-pie-chart-3d';

interface VisualizationsProps {
  tickets: Ticket[];
}

export function Visualizations({ tickets }: VisualizationsProps) {
  return (
    <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="font-headline">Ticket Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <TicketStatusPieChart3D tickets={tickets} />
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="font-headline">Monthly Ticket Trends</CardTitle>
            </CardHeader>
            <CardContent>
                <TicketTrendsBarChart tickets={tickets} />
            </CardContent>
        </Card>
    </div>
  );
}
