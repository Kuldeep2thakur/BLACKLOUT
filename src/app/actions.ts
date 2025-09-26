'use server';

import { tickets as mockTickets } from '@/lib/mock-data';
import type { Ticket, TicketStatus } from '@/types';
import { revalidatePath } from 'next/cache';

// In a real app, this would be a database like Firebase Firestore.
// We'll use a mutable array to simulate a database.
let tickets: Ticket[] = JSON.parse(JSON.stringify(mockTickets));

export async function getTickets(): Promise<Ticket[]> {
  // Simulate network delay for fetching data.
  await new Promise(resolve => setTimeout(resolve, 200));
  return JSON.parse(JSON.stringify(tickets));
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<{ success: boolean; message: string }> {
  // Simulate network delay for updating data.
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let ticketFound = false;
  tickets = tickets.map(ticket => {
    if (ticket.ticket_id === ticketId) {
      ticketFound = true;
      return { ...ticket, status, updated_at: new Date().toISOString() };
    }
    return ticket;
  });

  if (ticketFound) {
    revalidatePath('/');
    return { success: true, message: `Ticket ${ticketId} status updated to ${status}.` };
  } else {
    return { success: false, message: `Ticket ${ticketId} not found.` };
  }
}

export async function revalidateDashboard() {
  revalidatePath('/');
}
