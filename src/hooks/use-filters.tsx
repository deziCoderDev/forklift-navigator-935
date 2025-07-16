
import { useState, useMemo } from 'react';

interface UseFiltersProps<T> {
  data: T[];
  searchFields: (keyof T)[];
}

export function useFilters<T>({ data, searchFields }: UseFiltersProps<T>) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = search === '' || searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(search.toLowerCase());
      });

      // Advanced filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === '') return true;
        
        const itemValue = item[key as keyof T];
        
        // Handle different filter types
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        
        return String(itemValue) === String(value);
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, search, filters, searchFields]);

  const clearFilters = () => {
    setFilters({});
    setSearch('');
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  return {
    search,
    setSearch,
    filters,
    setFilters,
    filteredData,
    clearFilters,
    clearFilter,
    hasActiveFilters: search !== '' || Object.keys(filters).length > 0
  };
}
