'use client';

import * as React from 'react';
import type { Ticket } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { generateTicketTrends } from '@/ai/flows/generate-ticket-trends';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface TrendAnalyzerProps {
  tickets: Ticket[];
}

interface TrendReport {
  trendReport: string;
  actionItems?: string;
}

export function TrendAnalyzer({ tickets }: TrendAnalyzerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [report, setReport] = React.useState<TrendReport | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleAnalyze = () => {
    setReport(null);
    setError(null);
    startTransition(async () => {
      try {
        const ticketData = JSON.stringify(
          tickets.map(t => ({
            category: t.category,
            description: t.description,
            created_at: t.created_at,
            priority: t.priority,
          }))
        );

        const result = await generateTicketTrends({ ticketData });
        setReport(result);
      } catch (err) {
        console.error(err);
        setError('Failed to generate trend report. Please try again.');
      }
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline flex items-center gap-2">
                <Bot className="text-primary" />
                AI Trend Analyzer
                </CardTitle>
                <CardDescription>Generate insights from ticket data.</CardDescription>
            </div>
            <Button onClick={handleAnalyze} disabled={isPending} size="sm">
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Analyze
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex flex-col items-center justify-center space-y-2 h-40 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Analyzing ticket data...</p>
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {report && (
          <ScrollArea className="h-48">
            <div className="prose prose-sm prose-invert max-w-none text-sm text-foreground/90">
                <h4 className="font-semibold text-foreground">Trend Report</h4>
                <p>{report.trendReport}</p>
                {report.actionItems && (
                  <>
                    <Separator className="my-4" />
                    <h4 className="font-semibold text-foreground">Action Items</h4>
                    <p>{report.actionItems}</p>
                  </>
                )}
            </div>
          </ScrollArea>
        )}
        {!isPending && !report && !error && (
            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                <p>Click "Analyze" to generate an AI-powered report on ticket trends and potential action items.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
