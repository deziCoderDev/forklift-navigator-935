
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'text';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface PremiumFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterOption[];
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  className?: string;
  title?: string;
}

const PremiumFilters: React.FC<PremiumFiltersProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  className,
  title = "Filtros Inteligentes"
}) => {
  const hasActiveFilters = searchValue || Object.values(filterValues).some(value => value && value !== 'all');

  return (
    <div className={cn("relative group", className)}>
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      
      <Card className="relative glass-card backdrop-blur-xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 rounded-3xl overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Premium Search Bar */}
          <div className="relative group/search">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover/search:opacity-100 transition-opacity duration-300 blur-sm" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 transition-colors duration-200" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-14 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-200/60 dark:border-slate-600/60 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg font-medium"
              />
            </div>
          </div>
          
          {/* Advanced Filters */}
          {filters.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <SlidersHorizontal className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Filtros Avançados
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filters.map((filter, index) => (
                  <div 
                    key={filter.key} 
                    className="relative group/filter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {filter.type === 'select' ? (
                      <Select
                        value={filterValues[filter.key] || 'all'}
                        onValueChange={(value) => onFilterChange(filter.key, value === 'all' ? '' : value)}
                      >
                        <SelectTrigger className="h-12 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-200/60 dark:border-slate-600/60 rounded-xl text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium">
                          <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-slate-200/60 dark:border-slate-700/60 rounded-xl">
                          <SelectItem value="all" className="font-medium">Todos</SelectItem>
                          {filter.options?.map(option => (
                            <SelectItem key={option.value} value={option.value} className="font-medium">
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
                        className="h-12 bg-slate-50/80 dark:bg-slate-800/80 border-2 border-slate-200/60 dark:border-slate-600/60 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                      />
                    )}
                  </div>
                ))}
                
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="h-12 px-6 bg-red-50/80 dark:bg-red-900/20 border-2 border-red-200/60 dark:border-red-700/60 text-red-600 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-800/30 hover:border-red-300 dark:hover:border-red-600 rounded-xl font-semibold transition-all duration-300 group/clear"
                  >
                    <X className="w-4 h-4 mr-2 group-hover/clear:rotate-90 transition-transform duration-300" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumFilters;
