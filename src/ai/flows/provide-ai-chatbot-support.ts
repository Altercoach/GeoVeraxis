'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ProvideAiChatbotSupportInput = z.object({
  query: z.string().describe('The user\'s query.'),
});
export type ProvideAiChatbotSupportInput = z.infer<
  typeof ProvideAiChatbotSupportInput
>;

export const ProvideAiChatbotSupportOutput = z.object({
  response: z.string().describe('The AI\'s response to the user\'s query.'),
});
export type ProvideAiChatbotSupportOutput = z.infer<
  typeof ProvideAiChatbotSupportOutput
>;

const prompt = ai.definePrompt(
  {
    name: 'provideAiChatbotSupportPrompt',
    input: { schema: ProvideAiChatbotSupportInput },
    output: { schema: ProvideAiChatbotSupportOutput },
    prompt: `Eres un asistente de IA para GeoVeraxis, una plataforma avanzada para la gestión de documentos notariales geoespaciales.

Tu tarea es responder a la consulta del usuario de manera clara, concisa y útil. Sé un experto en la plataforma GeoVeraxis, procesos legales, terminología catastral y gestión de cuentas.

Consulta del usuario: {{{query}}}`,
  },
);

export async function provideAiChatbotSupport(
  input: ProvideAiChatbotSupportInput
): Promise<ProvideAiChatbotSupportOutput> {
  const llmResponse = await prompt(input);
  return llmResponse.output!;
}
