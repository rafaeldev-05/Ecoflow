import { cn } from '@/lib/utils';
import { COLLECTION_STATUS, MATERIAL_STATUS } from '@/lib/constants';

interface StatusBadgeProps {
  status: string;
  type?: 'collection' | 'material';
  label?: string;
  className?: string;
}

export function StatusBadge({ status, type = 'collection', label, className }: StatusBadgeProps) {
  const statusConfig = type === 'collection' 
    ? COLLECTION_STATUS[status as keyof typeof COLLECTION_STATUS]
    : MATERIAL_STATUS[status as keyof typeof MATERIAL_STATUS];

  const displayLabel = label || statusConfig?.label || status;

  if (!statusConfig) {
    return (
      <span className={cn('status-badge bg-muted text-muted-foreground', className)}>
        {displayLabel}
      </span>
    );
  }

  return (
    <span className={cn(`status-badge status-${status}`, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {displayLabel}
    </span>
  );
}
