'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleTranslation } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Languages, Loader2, Copy, Download, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  text: z.string().optional(),
  document: z.any().optional(),
  targetLanguage: z.string().min(1, "Se requiere el idioma de destino."),
}).refine(data => !!data.text || data.document?.length === 1, {
  message: "Se requiere texto o un documento.",
  path: ["text"],
});

type FormValues = z.infer<typeof formSchema>;

const languages = [
  { value: "Español", label: "Español" },
  { value: "Inglés", label: "Inglés" },
  { value: "Francés", label: "Francés" },
  { value: "Alemán", label: "Alemán" },
  { value: "Portugués", label: "Portugués" },
];

export function Translator() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      targetLanguage: "Español",
    },
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
    setTranslatedText("");
    try {
      let result;
      if (values.document && values.document.length > 0) {
        const file = values.document[0];
        const dataUri = await toDataURL(file);
        result = await handleTranslation({ documentDataUri: dataUri, targetLanguage: values.targetLanguage });
      } else if (values.text) {
        result = await handleTranslation({ text: values.text, targetLanguage: values.targetLanguage });
      } else {
        toast({
            variant: "destructive",
            title: "Falta Entrada",
            description: "Por favor, proporciona texto o un documento para traducir.",
        });
        setIsLoading(false);
        return;
      }
      setTranslatedText(result.translatedText);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falló la Traducción",
        description: "No se pudo traducir. Por favor, revisa el archivo o texto y vuelve a intentarlo.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    toast({ title: "¡Copiado al portapapeles!" });
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Traducir Contenido</CardTitle>
        <CardDescription>
          Introduce texto o sube un documento para traducirlo usando nuestra IA especializada en terminología legal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Entrada de Texto</TabsTrigger>
                    <TabsTrigger value="document">Subir Documento (OCR)</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="pt-4">
                    <FormField
                        control={form.control}
                        name="text"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Texto a Traducir</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Introduce el texto aquí..."
                                className="min-h-[150px]"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </TabsContent>
                <TabsContent value="document" className="pt-4">
                     <FormField
                        control={form.control}
                        name="document"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subir Documento</FormLabel>
                            <FormControl>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                                        <p className="text-xs text-muted-foreground">PDF, TXT, DOCX, PNG, JPG</p>
                                    </div>
                                    <Input 
                                        id="dropzone-file" 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
                                        onChange={(e) => field.onChange(e.target.files)}
                                    />
                                </label>
                            </div> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </TabsContent>
            </Tabs>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Texto Traducido</Label>
                    <div className="flex items-center gap-2">
                         <Button type="button" variant="ghost" size="icon" onClick={handleCopy} disabled={!translatedText || isLoading}>
                            <Copy className="h-4 w-4"/>
                            <span className="sr-only">Copiar</span>
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={handleDownload} disabled={!translatedText || isLoading}>
                            <Download className="h-4 w-4"/>
                             <span className="sr-only">Descargar</span>
                        </Button>
                    </div>
                </div>
                <Card className="min-h-[150px] bg-muted/50">
                    <CardContent className="p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full min-h-[126px]">
                                <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                            </div>
                        ) : (
                            <p className="text-sm min-h-[126px] whitespace-pre-wrap">{translatedText || 'La traducción aparecerá aquí...'}</p>
                        )}
                    </CardContent>
                </Card>
              </div>

            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem className="w-48">
                    <FormLabel>Idioma de Destino</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el idioma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="self-end">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traduciendo...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    Traducir
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
