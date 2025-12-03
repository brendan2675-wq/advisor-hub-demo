import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversationalAI, ChatMessage, ChatAction } from '@/hooks/useConversationalAI';
import { useApp } from '@/context/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ 
  message, 
  onActionClick 
}: { 
  message: ChatMessage; 
  onActionClick: (action: ChatAction) => void;
}) {
  const { contextMode } = useApp();
  const isUser = message.role === 'user';

  // Simple markdown-like parsing for bold text
  const parseContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={cn(
      "flex gap-2 mb-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {!isUser && (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          contextMode === 'private' 
            ? "bg-gradient-to-br from-slate-600 to-slate-800" 
            : "bg-gradient-to-br from-primary to-primary/70"
        )}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isUser 
          ? contextMode === 'private'
            ? "bg-slate-700 text-white"
            : "bg-primary text-primary-foreground"
          : "bg-muted text-foreground"
      )}>
        <p className="text-sm whitespace-pre-line leading-relaxed">
          {parseContent(message.content)}
        </p>
        
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map(action => (
              <button
                key={action.id}
                onClick={() => onActionClick(action)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full transition-colors",
                  "bg-background/20 hover:bg-background/40",
                  isUser ? "text-white/90" : "text-foreground"
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
        
        <p className={cn(
          "text-xs mt-2 opacity-60",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  const { contextMode } = useApp();
  
  return (
    <div className="flex gap-2 mb-4">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        contextMode === 'private' 
          ? "bg-gradient-to-br from-slate-600 to-slate-800" 
          : "bg-gradient-to-br from-primary to-primary/70"
      )}>
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-muted rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export function ConversationalAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { contextMode } = useApp();
  const { messages, isTyping, sendMessage, executeAction, clearHistory } = useConversationalAI();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleActionClick = (action: ChatAction) => {
    executeAction(action);
  };

  const suggestedQuestions = [
    "How is the portfolio performing?",
    "Show tax harvest opportunities",
    "Which clients need reviews?",
    "What needs my attention today?",
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
            "text-sm font-medium",
            contextMode === 'private'
              ? "bg-slate-700 hover:bg-slate-600 text-white"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
          id="ask-ai-button"
        >
          <MessageSquare className="w-4 h-4" />
          Ask AI
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                contextMode === 'private' 
                  ? "bg-gradient-to-br from-slate-600 to-slate-800" 
                  : "bg-gradient-to-br from-primary to-primary/70"
              )}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-left">AI Assistant</SheetTitle>
                <p className="text-xs text-muted-foreground">Ask anything about your clients</p>
              </div>
            </div>
            <button
              onClick={clearHistory}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-1">
            {messages.map(message => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                onActionClick={handleActionClick}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Suggested questions (show only when few messages) */}
          {messages.length <= 1 && !isTyping && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about portfolios, tax, reviews..."
              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                input.trim() && !isTyping
                  ? contextMode === 'private'
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
