import { X, BookOpen, HelpCircle, Workflow, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { columnTooltips } from '@/data/mockData';
import { useState } from 'react';

export function HelpPanel() {
  const { showHelpPanel, setShowHelpPanel, showToast } = useApp();
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  if (!showHelpPanel) return null;

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    showToast('Thank you for your feedback!');
  };

  const workflows = [
    'Reviewing portfolio performance',
    'Analyzing unrealised gains/losses',
    'Comparing holdings across clients',
    'Exporting reports for review',
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-foreground/20"
        onClick={() => setShowHelpPanel(false)}
      />
      
      {/* Panel */}
      <div className="help-panel animate-slide-in-right">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Help & Support</h2>
            </div>
            <button
              onClick={() => setShowHelpPanel(false)}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Quick Reference */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-foreground">Quick Reference Guide</h3>
              </div>
              <div className="bg-surface rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                <p><strong className="text-foreground">Compact View:</strong> Essential columns for quick portfolio overview</p>
                <p><strong className="text-foreground">Detailed View:</strong> Full analysis including cost basis and performance metrics</p>
                <p><strong className="text-foreground">Grouping:</strong> Organize by Asset Class, Account, or GICs sector</p>
              </div>
            </section>
            
            {/* Column Definitions */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-foreground">Column Definitions</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(columnTooltips).map(([column, definition]) => (
                  <div key={column} className="bg-surface rounded-lg p-3">
                    <h4 className="text-sm font-medium text-foreground mb-1">{column}</h4>
                    <p className="text-xs text-muted-foreground">{definition}</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Common Workflows */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Workflow className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-foreground">Common Workflows</h3>
              </div>
              <ul className="space-y-2">
                {workflows.map((workflow, idx) => (
                  <li 
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {workflow}
                  </li>
                ))}
              </ul>
            </section>
            
            {/* Contact Support */}
            <section>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </button>
            </section>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3 text-center">Was this helpful?</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleFeedback('up')}
                className={`p-2 rounded-lg transition-colors ${
                  feedback === 'up' ? 'bg-success/20 text-success' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className={`p-2 rounded-lg transition-colors ${
                  feedback === 'down' ? 'bg-destructive/20 text-destructive' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
