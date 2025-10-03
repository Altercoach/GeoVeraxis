"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DocumentVerifier() {
  return (
    <div className="grid gap-8 md:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Verify Document</CardTitle>
          <CardDescription>
            Upload a document and provide details for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <p className="text-muted-foreground">The document verifier is temporarily disabled.</p>
        </CardContent>
      </Card>
    </div>
  );
}


/*
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifyLegalDocument } from "@/lib/actions";
import type { VerifyLegalDocumentOutput } from "@/ai/flows/verify-legal-documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle2, XCircle, FileWarning, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  document: z.any().refine((files) => files?.length === 1, "Document is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  expectedData: z.array(z.object({
    key: z.string().min(1, "Key is required."),
    value: z.string().min(1, "Value is required."),
  })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function DocumentVerifier() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifyLegalDocumentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      expectedData: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "expectedData",
  });

  const toDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const file = values.document[0];
      const dataUri = await toDataURL(file);

      const expectedDataRecord = values.expectedData?.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const response = await verifyLegalDocument({
        documentDataUri: dataUri,
        documentDescription: values.description,
        expectedData: expectedDataRecord,
      });

      setResult(response);
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Verify Document</CardTitle>
          <CardDescription>
            Upload a document and provide details for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'Property deed for 123 Main St.'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Expected Data (Optional)</Label>
                <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`expectedData.${index}.key`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                           <FormControl>
                            <Input {...field} placeholder="Key" />
                           </FormControl>
                           <FormMessage/>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`expectedData.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                           <FormControl>
                            <Input {...field} placeholder="Value" />
                           </FormControl>
                           <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                  </div>
                ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({key: "", value: ""})}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Key-Value Pair
                </Button>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Document"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Verification Report</CardTitle>
          <CardDescription>
            AI-generated analysis of the document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && !result && (
            <div className="text-center text-muted-foreground h-full flex items-center justify-center">
              <p>Your verification report will appear here.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <Alert variant={result.authenticity.isAuthentic ? "default" : "destructive"}>
                {result.authenticity.isAuthentic ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>Authenticity</AlertTitle>
                <AlertDescription>{result.authenticity.authenticityExplanation}</AlertDescription>
              </Alert>

              <Alert variant={result.completeness.isComplete ? "default" : "destructive"}>
                {result.completeness.isComplete ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>Completeness</AlertTitle>
                <AlertDescription>
                  {result.completeness.isComplete ? "Document contains all expected data." : `Missing data: ${result.completeness.missingData.join(", ")}`}
                </Gpt-response>
              </Alert>
              
              <Alert variant={result.fraudIndicators.length > 0 ? "destructive" : "default"}>
                {result.fraudIndicators.length > 0 ? <FileWarning className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <AlertTitle>Fraud Indicators</AlertTitle>
                <AlertDescription>
                  {result.fraudIndicators.length > 0 ? (
                     <ul className="list-disc pl-5">
                        {result.fraudIndicators.map((indicator, i) => <li key={i}>{indicator}</li>)}
                    </ul>
                  ) : "No fraud indicators detected."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
*/