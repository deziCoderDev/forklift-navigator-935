
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'number' | 'text';
  options?: { value: string; label: string }[];
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  values: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
  triggerProps?: React.ComponentProps<typeof Button>;
}

const AdvancedFilters = ({ 
  filters, 
  values, 
  onFiltersChange, 
  onClearFilters,
  triggerProps
}: AdvancedFiltersProps) => {
  const [open, setOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...values, [key]: value });
  };

  const handleClearFilter = (key: string) => {
    const newValues = { ...values };
    delete newValues[key];
    onFiltersChange(newValues);
  };

  const activeFiltersCount = Object.keys(values).filter(key => values[key] && values[key] !== '' && values[key] !== 'all').length;

  const renderFilter = (filter: FilterOption) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={values[filter.key] || 'all'}
            onValueChange={(value) => handleFilterChange(filter.key, value === 'all' ? '' : value)}
          >
            <SelectTrigger className="h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20">
              <SelectValue placeholder={`Selecione ${filter.label.toLowerCase()}`} />
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
        );
      case 'date':
        return (
          <Input
            type="date"
            value={values[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={values[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={`Digite ${filter.label.toLowerCase()}`}
            className="h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
        );
      case 'text':
        return (
          <Input
            type="text"
            value={values[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={`Digite ${filter.label.toLowerCase()}`}
            className="h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100"
          {...triggerProps}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60" align="start">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-slate-900 dark:text-slate-100">Filtros</CardTitle>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 h-8 px-2"
                >
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">{filter.label}</Label>
                  {values[filter.key] && values[filter.key] !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClearFilter(filter.key)}
                      className="h-6 w-6 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                {renderFilter(filter)}
              </div>
            ))}
            
            <div className="flex justify-end pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
              <Button 
                onClick={() => setOpen(false)} 
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Aplicar
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedFilters;
