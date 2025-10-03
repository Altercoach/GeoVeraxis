"use client";

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
import { Label } from "@/components/ui/label";
import { Languages, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  text: z.string().min(1, "Text to translate is required."),
  targetLanguage: z.string().min(1, "Target language is required."),
});

type FormValues = z.infer<typeof formSchema>;

const languages = [
  { value: "Spanish", label: "Spanish" },
  { value: "English", label: "English" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Portuguese", label: "Portuguese" },
];

export function Translator() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      targetLanguage: "Spanish",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setTranslatedText("");
    try {
      const result = await handleTranslation(values);
      setTranslatedText(result.translatedText);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description: "Could not translate the text. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translate Content</CardTitle>
        <CardDescription>
          Enter text and select a target language.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text to Translate</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label>Translated Text</Label>
                <Card className="min-h-[150px] bg-muted/50">
                    <CardContent className="p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full min-h-[126px]">
                                <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                            </div>
                        ) : (
                            <p className="text-sm min-h-[126px]">{translatedText || 'Translation will appear here...'}</p>
                        )}
                    </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem className="w-48">
                    <FormLabel>Target Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
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
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    Translate
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
