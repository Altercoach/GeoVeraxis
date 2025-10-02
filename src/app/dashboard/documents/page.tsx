import { DocumentVerifier } from "@/components/ai/document-verifier";

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Document Verification
        </h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Upload a legal document to have our AI analyze its authenticity, completeness, and check for potential fraud indicators. Describe the document and provide any expected key-value data points for a more accurate verification.
      </p>
      <DocumentVerifier />
    </div>
  );
}
