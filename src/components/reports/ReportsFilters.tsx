
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ReportsFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
  selectedForklift: string;
  setSelectedForklift: (value: string) => void;
}

const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedPeriod,
  setSelectedPeriod,
  selectedForklift,
  setSelectedForklift
}) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            type="text" 
            placeholder="Buscar relatórios inteligentes..." 
            className="pl-10 bg-slate-900/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-auto min-w-[160px]">
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-slate-100 hover:bg-slate-800/70 transition-colors">
              <SelectValue placeholder="Todas as Categorias" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Todas as Categorias</SelectItem>
              <SelectItem value="operacoes" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Operações</SelectItem>
              <SelectItem value="manutencao" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Manutenção</SelectItem>
              <SelectItem value="abastecimento" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Abastecimento</SelectItem>
              <SelectItem value="operadores" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Operadores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Period Filter */}
        <div className="w-full lg:w-auto min-w-[160px]">
          <Select
            value={selectedPeriod || 'all'}
            onValueChange={(value) => setSelectedPeriod(value === 'all' ? '' : value)}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-slate-100 hover:bg-slate-800/70 transition-colors">
              <SelectValue placeholder="Todos os Períodos" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Todos os Períodos</SelectItem>
              <SelectItem value="hoje" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Hoje</SelectItem>
              <SelectItem value="semana" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Esta Semana</SelectItem>
              <SelectItem value="mes" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Este Mês</SelectItem>
              <SelectItem value="trimestre" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Trimestre</SelectItem>
              <SelectItem value="ano" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Este Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Forklift Filter */}
        <div className="w-full lg:w-auto min-w-[160px]">
          <Select
            value={selectedForklift || 'all'}
            onValueChange={(value) => setSelectedForklift(value === 'all' ? '' : value)}
          >
            <SelectTrigger className="bg-slate-900/50 border-slate-600/50 text-slate-100 hover:bg-slate-800/70 transition-colors">
              <SelectValue placeholder="Todas as Empilhadeiras" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">Todas as Empilhadeiras</SelectItem>
              <SelectItem value="emp-001" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">EMP-001</SelectItem>
              <SelectItem value="emp-002" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">EMP-002</SelectItem>
              <SelectItem value="emp-003" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">EMP-003</SelectItem>
              <SelectItem value="emp-004" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">EMP-004</SelectItem>
              <SelectItem value="emp-005" className="text-slate-100 hover:bg-slate-700 focus:bg-slate-700">EMP-005</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilters;
