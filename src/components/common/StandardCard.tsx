
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedCounter from './AnimatedCounter';

interface StandardCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  onClick?: () => void;
}

const StandardCard: React.FC<StandardCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
  className,
  onClick
}) => {
  const variantClasses = {
    default: 'from-slate-600 to-slate-800',
    success: 'from-emerald-500 to-emerald-700',
    warning: 'from-amber-500 to-orange-600', 
    danger: 'from-red-500 to-red-700',
    info: 'from-blue-500 to-cyan-600'
  };

  const gradientClass = variantClasses[variant];

  return (
    <Card 
      className={cn(
        "glass-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 overflow-hidden relative",
        className
      )}
      onClick={onClick}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-5",
        gradientClass
      )} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-br text-white shadow-lg",
            gradientClass
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardCard;
