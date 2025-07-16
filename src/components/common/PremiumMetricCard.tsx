
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedCounter from './AnimatedCounter';

interface PremiumMetricCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  onClick?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const PremiumMetricCard: React.FC<PremiumMetricCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'primary',
  className,
  onClick,
  trend,
  subtitle
}) => {
  const variantConfig = {
    primary: {
      gradient: 'from-blue-600 via-purple-600 to-indigo-700',
      glow: 'shadow-[0_0_40px_rgba(59,130,246,0.3)]',
      border: 'border-blue-500/30'
    },
    success: {
      gradient: 'from-emerald-500 via-teal-600 to-green-700',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]',
      border: 'border-emerald-500/30'
    },
    warning: {
      gradient: 'from-amber-500 via-orange-500 to-red-600',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.3)]',
      border: 'border-amber-500/30'
    },
    danger: {
      gradient: 'from-red-500 via-pink-600 to-rose-700',
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.3)]',
      border: 'border-red-500/30'
    },
    info: {
      gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
      glow: 'shadow-[0_0_40px_rgba(6,182,212,0.3)]',
      border: 'border-cyan-500/30'
    }
  };

  const config = variantConfig[variant];

  return (
    <div 
      className={cn(
        "relative group cursor-pointer transition-all duration-500 transform hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      {/* Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        config.glow
      )} />
      
      {/* Main Card */}
      <div className={cn(
        "relative glass-card backdrop-blur-xl border-2 rounded-2xl p-6 overflow-hidden",
        "bg-white/10 dark:bg-slate-800/20",
        config.border,
        "hover:border-opacity-60 transition-all duration-500"
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-radial from-white/20 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "p-4 rounded-xl bg-gradient-to-br shadow-lg transform group-hover:scale-110 transition-transform duration-300",
              config.gradient
            )}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            
            {trend && (
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1",
                trend.isPositive 
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                  : "bg-red-500/20 text-red-600 dark:text-red-400"
              )}>
                <span>{trend.isPositive ? '↗' : '↘'}</span>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          
          {/* Metrics */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
            </div>
            
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {title}
            </h3>
            
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Hover Effect Lines */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-transparent via-current to-transparent" />
      </div>
    </div>
  );
};

export default PremiumMetricCard;
