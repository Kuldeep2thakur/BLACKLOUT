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
    <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                 <Button variant="ghost" onClick={() => handleSort('status')}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('created_at')}>
                  Created
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTickets.map(ticket => (
              <TableRow key={ticket.ticket_id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-xs">{ticket.ticket_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                       <Image src={ticket.avatar} alt={ticket.employee_name} width={32} height={32} data-ai-hint="person portrait" className="rounded-full" />
                      <AvatarFallback>{ticket.employee_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{ticket.employee_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="font-medium">{ticket.category}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">{ticket.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[ticket.status]}>
                    <StatusIcon status={ticket.status} />
                    <span className="ml-2">{ticket.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>{format(parseISO(ticket.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                    <UpdateStatusDropdown ticketId={ticket.ticket_id} />
                </TableCell>
              </TableRow>
            ))}
             {sortedTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </div>
  );
}
