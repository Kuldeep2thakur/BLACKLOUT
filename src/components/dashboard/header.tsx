'use client';

import * as React from 'react';
import type { TicketStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Search } from 'lucide-react';
import { revalidateDashboard } from '@/app/actions';
import { useSidebar } from '../ui/sidebar';
import { ThemeToggleButton } from '../theme-toggle-button';

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TicketStatus | 'all';
  onStatusFilterChange: (value: TicketStatus | 'all') => void;
}

export function Header({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: HeaderProps) {
  const [isPending, startTransition] = React.useTransition();
  const { toggleSidebar } = useSidebar();

  const handleRefresh = () => {
    startTransition(async () => {
      await revalidateDashboard();
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-2xl font-headline font-bold">IT Helpdesk Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tickets..."
            className="w-full rounded-lg bg-background/50 pl-9 md:w-[200px] lg:w-[320px]"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: TicketStatus | 'all') => onStatusFilterChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isPending}>
          <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
        <ThemeToggleButton />
      </div>
    </header>
  );
}
