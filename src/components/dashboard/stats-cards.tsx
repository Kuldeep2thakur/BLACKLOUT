'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Ticket } from '@/types';
import { CheckCircle, Clock, Loader, Ticket as TicketIcon } from 'lucide-react';

interface StatsCardsProps {
  tickets: Ticket[];
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [currentValue, setCurrentValue] = React.useState(0);
  
  React.useEffect(() => {
    const animation = requestAnimationFrame(() => {
       setCurrentValue(value);
    });
    
    return () => cancelAnimationFrame(animation);
  }, [value]);

  return <span className="transition-all duration-500">{currentValue}</span>;
}


export function StatsCards({ tickets }: StatsCardsProps) {
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
  const pendingTickets = tickets.filter(t => t.status === 'Pending').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;

  const stats = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      icon: TicketIcon,
      color: 'text-primary',
    },
    {
      title: 'Resolved',
      value: resolvedTickets,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Pending',
      value: pendingTickets,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'In Progress',
      value: inProgressTickets,
      icon: Loader,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <Card key={stat.title} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              <AnimatedNumber value={stat.value} />
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.title === 'Total Tickets' ? 'All-time tickets' : `Currently ${stat.title.toLowerCase()}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
