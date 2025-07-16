
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'text';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface StandardFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterOption[];
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const StandardFilters: React.FC<StandardFiltersProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  className
}) => {
  const hasActiveFilters = searchValue || Object.values(filterValues).some(value => value && value !== 'all');

  return (
    <Card className={cn("glass-card border-slate-200/60 dark:border-slate-700/60", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 w-5 h-5" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
          
          {/* Filter Controls */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              
              {filters.map((filter) => (
                <div key={filter.key} className="min-w-[140px]">
                  {filter.type === 'select' ? (
                    <Select
                      value={filterValues[filter.key] || 'all'}
                      onValueChange={(value) => onFilterChange(filter.key, value === 'all' ? '' : value)}
                    >
                      <SelectTrigger className="h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder={filter.label} />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60">
                        <SelectItem value="all">Todos</SelectItem>
                        {filter.options?.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type="text"
                      value={filterValues[filter.key] || ''}
                      onChange={(e) => onFilterChange(filter.key, e.target.value)}
                      placeholder={filter.placeholder || filter.label}
                      className="h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  )}
                </div>
              ))}
              
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="h-10 px-3 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardFilters;
