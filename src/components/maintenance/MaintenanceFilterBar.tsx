
import React from 'react';
import { Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdvancedFilters from '@/components/common/AdvancedFilters';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StatusManutencao, TipoManutencao, PrioridadeOperacao } from '@/types';

interface MaintenanceFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  filters: Record<string, any>;
  setFilters: (value: Record<string, any>) => void;
  clearFilters: () => void;
  filterOptions: any[];
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
}

const MaintenanceFilterBar: React.FC<MaintenanceFilterBarProps> = ({
  search,
  setSearch,
  filters,
  setFilters,
  clearFilters,
  filterOptions,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            type="text" 
            placeholder="Buscar por problema, empilhadeira ou responsável..." 
            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          <div className="grid grid-cols-2 sm:flex gap-3">
            <select 
              className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white text-sm h-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[120px]"
              value={filters.status || 'all'}
              onChange={(e) => setFilters({ ...filters, status: e.target.value === 'all' ? '' : e.target.value })}
            >
              <option value="all">Status</option>
              <option value={StatusManutencao.ABERTA}>Aberta</option>
              <option value={StatusManutencao.EM_ANDAMENTO}>Em Andamento</option>
              <option value={StatusManutencao.CONCLUIDA}>Concluída</option>
            </select>
            <select 
              className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white text-sm h-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[120px]"
              value={filters.tipo || 'all'}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value === 'all' ? '' : e.target.value })}
            >
              <option value="all">Tipos</option>
              <option value={TipoManutencao.PREVENTIVA}>Preventiva</option>
              <option value={TipoManutencao.CORRETIVA}>Corretiva</option>
              <option value={TipoManutencao.PREDITIVA}>Preditiva</option>
            </select>
            <select 
              className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white text-sm h-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[120px]"
              value={filters.prioridade || 'all'}
              onChange={(e) => setFilters({ ...filters, prioridade: e.target.value === 'all' ? '' : e.target.value })}
            >
              <option value="all">Prioridades</option>
              <option value={PrioridadeOperacao.CRITICA}>Crítica</option>
              <option value={PrioridadeOperacao.ALTA}>Alta</option>
              <option value={PrioridadeOperacao.NORMAL}>Normal</option>
              <option value={PrioridadeOperacao.BAIXA}>Baixa</option>
            </select>
          </div>
          {/* Advanced Filters and View Toggle */}
          <div className="flex gap-2">
            <AdvancedFilters
              filters={filterOptions}
              values={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              triggerProps={{
                className: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white flex-shrink-0"
              }}
            />
            {/* View Toggle */}
            <div className="flex border border-slate-600 rounded-lg bg-slate-800">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "rounded-r-none px-3",
                  viewMode === 'grid' 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-transparent text-slate-300 hover:bg-slate-600 hover:text-white"
                )}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "rounded-l-none px-3",
                  viewMode === 'list' 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-transparent text-slate-300 hover:bg-slate-600 hover:text-white"
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceFilterBar;
