'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function SupportPage() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline">Support</CardTitle>
        <CardDescription>Get help and find answers to your questions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">Support content will go here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
