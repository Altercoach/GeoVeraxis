'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const TranslatePlatformContentInput = z.object({
  text: z.string().optional().describe('The text to translate.'),
  documentDataUri: z
    .string()
    .optional()
    .describe(
      "A document to translate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  targetLanguage: z
    .string()
    .describe(
      'The target language for the translation (e.g., "English", "Spanish").'
    ),
});
export type TranslatePlatformContentInput = z.infer<
  typeof TranslatePlatformContentInput
>;

export const TranslatePlatformContentOutput = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslatePlatformContentOutput = z.infer<
  typeof TranslatePlatformContentOutput
>;

const prompt = ai.definePrompt(
  {
    name: 'translatePlatformContentPrompt',
    inputSchema: TranslatePlatformContentInput,
    outputSchema: TranslatePlatformContentOutput,
    prompt: `Eres un traductor experto especializado en terminología legal, notarial y catastral. Tu tarea es traducir el siguiente contenido al {{targetLanguage}} con la mayor precisión posible.

Si se proporciona un documento, extrae el texto de él y tradúcelo. Si se proporciona texto, tradúcelo directamente.

Contenido a traducir:
{{#if text}}
Texto: {{{text}}}
{{/if}}
{{#if documentDataUri}}
Documento: {{media url=documentDataUri}}
{{/if}}
`,
  },
);

export async function translatePlatformContent(
  input: TranslatePlatformContentInput
): Promise<TranslatePlatformContentOutput> {
  const llmResponse = await prompt(input);
  return llmResponse.output!;
}
