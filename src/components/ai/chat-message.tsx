'use client';

import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Message } from '@/hooks/use-chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { sender, text } = message;
  const isUser = sender === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><Bot size={20} /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <p className="text-sm">{text}</p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback><User size={20} /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
