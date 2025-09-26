'use server';

/**
 * @fileOverview An AI agent for generating ticket trend analysis reports.
 *
 * - generateTicketTrends - A function that generates a ticket trend analysis report.
 * - GenerateTicketTrendsInput - The input type for the generateTicketTrends function.
 * - GenerateTicketTrendsOutput - The return type for the generateTicketTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTicketTrendsInputSchema = z.object({
  ticketData: z.string().describe('A JSON string containing the historical ticket data to analyze.'),
});
export type GenerateTicketTrendsInput = z.infer<typeof GenerateTicketTrendsInputSchema>;

const GenerateTicketTrendsOutputSchema = z.object({
  trendReport: z.string().describe('A detailed analysis of ticket trends, common issues, and resource allocation recommendations.'),
  actionItems: z.string().optional().describe('Specific action items or recommendations for managers based on the identified trends.'),
});
export type GenerateTicketTrendsOutput = z.infer<typeof GenerateTicketTrendsOutputSchema>;

export async function generateTicketTrends(input: GenerateTicketTrendsInput): Promise<GenerateTicketTrendsOutput> {
  return generateTicketTrendsFlow(input);
}

const generateTicketTrendsPrompt = ai.definePrompt({
  name: 'generateTicketTrendsPrompt',
  input: {schema: GenerateTicketTrendsInputSchema},
  output: {schema: GenerateTicketTrendsOutputSchema},
  prompt: `You are an expert IT helpdesk analyst. Analyze the following ticket data to identify trends, common issues, and provide resource allocation recommendations. If trends are identified, provide specific action items for managers.

Ticket Data: {{{ticketData}}}

Respond with a trendReport field and an actionItems field.
`,
});

const generateTicketTrendsFlow = ai.defineFlow(
  {
    name: 'generateTicketTrendsFlow',
    inputSchema: GenerateTicketTrendsInputSchema,
    outputSchema: GenerateTicketTrendsOutputSchema,
  },
  async input => {
    const {output} = await generateTicketTrendsPrompt(input);
    return output!;
  }
);
