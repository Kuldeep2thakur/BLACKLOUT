import { Button } from '@/components/ui/button';
import { CircleDot } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-primary/20 text-primary">
          <CircleDot className="h-12 w-12" />
        </div>
        <div>
          <h1 className="text-5xl font-headline font-bold">Ticket Trender</h1>
          <p className="text-muted-foreground text-lg">Smart Helpdesk IT Dashboard</p>
        </div>
      </div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-lg mb-8">
          Gain valuable insights into your IT helpdesk operations. Track tickets, analyze trends, and optimize your resource allocation with our AI-powered dashboard.
        </p>
        <Link href="/login">
          <Button size="lg" className="font-semibold text-lg py-6 px-8">
            Employee Login
          </Button>
        </Link>
      </div>
       <div className="absolute bottom-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Ticket Trender. All rights reserved.</p>
      </div>
    </div>
  );
}
