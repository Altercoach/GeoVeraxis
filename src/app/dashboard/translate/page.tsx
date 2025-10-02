import { Translator } from "@/components/ai/translator";

export default function TranslatePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          AI-Powered Translation
        </h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Utilize our advanced AI to translate platform content in real-time. This tool is optimized for legal terminology to ensure accuracy across supported languages.
      </p>
      <Translator />
    </div>
  );
}
