import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronDown, Settings, ThumbsUp, Clock, Ban, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { useAIInsights, Insight } from '@/hooks/useAIInsights';

export function AIInsightsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNewInsights, setHasNewInsights] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const { contextMode, activeTab, selectedClient } = useApp();
  const { insights, dismissInsight, markHelpful, neverShowAgain } = useAIInsights();

  useEffect(() => {
    if (insights.length > 0) {
      setHasNewInsights(true);
    }
  }, [activeTab, selectedClient.id]);

  const handleExpand = () => {
    setIsExpanded(true);
    setHasNewInsights(false);
  };

  const isPrivate = contextMode === 'private';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed State - Floating Button */}
      {!isExpanded && (
        <button
          onClick={handleExpand}
          className={cn(
            "relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            "flex items-center justify-center",
            isPrivate 
              ? "bg-gradient-to-br from-slate-800 to-slate-900" 
              : "bg-gradient-to-br from-teal-500 to-blue-600"
          )}
        >
          <Sparkles className="w-6 h-6 text-white" />
          {hasNewInsights && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      )}

      {/* Expanded State - Panel */}
      {isExpanded && (
        <div
          className={cn(
            "w-[400px] max-h-[500px] rounded-xl shadow-2xl overflow-hidden",
            "animate-in slide-in-from-bottom-4 duration-300",
            "border border-border/50"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "px-4 py-3 flex items-center justify-between",
              isPrivate
                ? "bg-gradient-to-r from-slate-800 to-slate-900"
                : "bg-gradient-to-r from-teal-500 to-blue-600"
            )}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">AI Insights</span>
              <span className="text-xs text-white/70 bg-white/20 px-2 py-0.5 rounded-full">
                {insights.length} active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-white/20 rounded transition-colors">
                <Settings className="w-4 h-4 text-white/80" />
              </button>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div className="px-4 py-3 bg-muted border-b border-border">
            <p className="text-sm text-muted-foreground">
              {getGreeting()}, viewing <span className="font-medium text-foreground">{selectedClient.name}</span>'s portfolio
            </p>
          </div>

          {/* Insights List */}
          <div className="max-h-[360px] overflow-y-auto bg-background">
            {insights.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No insights available right now</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {insights.map((insight) => (
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
          </div>
        </div>
      )}
    </div>
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
    <div className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-xl">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full border",
              priorityColors[insight.priority]
            )}>
              {insight.category}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">
            {insight.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {insight.summary}
          </p>
          
          {/* Expanded explanation */}
          {isExpanded && insight.explanation && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              {insight.explanation}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 mt-3">
            <button
              onClick={onHelpful}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ThumbsUp className="w-3 h-3" />
              Helpful
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Clock className="w-3 h-3" />
              Not now
            </button>
            <button
              onClick={onNeverShow}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Ban className="w-3 h-3" />
              Don't show
            </button>
            {insight.explanation && (
              <button
                onClick={onToggleExpand}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ml-auto"
              >
                <ChevronRight className={cn(
                  "w-3 h-3 transition-transform",
                  isExpanded && "rotate-90"
                )} />
                {isExpanded ? 'Less' : 'Explain'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
