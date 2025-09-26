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
  Activity,
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

export function Dashboard({ initialTickets }: DashboardProps) {
  const [tickets, setTickets] = React.useState<Ticket[]>(initialTickets);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<TicketStatus | 'all'>('all');

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
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard" isActive>
                <Gauge />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="All Tickets">
                <TicketIcon />
                All Tickets
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Analytics">
                <BarChart />
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Trend Analysis">
                <Bot />
                Trend Analysis
              </SidebarMenuButton>
            </SidebarMenuItem>
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
          <StatsCards tickets={tickets} />
          <TicketTable tickets={filteredTickets} />
          <div className="grid gap-6 lg:grid-cols-2">
            <Visualizations tickets={tickets} />
            <TrendAnalyzer tickets={tickets} />
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
