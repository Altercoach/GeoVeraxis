import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, FileSignature, ToyBrick } from "lucide-react";

export default function BlockchainPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Blockchain Integration
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Leveraging blockchain for unparalleled security and transparency in property management.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <FileSignature className="h-8 w-8 text-primary" />
                <CardTitle>Smart Contracts</CardTitle>
            </div>
            <CardDescription>Immutable Record-Keeping</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All property records and transactions are recorded on the blockchain via smart contracts. This creates an unchangeable, time-stamped ledger, ensuring the integrity and authenticity of legal documents and ownership history.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <ToyBrick className="h-8 w-8 text-primary" />
                <CardTitle>Asset Tokenization</CardTitle>
            </div>
            <CardDescription>Property as NFTs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Physical properties can be represented as Non-Fungible Tokens (NFTs) on the blockchain. This simplifies the process of transferring ownership, dividing assets, and using property as collateral in a secure, digital format.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                <CardTitle>Decentralized Verification</CardTitle>
            </div>
            <CardDescription>Blockchain-Based Notarization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Legal documents and certifications are verified and notarized on the blockchain. This decentralized approach removes single points of failure and allows for instant, trustless verification by authorized parties like banks and government agencies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
