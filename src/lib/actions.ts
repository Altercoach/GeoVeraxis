'use server';

import { exec } from 'child_process';
import { promisify } from 'util';
import {
  provideAiChatbotSupport,
  ProvideAiChatbotSupportInput,
  ProvideAiChatbotSupportOutput,
} from "@/ai/flows/provide-ai-chatbot-support";
import {
  translatePlatformContent,
  TranslatePlatformContentInput,
  TranslatePlatformContentOutput,
} from "@/ai/flows/translate-platform-content";
import {
  verifyLegalDocument as verifyLegalDocumentFlow,
  VerifyLegalDocumentInput,
  VerifyLegalDocumentOutput,
} from "@/ai/flows/verify-legal-documents";

const execAsync = promisify(exec);

type CommandCenterAction = 'test' | 'typecheck' | 'lint' | 'audit';

export async function runCommandCenterAction(action: CommandCenterAction): Promise<{ stdout: string; stderr: string }> {
  const command = `npm run ${action}`;
  console.log(`Executing command: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command);
    return { stdout, stderr };
  } catch (error: any) {
    console.error(`Error executing command: ${command}`, error);
    return { stdout: error.stdout, stderr: error.stderr };
  }
}

export async function handleTranslation(
  input: TranslatePlatformContentInput
): Promise<TranslatePlatformContentOutput> {
  try {
    const result = await translatePlatformContent(input);
    return result;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate content.");
  }
}

export async function verifyLegalDocument(
  input: VerifyLegalDocumentInput
): Promise<VerifyLegalDocumentOutput> {
  try {
    const result = await verifyLegalDocumentFlow(input);
    return result;
  } catch (error) {
    console.error("Document verification error:", error);
    throw new Error("Failed to verify document.");
  }
}

export async function getChatbotResponse(
  input: ProvideAiChatbotSupportInput
): Promise<ProvideAiChatbotSupportOutput> {
  try {
    const result = await provideAiChatbotSupport(input);
    return result;
  } catch (error) {
    console.error("Chatbot error:", error);
    throw new Error("Failed to get chatbot response.");
  }
}
