"use server";

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
  verifyLegalDocument,
  VerifyLegalDocumentInput,
  VerifyLegalDocumentOutput,
} from "@/ai/flows/verify-legal-documents";

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

export async function verifyLegalDocumentAction(
  input: VerifyLegalDocumentInput
): Promise<VerifyLegalDocumentOutput> {
  try {
    const result = await verifyLegalDocument(input);
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
