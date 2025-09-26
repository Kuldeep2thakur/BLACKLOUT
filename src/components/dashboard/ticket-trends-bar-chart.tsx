'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import type { Ticket } from '@/types';
import { ChartTooltipContent } from '../ui/chart';

interface TicketTrendsBarChartProps {
  tickets: Ticket[];
}

export function TicketTrendsBarChart({ tickets }: TicketTrendsBarChartProps) {
  const data = React.useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    tickets.forEach(ticket => {
      const month = format(parseISO(ticket.created_at), 'MMM yyyy');
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month]++;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });

    return sortedMonths.map(month => ({
      name: format(new Date(month), 'MMM'),
      total: monthlyData[month],
    })).slice(-6); // show last 6 months
  }, [tickets]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
            content={<ChartTooltipContent />}
          />
          <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
