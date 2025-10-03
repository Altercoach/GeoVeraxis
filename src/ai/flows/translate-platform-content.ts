'use server';

/**
 * @fileOverview AI-powered translation for multi-language support.
 *
 * - translatePlatformContent - A function that translates the platform content.
 * - TranslatePlatformContentInput - The input type for the translatePlatformContent function.
 * - TranslatePlatformContentOutput - The return type for the translatePlatformContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatePlatformContentInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language for the translation.'),
});
export type TranslatePlatformContentInput = z.infer<typeof TranslatePlatformContentInputSchema>;

const TranslatePlatformContentOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslatePlatformContentOutput = z.infer<typeof TranslatePlatformContentOutputSchema>;

export async function translatePlatformContent(
  input: TranslatePlatformContentInput
): Promise<TranslatePlatformContentOutput> {
  return translatePlatformContentFlow(input);
}

const translatePlatformContentPrompt = ai.definePrompt({
  name: 'translatePlatformContentPrompt',
  input: {schema: TranslatePlatformContentInputSchema},
  output: {schema: TranslatePlatformContentOutputSchema},
  prompt: `You are a professional translator specializing in legal and real estate terminology. Translate the following text to {{targetLanguage}} accurately.
  
  Text to translate:
  '''
  {{{text}}}
  '''`,
});

const translatePlatformContentFlow = ai.defineFlow(
  {
    name: 'translatePlatformContentFlow',
    inputSchema: TranslatePlatformContentInputSchema,
    outputSchema: TranslatePlatformContentOutputSchema,
  },
  async input => {
    const {output} = await translatePlatformContentPrompt(input);
    return output!;
  }
);
