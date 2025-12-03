import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    targetId: 'grouping-dropdown',
    title: 'Group Your Holdings',
    content: 'Organize your portfolio view by Asset Class, Account, or GICs sector classification to analyze holdings from different perspectives.',
    position: 'bottom',
  },
  {
    targetId: 'column-unrealised-gain-loss-----',
    title: 'Track Performance',
    content: 'The Unrealised Gain/Loss columns show how each holding has performed since purchase. Green indicates gains, red indicates losses.',
    position: 'bottom',
  },
  {
    targetId: 'help-button',
    title: 'Get Help Anytime',
    content: 'Click the help icon anytime to access detailed column definitions, quick reference guides, and common workflows.',
    position: 'left',
  },
];

export function TourPopover() {
  const { showTour, setShowTour, tourStep, setTourStep, setHasSeenOnboarding } = useApp();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  useEffect(() => {
    if (!showTour) return;

    const step = tourSteps[tourStep];
    if (!step) return;

    const updatePosition = () => {
      const target = document.getElementById(step.targetId);
      if (!target) {
        // Fallback for column header that might have different ID
        if (step.targetId.includes('column-')) {
          const columnHeader = document.querySelector('[id^="column-"]');
          if (columnHeader) {
            const rect = columnHeader.getBoundingClientRect();
            setPosition({
              top: rect.bottom + 12,
              left: rect.left + rect.width / 2 - 160,
            });
            setArrowPosition('top');
            return;
          }
        }
        return;
      }

      const rect = target.getBoundingClientRect();
      const popoverWidth = 320;
      const popoverHeight = 160;

      let top = 0;
      let left = 0;

      switch (step.position) {
        case 'bottom':
          top = rect.bottom + 12;
          left = rect.left + rect.width / 2 - popoverWidth / 2;
          setArrowPosition('top');
          break;
        case 'top':
          top = rect.top - popoverHeight - 12;
          left = rect.left + rect.width / 2 - popoverWidth / 2;
          setArrowPosition('bottom');
          break;
        case 'left':
          top = rect.top + rect.height / 2 - popoverHeight / 2;
          left = rect.left - popoverWidth - 12;
          setArrowPosition('right');
          break;
        case 'right':
          top = rect.top + rect.height / 2 - popoverHeight / 2;
          left = rect.right + 12;
          setArrowPosition('left');
          break;
      }

      // Keep within viewport
      left = Math.max(16, Math.min(left, window.innerWidth - popoverWidth - 16));
      top = Math.max(16, top);

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [showTour, tourStep]);

  if (!showTour) return null;

  const step = tourSteps[tourStep];
  if (!step) return null;

  const handlePrevious = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    }
  };

  const handleDone = () => {
    setShowTour(false);
    setTourStep(0);
    setHasSeenOnboarding(true);
  };

  const isLastStep = tourStep === tourSteps.length - 1;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-foreground/20" />
      
      {/* Popover */}
      <div
        className="fixed z-50 popover-tour animate-scale-in"
        style={{ top: position.top, left: position.left, width: 320 }}
      >
        {/* Arrow */}
        <div
          className={`absolute w-3 h-3 bg-primary transform rotate-45 ${
            arrowPosition === 'top' ? '-top-1.5 left-1/2 -translate-x-1/2' :
            arrowPosition === 'bottom' ? '-bottom-1.5 left-1/2 -translate-x-1/2' :
            arrowPosition === 'left' ? 'top-1/2 -left-1.5 -translate-y-1/2' :
            'top-1/2 -right-1.5 -translate-y-1/2'
          }`}
        />
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-primary-foreground">{step.title}</h4>
            <span className="text-xs text-primary-foreground/70">
              {tourStep + 1} of {tourSteps.length}
            </span>
          </div>
          
          <p className="text-sm text-primary-foreground/90 mb-4 leading-relaxed">
            {step.content}
          </p>
          
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={tourStep === 0}
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {tourSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === tourStep ? 'bg-primary-foreground' : 'bg-primary-foreground/30'
                  }`}
                />
              ))}
            </div>
            
            {isLastStep ? (
              <button
                onClick={handleDone}
                className="text-sm font-medium text-primary-foreground hover:underline transition-colors"
              >
                Done
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="text-sm font-medium text-primary-foreground hover:underline transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
