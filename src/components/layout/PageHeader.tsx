
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  description, 
  children, 
  className,
  icon: Icon 
}) => {
  return (
    <div className={cn("flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8", className)}>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
