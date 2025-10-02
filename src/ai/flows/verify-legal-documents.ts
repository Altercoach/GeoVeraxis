'use server';

/**
 * @fileOverview This file defines a Genkit flow for verifying the authenticity and completeness of legal documents using AI.
 *
 * - verifyLegalDocument - A function that takes legal document data and returns a verification report.
 * - VerifyLegalDocumentInput - The input type for the verifyLegalDocument function.
 * - VerifyLegalDocumentOutput - The output type for the verifyLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyLegalDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A legal document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentDescription: z.string().describe('A description of the legal document.'),
  expectedData: z.record(z.string()).optional().describe('A set of key-value pairs of data that should be present in the document.'),
});

export type VerifyLegalDocumentInput = z.infer<typeof VerifyLegalDocumentInputSchema>;

const VerifyLegalDocumentOutputSchema = z.object({
  authenticity: z.object({
    isAuthentic: z.boolean().describe('Whether the document appears to be authentic.'),
    authenticityExplanation: z.string().describe('Explanation of the authenticity determination.'),
  }),
  completeness: z.object({
    isComplete: z.boolean().describe('Whether the document contains all expected data.'),
    missingData: z.array(z.string()).describe('List of any missing data elements.'),
  }),
  fraudIndicators: z.array(z.string()).describe('Any indicators of potential fraud.'),
});

export type VerifyLegalDocumentOutput = z.infer<typeof VerifyLegalDocumentOutputSchema>;

export async function verifyLegalDocument(input: VerifyLegalDocumentInput): Promise<VerifyLegalDocumentOutput> {
  return verifyLegalDocumentFlow(input);
}

const verifyLegalDocumentPrompt = ai.definePrompt({
  name: 'verifyLegalDocumentPrompt',
  input: {schema: VerifyLegalDocumentInputSchema},
  output: {schema: VerifyLegalDocumentOutputSchema},
  prompt: `You are an expert in legal document verification. Analyze the provided document and determine its authenticity and completeness.

Consider the following information:

Document Description: {{{documentDescription}}}
Document: {{media url=documentDataUri}}

Expected Data: {{#if expectedData}}The following data elements are expected to be present: {{JSONstringify expectedData}}{{else}}No specific data is expected.{{/if}}

Based on your analysis, provide a structured JSON output indicating authenticity, completeness, and any potential fraud indicators. Missing data should be an empty list if the document contains all expected data.

Pay special attention to potential signs of fraud, such as inconsistencies, alterations, or suspicious patterns.
`,
});

const verifyLegalDocumentFlow = ai.defineFlow(
  {
    name: 'verifyLegalDocumentFlow',
    inputSchema: VerifyLegalDocumentInputSchema,
    outputSchema: VerifyLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await verifyLegalDocumentPrompt(input);
    return output!;
  }
);
