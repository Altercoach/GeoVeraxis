'use server';

/**
 * @fileOverview AI-powered translation for multi-language support, including document OCR.
 *
 * - translatePlatformContent - A function that translates platform content from text or a document.
 * - TranslatePlatformContentInput - The input type for the translatePlatformContent function.
 * - TranslatePlatformContentOutput - The return type for the translatePlatformContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatePlatformContentInputSchema = z.object({
  text: z.string().optional().describe('The text to translate.'),
  documentDataUri: z.string().optional().describe("A document to extract text from and translate, as a data URI."),
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
  prompt: `You are a professional translator specializing in legal and real estate terminology.
  
  Your task is to translate the provided content into {{targetLanguage}}.

  The content to translate is provided either as plain text or within a document.
  {{#if documentDataUri}}
  First, extract all the text from the following document.
  Document: {{media url=documentDataUri}}
  
  After extracting the text, translate it accurately to {{targetLanguage}}.
  {{/if}}

  {{#if text}}
  Translate the following text to {{targetLanguage}}:
  '''
  {{{text}}}
  '''
  {{/if}}`,
});

const translatePlatformContentFlow = ai.defineFlow(
  {
    name: 'translatePlatformContentFlow',
    inputSchema: TranslatePlatformContentInputSchema,
    outputSchema: TranslatePlatformContentOutputSchema,
  },
  async input => {
    if (!input.text && !input.documentDataUri) {
      throw new Error('Either text or a document must be provided for translation.');
    }
    const {output} = await translatePlatformContentPrompt(input);
    return output!;
  }
);
