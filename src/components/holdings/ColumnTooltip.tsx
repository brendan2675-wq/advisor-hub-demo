import { useState } from 'react';
import { Info } from 'lucide-react';
import { columnTooltips } from '@/data/mockData';

interface ColumnTooltipProps {
  columnName: string;
  children: React.ReactNode;
}

export function ColumnTooltip({ columnName, children }: ColumnTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipText = columnTooltips[columnName];

  if (!tooltipText) {
    return <>{children}</>;
  }

  return (
    <div 
      className="relative inline-flex items-center gap-1 cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      id={`column-${columnName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    >
      {children}
      <Info className="w-3 h-3 text-muted-foreground/60" />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in">
          <div className="tooltip-content">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-foreground" />
            {tooltipText}
          </div>
        </div>
      )}
    </div>
  );
}
