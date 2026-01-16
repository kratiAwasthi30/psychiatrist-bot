import { cn } from '@/lib/utils';

interface StressGaugeProps {
  level: number; // 0-100
  className?: string;
}

const StressGauge = ({ level, className }: StressGaugeProps) => {
  const getColor = () => {
    if (level <= 30) return 'bg-success';
    if (level <= 50) return 'bg-highlight';
    if (level <= 70) return 'bg-warning';
    return 'bg-destructive';
  };

  const getLabel = () => {
    if (level <= 30) return 'Low Stress';
    if (level <= 50) return 'Moderate';
    if (level <= 70) return 'Elevated';
    return 'High Stress';
  };

  const getEmoji = () => {
    if (level <= 30) return '😌';
    if (level <= 50) return '😐';
    if (level <= 70) return '😟';
    return '😰';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">{getLabel()}</span>
        <span className="text-2xl">{getEmoji()}</span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getColor())}
          style={{ width: `${level}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">Calm</span>
        <span className="text-xs font-semibold text-foreground">{level}%</span>
        <span className="text-xs text-muted-foreground">Stressed</span>
      </div>
    </div>
  );
};

export default StressGauge;
