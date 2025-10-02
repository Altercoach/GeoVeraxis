import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileCheck2,
  Database,
  Banknote,
  ShieldCheck,
  FileSignature,
  Bell,
  MapPin,
  ScanSearch,
  FileText,
  GitCompareArrows,
} from "lucide-react";

const mortgageWorkflow = [
  { icon: FileCheck2, text: "AI Document Validation" },
  { icon: Database, text: "Blockchain Property Verification" },
  { icon: Banknote, text: "Automated Valuation Model" },
  { icon: ShieldCheck, text: "Risk Assessment AI" },
  { icon: FileSignature, text: "Smart Contract Execution" },
  { icon: Bell, text: "Auto-notification System" },
];

const registrationWorkflow = [
  { icon: MapPin, text: "AI Coordinate Validation" },
  { icon: ScanSearch, text: "Auto Boundary Detection" },
  { icon: ShieldCheck, text: "Neighboring Boundary Verification AI" },
  { icon: FileText, text: "Document Auto-generation" },
  { icon: Database, text: "Blockchain Minting (NFT)" },
  { icon: GitCompareArrows, text: "Multi-agency Sync" },
];

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Automated Workflows
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Visualize the AI-driven automated workflows that power the GeoVeraxis platform, ensuring efficiency and accuracy.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mortgage Approval Flow</CardTitle>
            <CardDescription>
              Triggered on mortgage application submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mortgageWorkflow.map((step, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{step.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Property Registration Flow</CardTitle>
            <CardDescription>
              Triggered on new property submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {registrationWorkflow.map((step, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{step.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
