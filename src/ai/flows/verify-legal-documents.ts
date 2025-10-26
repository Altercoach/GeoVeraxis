'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const VerifyLegalDocumentInput = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A legal document image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentDescription: z
    .string()
    .describe('A description of the document provided by the user.'),
  expectedData: z
    .record(z.string())
    .optional()
    .describe(
      'A set of key-value pairs of data points the user expects to find in the document.'
    ),
});
export type VerifyLegalDocumentInput = z.infer<typeof VerifyLegalDocumentInput>;

export const VerifyLegalDocumentOutput = z.object({
  authenticity: z.object({
    isAuthentic: z
      .boolean()
      .describe('Whether the document appears to be authentic.'),
    authenticityExplanation: z
      .string()
      .describe(
        'A brief explanation of the authenticity assessment, noting any detected signs of tampering or forgery.'
      ),
  }),
  completeness: z.object({
    isComplete: z
      .boolean()
      .describe(
        'Whether the document contains all the expected key-value data points.'
      ),
    missingData: z
      .array(z.string())
      .describe(
        'A list of keys that were expected but not found in the document.'
      ),
  }),
  fraudIndicators: z
    .array(z.string())
    .describe(
      'A list of detected potential fraud indicators, such as inconsistent signatures, altered dates, or unusual formatting.'
    ),
});
export type VerifyLegalDocumentOutput = z.infer<
  typeof VerifyLegalDocumentOutput
>;

const prompt = ai.definePrompt({
  name: 'verifyLegalDocumentPrompt',
  input: { schema: VerifyLegalDocumentInput },
  output: { schema: VerifyLegalDocumentOutput },
  prompt: `Eres un experto en análisis forense de documentos legales para GeoVeraxis. Tu tarea es analizar el siguiente documento en busca de autenticidad, integridad y señales de fraude.

Contexto del usuario:
- Descripción del documento: {{{documentDescription}}}
- Datos esperados: {{#if expectedData}}{{jsonStringify expectedData}}{{else}}Ninguno{{/if}}

Documento a analizar:
{{media url=documentDataUri}}

Realiza las siguientes tareas:
1.  **Análisis de Autenticidad**: Evalúa si el documento parece auténtico. Busca señales de manipulación digital, sellos o firmas falsificadas, o inconsistencias en el formato. Determina si es auténtico y explica tu razonamiento.
2.  **Análisis de Integridad**: Si el usuario proporcionó "Datos esperados", verifica que cada clave y valor se encuentre presente y sea correcto en el documento. Indica si el documento está completo y lista cualquier dato faltante.
3.  **Detección de Indicadores de Fraude**: Identifica cualquier posible señal de fraude. Esto puede incluir fechas alteradas, firmas inconsistentes, lenguaje inusual, o cualquier otra anomalía que un experto detectaría.

Devuelve tu análisis en el formato JSON especificado.`,
});

export async function verifyLegalDocument(
  input: VerifyLegalDocumentInput
): Promise<VerifyLegalDocumentOutput> {
  const llmResponse = await prompt(input);
  return llmResponse.output!;
}
