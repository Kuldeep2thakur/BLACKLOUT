'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function SettingsPage() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline">Settings</CardTitle>
        <CardDescription>Manage your account and application settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">Settings content will go here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
