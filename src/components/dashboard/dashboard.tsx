'use client';

import * as React from 'react';
import type { Ticket, TicketStatus } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  BarChart,
  Bot,
  CircleDot,
  Gauge,
  LifeBuoy,
  Settings,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Header } from './header';
import { StatsCards } from './stats-cards';
import { TicketTable } from './ticket-table';
import { TrendAnalyzer } from './trend-analyzer';
import { Visualizations } from './visualizations';
import { Separator } from '../ui/separator';

interface DashboardProps {
  initialTickets: Ticket[];
}

type ActiveView = 'Dashboard' | 'All Tickets' | 'Analytics' | 'Trend Analysis';

export function Dashboard({ initialTickets }: DashboardProps) {
  const [tickets, setTickets] = React.useState<Ticket[]>(initialTickets);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<TicketStatus | 'all'>('all');
  const [activeView, setActiveView] = React.useState<ActiveView>('Dashboard');

  React.useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const filteredTickets = React.useMemo(() => {
    return tickets
      .filter(ticket =>
        statusFilter === 'all' ? true : ticket.status === statusFilter
      )
      .filter(ticket =>
        ticket.employee_name.toLowerCase().includes(search.toLowerCase()) ||
        ticket.ticket_id.toLowerCase().includes(search.toLowerCase())
      );
  }, [tickets, statusFilter, search]);
  
  const menuItems: { name: ActiveView, icon: React.ElementType }[] = [
    { name: 'Dashboard', icon: Gauge },
    { name: 'All Tickets', icon: TicketIcon },
    { name: 'Analytics', icon: BarChart },
    { name: 'Trend Analysis', icon: Bot },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <CircleDot className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-headline font-semibold">BLACKOUT</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
                 <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                        tooltip={item.name} 
                        isActive={activeView === item.name}
                        onClick={() => setActiveView(item.name)}
                    >
                        <item.icon />
                        {item.name}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarGroup className="mt-auto">
          <Separator className="my-2" />
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Support">
                <LifeBuoy />
                Support
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </Sidebar>
      <SidebarInset>
        <Header
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            {(activeView === 'Dashboard') && (
                <>
                    <StatsCards tickets={tickets} />
                    <TicketTable tickets={filteredTickets} />
                     <div className="grid gap-6 lg:grid-cols-2">
                        <Visualizations tickets={tickets} />
                        <TrendAnalyzer tickets={tickets} />
                    </div>
                </>
            )}
             {(activeView === 'All Tickets') && (
                <TicketTable tickets={filteredTickets} />
            )}
             {(activeView === 'Analytics') && (
                <Visualizations tickets={tickets} />
            )}
            {(activeView === 'Trend Analysis') && (
                <TrendAnalyzer tickets={tickets} />
            )}
        </main>
      </SidebarInset>
    </div>
  );
}
