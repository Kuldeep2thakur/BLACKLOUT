export type TicketStatus = 'Pending' | 'Resolved' | 'In Progress';
export type TicketPriority = 'High' | 'Medium' | 'Low';

export type Ticket = {
  ticket_id: string;
  employee_id: string;
  employee_name: string;
  avatar: string;
  category: string;
  description: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  priority: TicketPriority;
};
