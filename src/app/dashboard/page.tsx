import { getTickets } from '@/app/actions';
import { Dashboard } from '@/components/dashboard/dashboard';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function DashboardPage() {
  const tickets = await getTickets();
  return (
    <SidebarProvider>
      <Dashboard initialTickets={tickets} />
    </SidebarProvider>
  );
}
