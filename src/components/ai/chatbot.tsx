'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@/hooks/use-chat';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function Chatbot() {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot /> Asistente IA
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
               <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot size={20}/></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <ChatInput
          onSubmit={(values) => sendMessage(values.query)}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
}
