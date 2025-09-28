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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <Card
          key={stat.title}
          className="bg-gradient-to-br from-white/60 to-blue-100/60 border-0 shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 backdrop-blur-lg cursor-pointer group"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-gray-700 group-hover:text-primary transition-colors duration-200">{stat.title}</CardTitle>
            <span className="rounded-full p-2 bg-white/80 group-hover:bg-primary/90 group-hover:text-white transition-colors duration-200 shadow">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-200">
              <AnimatedNumber value={stat.value} />
            </div>
            <p className="text-xs text-gray-500 group-hover:text-primary/80 transition-colors duration-200">
              {stat.title === 'Total Tickets' ? 'All-time tickets' : `Currently ${stat.title.toLowerCase()}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
