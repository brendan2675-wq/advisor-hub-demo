import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, FileText, TrendingUp, Mail, Send, Clock, ThumbsUp, Ban, ChevronRight, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useAIInsights, Insight } from '@/hooks/useAIInsights';
import { useNotifications } from '@/hooks/useNotifications';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AIAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Hi! I'm your AI assistant. Ask me anything about your portfolio." }
  ]);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { contextMode, showToast } = useApp();
  const { insights, dismissInsight, markHelpful, neverShowAgain } = useAIInsights();
  const { forYouNotifications, unreadCount } = useNotifications();

  const isPrivate = contextMode === 'private';
  const totalBadgeCount = insights.length + unreadCount;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const quickActions = [
    { label: 'Performance Report', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Holdings Summary', icon: <FileText className="w-4 h-4" /> },
    { label: 'Email Client', icon: <Mail className="w-4 h-4" /> },
    { label: 'Generate Report', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleQuickAction = (label: string) => {
    showToast(`${label}...`);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I'm analyzing your portfolio data. Based on current holdings, your asset allocation looks well-balanced with room for optimization in the fixed income sector." 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Single Floating Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className={cn(
              "fixed bottom-6 right-6 z-20 w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
              "flex items-center justify-center",
              isPrivate 
                ? "bg-gradient-to-br from-slate-800 to-slate-900" 
                : "bg-gradient-to-br from-teal-500 to-blue-600"
            )}
          >
            <Sparkles className="w-7 h-7 text-white" />
            {totalBadgeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
              </span>
            )}
          </button>
        </SheetTrigger>

        <SheetContent className="w-[380px] p-0 flex flex-col">
          {/* Header */}
          <SheetHeader className={cn(
            "px-4 py-3 border-b",
            isPrivate
              ? "bg-gradient-to-r from-slate-800 to-slate-900"
              : "bg-gradient-to-r from-teal-500 to-blue-600"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <SheetTitle className="text-white font-semibold">AI Assistant</SheetTitle>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Quick Actions Section */}
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      className="h-auto py-3 flex flex-col items-center gap-2 text-xs"
                      onClick={() => handleQuickAction(action.label)}
                    >
                      {action.icon}
                      <span className="text-center leading-tight">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </section>

              {/* AI Insights Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {insights.length} active
                  </span>
                </div>
                {insights.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground bg-muted/30 rounded-lg">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No insights available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {insights.slice(0, 3).map((insight) => (
                      <InsightCard
                        key={insight.id}
                        insight={insight}
                        isExpanded={expandedInsight === insight.id}
                        onToggleExpand={() => setExpandedInsight(
                          expandedInsight === insight.id ? null : insight.id
                        )}
                        onHelpful={() => markHelpful(insight.id)}
                        onDismiss={() => dismissInsight(insight.id)}
                        onNeverShow={() => neverShowAgain(insight.id)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Ask AI Section */}
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Ask AI</h3>
                <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "text-xs p-2 rounded-lg max-w-[90%]",
                          msg.role === 'user'
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-background text-foreground"
                        )}
                      >
                        {msg.content}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about your portfolio..."
                      className="text-xs h-8"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button size="sm" className="h-8 w-8 p-0" onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </section>

              {/* Updates Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Updates</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {forYouNotifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground bg-muted/30 rounded-lg">
                    <Bell className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No updates</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {forYouNotifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 rounded-lg bg-muted/30 border border-border/50",
                          !notification.read && "border-l-2 border-l-primary"
                        )}
                      >
                        <p className="text-xs font-medium text-foreground">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface InsightCardProps {
  insight: Insight;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onHelpful: () => void;
  onDismiss: () => void;
  onNeverShow: () => void;
}

function InsightCard({ 
  insight, 
  isExpanded, 
  onToggleExpand, 
  onHelpful, 
  onDismiss, 
  onNeverShow 
}: InsightCardProps) {
  const priorityColors = {
    high: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
    medium: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    low: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
  };

  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
      <div className="flex items-start gap-2">
        <span className="text-lg">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full border",
              priorityColors[insight.priority]
            )}>
              {insight.category}
            </span>
          </div>
          <p className="text-xs font-medium text-foreground leading-snug">
            {insight.title}
          </p>
          
          {isExpanded && insight.explanation && (
            <div className="mt-2 p-2 bg-muted/50 rounded text-[10px] text-muted-foreground">
              {insight.explanation}
            </div>
          )}

          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={onHelpful}
              className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Clock className="w-3 h-3" />
            </button>
            <button
              onClick={onNeverShow}
              className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Ban className="w-3 h-3" />
            </button>
            {insight.explanation && (
              <button
                onClick={onToggleExpand}
                className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ml-auto"
              >
                <ChevronRight className={cn(
                  "w-3 h-3 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
