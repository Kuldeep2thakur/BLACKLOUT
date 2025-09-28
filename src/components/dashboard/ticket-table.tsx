'use client';

import * as React from 'react';
import type { Ticket, TicketStatus } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  Loader,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { updateTicketStatus } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '../ui/avatar';
import Image from 'next/image';

interface TicketTableProps {
  tickets: Ticket[];
}

type SortKey = 'created_at' | 'status' | 'priority';

const StatusIcon: React.FC<{ status: TicketStatus }> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'In Progress':
      return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'Resolved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

const statusColors: Record<TicketStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Resolved: 'bg-green-100 text-green-800 border-green-200',
};

const UpdateStatusDropdown: React.FC<{ ticketId: string }> = ({ ticketId }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const handleUpdateStatus = (status: TicketStatus) => {
    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, status);
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          Update Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(['Pending', 'In Progress', 'Resolved'] as TicketStatus[]).map(status => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleUpdateStatus(status)}
            disabled={isPending}
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export function TicketTable({ tickets }: TicketTableProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>('created_at');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedTickets = React.useMemo(() => {
    return [...tickets].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortKey === 'created_at') {
        const dateA = parseISO(aValue).getTime();
        const dateB = parseISO(bValue).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tickets, sortKey, sortOrder]);

  return (
    <div className="rounded-2xl border-0 bg-white/70 backdrop-blur-lg overflow-hidden shadow-xl">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-100/60 to-white/60">
            <TableHead className="font-bold text-gray-700">Ticket ID</TableHead>
            <TableHead className="font-bold text-gray-700">Employee</TableHead>
            <TableHead className="font-bold text-gray-700">Description</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('status')} className="text-gray-700">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('created_at')} className="text-gray-700">
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTickets.map(ticket => (
            <TableRow
              key={ticket.ticket_id}
              className="hover:bg-blue-50/60 transition-colors duration-200 group"
            >
              <TableCell className="font-mono text-xs text-blue-900 group-hover:text-primary">{ticket.ticket_id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <Image src={ticket.avatar} alt={ticket.employee_name} width={32} height={32} data-ai-hint="person portrait" className="rounded-full" />
                    <AvatarFallback>{ticket.employee_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-800 group-hover:text-primary">{ticket.employee_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-700 group-hover:text-primary">{ticket.category}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs group-hover:text-primary/80">{ticket.description}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[ticket.status] + ' border-2 group-hover:border-primary/60'}>
                  <StatusIcon status={ticket.status} />
                  <span className="ml-2">{ticket.status}</span>
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700">{format(parseISO(ticket.created_at), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-right">
                <UpdateStatusDropdown ticketId={ticket.ticket_id} />
              </TableCell>
            </TableRow>
          ))}
          {sortedTickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No tickets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
