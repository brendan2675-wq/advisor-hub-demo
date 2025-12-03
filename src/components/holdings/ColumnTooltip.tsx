import { Info } from 'lucide-react';
import { columnTooltips } from '@/data/mockData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ColumnTooltipProps {
  columnName: string;
  children: React.ReactNode;
}

export function ColumnTooltip({ columnName, children }: ColumnTooltipProps) {
  const tooltipText = columnTooltips[columnName];

  if (!tooltipText) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="inline-flex items-center gap-1 cursor-help"
            id={`column-${columnName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          >
            {children}
            <Info className="w-3 h-3 text-muted-foreground/60" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
