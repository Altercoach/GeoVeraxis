'use client';

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
  document: z.any().refine((files) => files?.length === 1, "Se requiere un documento."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  expectedData: z.array(z.object({
    key: z.string().min(1, "La clave es requerida."),
    value: z.string().min(1, "El valor es requerido."),
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
        title: "Falló la Verificación",
        description: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Verificar Documento</CardTitle>
          <CardDescription>
            Sube un documento y proporciona detalles para el análisis de la IA.
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
                    <FormLabel>Archivo del Documento</FormLabel>
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
                    <FormLabel>Descripción del Documento</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ej: 'Escritura de propiedad para C/ Principal, 123'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Datos Esperados (Opcional)</Label>
                <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`expectedData.${index}.key`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                           <FormControl>
                            <Input {...field} placeholder="Clave" />
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
                            <Input {...field} placeholder="Valor" />
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
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir par Clave-Valor
                </Button>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar Documento"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Informe de Verificación</CardTitle>
          <CardDescription>
            Análisis del documento generado por IA.
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
              <p>Tu informe de verificación aparecerá aquí.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <Alert variant={result.authenticity.isAuthentic ? "default" : "destructive"}>
                {result.authenticity.isAuthentic ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>Autenticidad</AlertTitle>
                <AlertDescription>{result.authenticity.authenticityExplanation}</AlertDescription>
              </Alert>

              <Alert variant={result.completeness.isComplete ? "default" : "destructive"}>
                {result.completeness.isComplete ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>Integridad</AlertTitle>
                <AlertDescription>
                  {result.completeness.isComplete ? "El documento contiene todos los datos esperados." : `Datos faltantes: ${result.completeness.missingData.join(", ")}`}
                </AlertDescription>
              </Alert>
              
              <Alert variant={result.fraudIndicators.length > 0 ? "destructive" : "default"}>
                {result.fraudIndicators.length > 0 ? <FileWarning className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <AlertTitle>Indicadores de Fraude</AlertTitle>
                <AlertDescription>
                  {result.fraudIndicators.length > 0 ? (
                     <ul className="list-disc pl-5">
                        {result.fraudIndicators.map((indicator, i) => <li key={i}>{indicator}</li>)}
                    </ul>
                  ) : "No se detectaron indicadores de fraude."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
