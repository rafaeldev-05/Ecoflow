import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode | {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({ 
  icon: Icon = PackageOpen, 
  title, 
  description, 
  action,
  className,
  children
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-4 text-center',
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {action && (
        typeof action === 'object' && 'label' in action && 'onClick' in action ? (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        ) : (
          action
        )
      )}
      {children}
    </div>
  );
}
