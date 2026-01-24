import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
}

const sizeMap = {
  sm: { icon: 20, text: 'text-lg' },
  md: { icon: 28, text: 'text-xl' },
  lg: { icon: 36, text: 'text-2xl' }
};

export function Logo({ className, showText = true, size = 'md', variant = 'default' }: LogoProps) {
  const { icon, text } = sizeMap[size];
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'flex items-center justify-center rounded-lg p-1.5',
        variant === 'default' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-primary/20 text-primary-foreground'
      )}>
        <Leaf size={icon} className="drop-shadow-sm" />
      </div>
      {showText && (
        <span className={cn(
          'font-display font-bold tracking-tight',
          text,
          variant === 'default' ? 'text-foreground' : 'text-primary-foreground'
        )}>
          EcoFlow
        </span>
      )}
    </div>
  );
}
