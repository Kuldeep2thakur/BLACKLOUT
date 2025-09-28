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
} from '@/components/ui/sidebar';
import {
  BarChart,
  Bot,
  Gauge,
  LifeBuoy,
  Settings,
  Ticket as TicketIcon,
} from 'lucide-react';
import Image from 'next/image';
import { Header } from './header';
import { StatsCards } from './stats-cards';
import { TicketTable } from './ticket-table';
import { TrendAnalyzer } from './trend-analyzer';
import { Visualizations } from './visualizations';
import { Separator } from '../ui/separator';
import { SettingsPage } from './settings-page';
import { SupportPage } from './support-page';

interface DashboardProps {
  initialTickets: Ticket[];
}

type ActiveView = 'Dashboard' | 'All Tickets' | 'Analytics' | 'Trend Analysis' | 'Support' | 'Settings';

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
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526]">
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-gradient-to-tr from-primary via-blue-400 to-purple-500 shadow-xl border-2 border-white/70 hover:scale-105 transition-transform duration-200">
              <Image src="/blackoutlogo.jpg" alt="Blackout Logo" width={44} height={44} className="rounded-full object-cover shadow-lg ring-2 ring-blue-300/40" priority />
            </div>
            <h1 className="text-xl font-headline font-extrabold tracking-tight text-white drop-shadow">BLACKOUT</h1>
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
                        className="transition-all duration-200 hover:bg-primary/20 hover:text-primary"
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
              <SidebarMenuButton 
                tooltip="Support"
                isActive={activeView === 'Support'}
                onClick={() => setActiveView('Support')}
                className="transition-all duration-200 hover:bg-blue-100/20 hover:text-blue-400"
              >
                <LifeBuoy />
                Support
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Settings"
                isActive={activeView === 'Settings'}
                onClick={() => setActiveView('Settings')}
                className="transition-all duration-200 hover:bg-blue-100/20 hover:text-blue-400"
              >
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
        <main className="flex-1 space-y-8 p-4 md:p-8 lg:p-12 bg-white/10 backdrop-blur-xl rounded-tl-3xl shadow-2xl min-h-screen">
          {activeView === 'Dashboard' && (
            <>
              <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-white drop-shadow mb-1">Welcome back 👋</h2>
                  <p className="text-lg text-white/80">Here’s a summary of your IT helpdesk activity.</p>
                </div>
                <div className="flex gap-2">
                  {/* Add quick action buttons or stats here if desired */}
                </div>
              </section>
              <StatsCards tickets={tickets} />
              <TicketTable tickets={filteredTickets} />
              <div className="grid gap-8 lg:grid-cols-2">
                <Visualizations tickets={tickets} />
                <TrendAnalyzer tickets={tickets} />
              </div>
            </>
          )}
          {activeView === 'All Tickets' && <TicketTable tickets={filteredTickets} />}
          {activeView === 'Analytics' && <Visualizations tickets={tickets} />}
          {activeView === 'Trend Analysis' && <TrendAnalyzer tickets={tickets} />}
          {activeView === 'Settings' && <SettingsPage />}
          {activeView === 'Support' && <SupportPage />}
        </main>
      </SidebarInset>
    </div>
  );
}
