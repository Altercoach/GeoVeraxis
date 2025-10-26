'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Send } from 'lucide-react';

const formSchema = z.object({
  query: z.string().min(1, "Message cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

interface ChatInputProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex w-full items-center space-x-2">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Escribe tu mensaje..." {...field} autoComplete="off" disabled={isLoading} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar</span>
        </Button>
      </form>
    </Form>
  );
}
