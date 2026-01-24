import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  accentColor?: 'primary' | 'success' | 'warning' | 'info' | 'accent';
}

const accentColors = {
  primary: 'from-primary to-primary/80',
  success: 'from-success to-success/80',
  warning: 'from-warning to-warning/80',
  info: 'from-info to-info/80',
  accent: 'from-accent to-accent/80'
};

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor,
  trend, 
  className,
  accentColor = 'primary'
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('metric-card group', className)}
    >
      {/* Accent bar */}
      <div 
        className={cn(
          'absolute top-0 left-0 w-1 h-full rounded-l-xl bg-gradient-to-b',
          accentColors[accentColor]
        )} 
      />
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-display font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% vs. mês anterior</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={cn(
            'p-3 rounded-xl transition-colors',
            `bg-${accentColor}/10`,
            iconColor || `text-${accentColor}`,
            'group-hover:bg-primary/15'
          )}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
