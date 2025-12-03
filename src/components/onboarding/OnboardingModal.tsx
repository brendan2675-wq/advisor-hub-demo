import { X, Eye, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function OnboardingModal() {
  const { showOnboarding, setShowOnboarding, setHasSeenOnboarding, setShowTour } = useApp();

  if (!showOnboarding) return null;

  const handleSkip = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  const handleShowTour = () => {
    setShowOnboarding(false);
    setShowTour(true);
  };

  const features = [
    { icon: BarChart3, text: 'View cost base and average unit cost for each holding' },
    { icon: TrendingUp, text: 'Track unrealised gains and losses with color-coded indicators' },
    { icon: Eye, text: 'See estimated income and yield projections' },
    { icon: HelpCircle, text: 'Hover over column headers for instant explanations' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative bg-primary px-6 py-8 text-center">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">
            Welcome to Detailed Portfolio View
          </h2>
          <p className="text-primary-foreground/80 text-sm">
            Unlock deeper insights into your client's investments
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            What's New
          </h3>
          
          <ul className="space-y-4 mb-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground leading-relaxed">{feature.text}</span>
                </li>
              );
            })}
          </ul>
          
          {/* Preview Image */}
          <div className="bg-surface rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <div className="w-2 h-2 rounded-full bg-gain" />
              <span>Gains shown in green</span>
              <div className="w-2 h-2 rounded-full bg-loss ml-2" />
              <span>Losses shown in red</span>
            </div>
            <div className="h-20 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Table preview with new columns</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleShowTour}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Show Me Around
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
