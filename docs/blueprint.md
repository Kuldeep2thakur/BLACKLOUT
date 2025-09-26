# **App Name**: Ticket Trender

## Core Features:

- Ticket Dashboard: Display key ticket statistics and a sortable/filterable table.
- Ticket Table: A tabular view of all the current helpdesk tickets.
- 3D Visualization: Display interactive 3D pie chart of tickets showing the status.
- Trend Analyzer Tool: Use the LLM to analyze ticket descriptions and generate trend reports; the LLM acts as a tool and decides if or when to suggest action items or recommendations to managers, based on trends identified in historical data.
- Admin: Ticket fetch: Button to manually refresh the latest data from Firestore
- Admin: Update Status: Provide functionality to change ticket status in Firestore.
- Notifications: Show a toast when a ticket is updated.

## Style Guidelines:

- Primary color: Vibrant purple (#A050BE) to bring out a high-tech aesthetic.
- Background color: Dark navy (#1A202C) for a modern, high-tech dark mode theme.
- Accent color: Neon green (#39FF14) for interactive elements.
- Headline font: 'Space Grotesk' sans-serif for a modern feel; use 'Inter' for body text
- Use simple, geometric icons from a library like Remix Icon, with neon green accents on hover.
- Sidebar for navigation on the left, main dashboard content on the right.
- Subtle transitions and hover effects on dashboard elements and charts. Animated value changes in stats cards.