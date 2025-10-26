'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getChatbotResponse } from '@/lib/actions';

export type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: '¡Hola! ¿Cómo puedo ayudarte con GeoVeraxis hoy?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await getChatbotResponse({ query });
      const botMessage: Message = { sender: 'bot', text: result.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error del Chatbot',
        description: 'No se pudo obtener una respuesta. Por favor, inténtalo de nuevo.',
      });
      // Revert the user message if the bot fails to respond
      setMessages((prev) => prev.slice(0, prev.length - 1));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
};
