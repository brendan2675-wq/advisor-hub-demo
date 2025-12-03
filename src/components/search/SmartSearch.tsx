import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight, Loader2, Sparkles, User, TrendingDown, HelpCircle, BarChart3, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useSmartSearch, SearchResult, SearchIntent } from '@/hooks/useSmartSearch';
import { cn } from '@/lib/utils';

interface SmartSearchProps {
  onClose?: () => void;
}

export function SmartSearch({ onClose }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeTab } = useApp();
  const { results, isSearching, search, executeResult, recentSearches, suggestedQueries } = useSmartSearch();

  const placeholders: Record<string, string> = {
    portfolio: 'Search holdings, ask about allocations...',
    gains: 'Search for tax loss candidates, gains...',
    performance: 'Ask about returns, compare performance...',
    default: 'Search clients, holdings, or ask a question...',
  };

  const placeholder = placeholders[activeTab] || placeholders.default;

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        search(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length + suggestedQueries.length;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      if (selectedIndex < results.length) {
        executeResult(results[selectedIndex]);
        setIsOpen(false);
        setQuery('');
      } else {
        const suggestionIndex = selectedIndex - results.length;
        if (suggestedQueries[suggestionIndex]) {
          setQuery(suggestedQueries[suggestionIndex]);
        }
      }
    }
  };

  const handleResultClick = (result: SearchResult) => {
    executeResult(result);
    setIsOpen(false);
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 max-w-xl">
      {/* Search Input */}
      <div className={cn(
        "relative flex items-center",
        isOpen && "z-50"
      )}>
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-9 pl-9 pr-16 rounded-lg text-sm",
            "bg-muted/50 border border-transparent",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none focus:border-primary/50 focus:bg-background",
            "transition-all duration-200"
          )}
        />
        <div className="absolute right-3 flex items-center gap-1">
          {isSearching && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
          {query && !isSearching && (
            <button
              onClick={() => setQuery('')}
              className="p-0.5 hover:bg-muted rounded"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={cn(
            "absolute top-full left-0 right-0 mt-2 z-50",
            "bg-popover border border-border rounded-xl shadow-xl",
            "max-h-[400px] overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}>
            {/* Searching State */}
            {isSearching && query && (
              <div className="p-4 flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing "{query}"...</span>
              </div>
            )}

            {/* Results */}
            {!isSearching && results.length > 0 && (
              <div className="overflow-y-auto max-h-[320px]">
                {/* AI Insight */}
                {results[0]?.insight && (
                  <div className="p-3 bg-primary/5 border-b border-border">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{results[0].insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{results[0].insight.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grouped Results */}
                {Object.entries(groupResultsByType(results)).map(([type, items]) => (
                  <div key={type} className="border-b border-border last:border-0">
                    <div className="px-3 py-2 bg-muted/30">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {getTypeIcon(type)} {type} ({items.length})
                      </span>
                    </div>
                    {items.map((result, idx) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className={cn(
                            "w-full px-3 py-2.5 flex items-center gap-3 text-left",
                            "hover:bg-muted/50 transition-colors",
                            selectedIndex === globalIndex && "bg-muted/50"
                          )}
                        >
                          <ResultIcon intent={result.intent} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                          </div>
                          {result.action && (
                            <span className="text-xs text-primary flex items-center gap-1">
                              {result.action} <ArrowRight className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && query && results.length === 0 && (
              <div className="p-6 text-center">
                <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No results for "{query}"</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Try a different search or ask a question</p>
              </div>
            )}

            {/* Empty State - Suggestions */}
            {!query && (
              <div className="p-3">
                {recentSearches.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Recent</p>
                    {recentSearches.slice(0, 3).map((recent, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(recent)}
                        className="w-full px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted/50 rounded transition-colors"
                      >
                        {recent}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Try asking</p>
                  {suggestedQueries.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        "w-full px-2 py-1.5 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors",
                        selectedIndex === results.length + idx && "bg-muted/50 text-foreground"
                      )}
                    >
                      <Sparkles className="w-3 h-3 inline mr-2 text-primary/60" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ResultIcon({ intent }: { intent: SearchIntent }) {
  const iconClass = "w-4 h-4 text-muted-foreground";
  switch (intent) {
    case 'client':
      return <User className={iconClass} />;
    case 'tax':
      return <TrendingDown className={iconClass} />;
    case 'help':
      return <HelpCircle className={iconClass} />;
    case 'analysis':
      return <BarChart3 className={iconClass} />;
    case 'report':
      return <FileText className={iconClass} />;
    default:
      return <Search className={iconClass} />;
  }
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'Clients': return '👤';
    case 'Holdings': return '📊';
    case 'Insights': return '💡';
    case 'Actions': return '🎯';
    case 'Help': return '❓';
    default: return '📋';
  }
}

function groupResultsByType(results: SearchResult[]): Record<string, SearchResult[]> {
  return results.reduce((acc, result) => {
    const type = result.type || 'Results';
    if (!acc[type]) acc[type] = [];
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);
}
