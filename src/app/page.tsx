import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bot, CircleDot, Ticket } from 'lucide-react';
import Link from 'next/link';
import { HeroAnimation } from '@/components/landing/hero-animation';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <CircleDot className="h-6 w-6" />
          </div>
          <span className="text-lg font-headline font-semibold">BLACKOUT</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button>IT Member Login</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <HeroAnimation />
          </div>
          <div className="relative z-10 container flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-6">
            <div className="p-4 rounded-2xl bg-primary/20 text-primary">
              <CircleDot className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter">
              Welcome to BLACKOUT
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Gain valuable insights into your IT helpdesk operations. Track tickets, analyze trends, and optimize your resource allocation with our AI-powered dashboard.
            </p>
            <Link href="/login">
              <Button size="lg" className="font-semibold text-lg py-6 px-8 mt-4">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-card/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our smart IT helpdesk dashboard provides you with the tools you need to stay on top of your support tickets.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
              <Card className="bg-card/50 border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/50">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4 text-primary"><Ticket size={32}/></div>
                  <CardTitle>Real-time Ticket Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Monitor incoming tickets, track their status, and manage assignments all in one place.
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/50">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4 text-primary"><Bot size={32}/></div>
                  <CardTitle>AI-Powered Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Leverage artificial intelligence to automatically identify recurring issues and performance trends.
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/50">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4 text-primary"><BarChart size={32}/></div>
                  <CardTitle>Data Visualization</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Interactive charts and graphs help you visualize ticket volume, resolution times, and status distributions.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} BLACKOUT. All rights reserved.</p>
      </footer>
    </div>
  );
}
