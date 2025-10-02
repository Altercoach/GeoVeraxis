import { Chatbot } from "@/components/ai/chatbot";

export default function ChatbotPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Chatbot Support</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Ask our AI assistant anything about the GeoLegal Nexus platform, legal processes, or your account.
      </p>
      <div className="flex-1 min-h-0">
        <Chatbot />
      </div>
    </div>
  );
}
