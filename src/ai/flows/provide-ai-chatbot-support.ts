'use server';

/**
 * @fileOverview An AI-powered chatbot flow for user support on the platform.
 *
 * - provideAiChatbotSupport - A function that handles the chatbot interaction.
 * - ProvideAiChatbotSupportInput - The input type for the provideAiChatbotSupport function.
 * - ProvideAiChatbotSupportOutput - The return type for the provideAiChatbotSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAiChatbotSupportInputSchema = z.object({
  query: z.string().describe('The user query for the chatbot.'),
});
export type ProvideAiChatbotSupportInput = z.infer<typeof ProvideAiChatbotSupportInputSchema>;

const ProvideAiChatbotSupportOutputSchema = z.object({
  response: z.string().describe('The response from the chatbot.'),
});
export type ProvideAiChatbotSupportOutput = z.infer<typeof ProvideAiChatbotSupportOutputSchema>;

export async function provideAiChatbotSupport(input: ProvideAiChatbotSupportInput): Promise<ProvideAiChatbotSupportOutput> {
  return provideAiChatbotSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAiChatbotSupportPrompt',
  input: {schema: ProvideAiChatbotSupportInputSchema},
  output: {schema: ProvideAiChatbotSupportOutputSchema},
  prompt: `You are a helpful AI chatbot providing support for the GeoLegal Nexus platform.

  Answer the following user query, providing clear and concise information about the platform and legal processes.

  Query: {{{query}}}`,
});

const provideAiChatbotSupportFlow = ai.defineFlow(
  {
    name: 'provideAiChatbotSupportFlow',
    inputSchema: ProvideAiChatbotSupportInputSchema,
    outputSchema: ProvideAiChatbotSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
