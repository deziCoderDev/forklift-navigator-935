
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, Fuel, Plus, Search, Truck, User, TrendingUp, TrendingDown, Gauge, Droplets, Clock, MapPin, Wrench, Eye, Edit, Trash2, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Abastecimento } from '@/types';
import GasSupplyDialog from '@/components/gas/GasSupplyDialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AdvancedFilters from '@/components/common/AdvancedFilters';
import StandardCard from '@/components/common/StandardCard';
import { useFilters } from '@/hooks/use-filters';
import { useAppStore } from '@/stores/useAppStore';

const GasSupplyPage = () => {
  const { toast } = useToast();
  
  // Zustand store usage
  const gasSupplies = useAppStore((state) => state.abastecimentos);
  const operators = useAppStore((state) => state.operadores);
  const forklifts = useAppStore((state) => state.empilhadeiras);
  const addAbastecimento = useAppStore((state) => state.addAbastecimento);
  const updateAbastecimento = useAppStore((state) => state.updateAbastecimento);
  const deleteAbastecimento = useAppStore((state) => state.deleteAbastecimento);

  // Quick filter states
  const [quickOperator, setQuickOperator] = useState('');
  const [quickForklift, setQuickForklift] = useState('');
  const [quickLocation, setQuickLocation] = useState('');

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGasSupply, setSelectedGasSupply] = useState<Abastecimento | null>(null);

  // Available options from store data
  const availableForklifts = forklifts.map(f => ({ id: f.id, model: f.modelo }));
  const availableOperators = operators.map(o => ({ id: o.id, name: o.nome }));

  // Get unique values for filter options
  const operatorNames = [...new Set(gasSupplies.map(supply => supply.operador?.nome).filter(Boolean))];
  const forkliftIds = [...new Set(gasSupplies.map(supply => supply.empilhadeiraId))];
  const suppliers = [...new Set(gasSupplies.map(supply => supply.fornecedor).filter(Boolean))];
  const locations = [...new Set(gasSupplies.map(supply => supply.localAbastecimento).filter(Boolean))];

  // Define filter configuration for AdvancedFilters component
  const filterOptions = [
    {
      key: 'empilhadeiraId',
      label: 'Empilhadeira',
      type: 'select' as const,
      options: forkliftIds.map(id => ({ value: id, label: id }))
    },
    {
      key: 'operadorNome',
      label: 'Operador',
      type: 'select' as const,
      options: operatorNames.map(name => ({ value: name, label: name }))
    },
    {
      key: 'fornecedor',
      label: 'Fornecedor',
      type: 'select' as const,
      options: suppliers.map(supplier => ({ value: supplier, label: supplier }))
    },
    {
      key: 'localAbastecimento',
      label: 'Local',
      type: 'select' as const,
      options: locations.map(location => ({ value: location, label: location }))
    },
    {
      key: 'dataInicial',
      label: 'Data Inicial',
      type: 'date' as const
    },
    {
      key: 'dataFinal',
      label: 'Data Final',
      type: 'date' as const
    },
    {
      key: 'quantidadeMinima',
      label: 'Quantidade Mínima (L)',
      type: 'number' as const
    },
    {
      key: 'quantidadeMaxima',
      label: 'Quantidade Máxima (L)',
      type: 'number' as const
    }
  ];

  // Use filters hook
  const {
    search,
    setSearch,
    filters,
    setFilters,
    filteredData: filteredGasSupplies,
    clearFilters
  } = useFilters({
    data: gasSupplies,
    searchFields: ['empilhadeiraId', 'fornecedor', 'localAbastecimento']
  });

  // Apply additional quick filters
  const finalFilteredSupplies = filteredGasSupplies.filter(supply => {
    const matchesQuickOperator = quickOperator === '' || quickOperator === 'all' || 
      supply.operador?.nome === quickOperator;
    
    const matchesQuickForklift = quickForklift === '' || quickForklift === 'all' || 
      supply.empilhadeiraId === quickForklift;
    
    const matchesQuickLocation = quickLocation === '' || quickLocation === 'all' || 
      supply.localAbastecimento === quickLocation;
    
    return matchesQuickOperator && matchesQuickForklift && matchesQuickLocation;
  });

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setFilters({});
    setQuickOperator('');
    setQuickForklift('');
    setQuickLocation('');
  };

  // Count active filters
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] && filters[key] !== '' && filters[key] !== 'all'
  ).length + (search ? 1 : 0) + 
  (quickOperator && quickOperator !== 'all' ? 1 : 0) +
  (quickForklift && quickForklift !== 'all' ? 1 : 0) +
  (quickLocation && quickLocation !== 'all' ? 1 : 0);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Calculate KPIs
  const hasRealData = finalFilteredSupplies.length > 0;
  const totalConsumption = hasRealData
    ? finalFilteredSupplies.reduce((sum, supply) => sum + supply.quantidadeLitros, 0)
    : 0;
  const totalCost = hasRealData
    ? finalFilteredSupplies.reduce((sum, supply) => sum + supply.custoTotal, 0)
    : 0;
  const averageEfficiency = hasRealData
    ? finalFilteredSupplies.reduce((sum, supply) => sum + (supply.eficiencia || 0), 0) / finalFilteredSupplies.length
    : 0;

  const calculateEfficiency = (supply: Abastecimento) => {
    const hours = supply.horimetroFinal - supply.horimetroInicial;
    return hours > 0 ? supply.quantidadeLitros / hours : 0;
  };

  // Handle add/edit gas supply
  const handleSaveGasSupply = (supplyData: Abastecimento) => {
    if (editDialogOpen && selectedGasSupply) {
      updateAbastecimento(supplyData.id, supplyData);
      toast({
        title: "Abastecimento atualizado",
        description: "O abastecimento foi atualizado com sucesso."
      });
    } else {
      addAbastecimento(supplyData);
      toast({
        title: "Abastecimento criado",
        description: "Novo abastecimento registrado com sucesso."
      });
    }
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedGasSupply(null);
  };

  // Handle delete gas supply
  const handleDeleteGasSupply = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este abastecimento?")) {
      deleteAbastecimento(id);
      toast({
        title: "Abastecimento excluído",
        description: "O abastecimento foi excluído com sucesso."
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Gestão de Abastecimento
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Controle Inteligente de Abastecimento de Combustível
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              setSelectedGasSupply(null);
              setAddDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Novo Abastecimento
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StandardCard
          title="Total de Abastecimentos"
          value={hasRealData ? finalFilteredSupplies.length : 0}
          icon={Truck}
          variant="info"
        />
        
        <StandardCard
          title="Consumo Total"
          value={hasRealData ? `${totalConsumption.toFixed(1)}L` : "0L"}
          icon={Fuel}
          variant="success"
        />
        
        <StandardCard
          title="Custo Total"
          value={hasRealData ? `R$ ${totalCost.toFixed(0)}` : "R$ 0"}
          icon={Gauge}
          variant="warning"
        />
        
        <StandardCard
          title="Eficiência Média"
          value={hasRealData ? averageEfficiency.toFixed(2) : "N/A"}
          icon={Droplets}
          variant="default"
        />
      </div>

      {/* Advanced Search and Filters */}
      <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6">
            {/* Main Search Bar with Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  type="text" 
                  placeholder="Buscar por empilhadeira, fornecedor ou local..." 
                  className="pl-12 pr-4 py-4 text-lg bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl shadow-lg transition-all duration-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    onClick={() => setSearch('')}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>

              {/* Quick Filter - Operador */}
              <Select value={quickOperator} onValueChange={setQuickOperator}>
                <SelectTrigger className="w-[160px] border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <SelectValue placeholder="Operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Operadores</SelectItem>
                  {operatorNames.map(operator => (
                    <SelectItem key={operator} value={operator}>
                      {operator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quick Filter - Empilhadeira */}
              <Select value={quickForklift} onValueChange={setQuickForklift}>
                <SelectTrigger className="w-[160px] border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <SelectValue placeholder="Empilhadeira" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Empilhadeiras</SelectItem>
                  {forkliftIds.map(forklift => (
                    <SelectItem key={forklift} value={forklift}>
                      {forklift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quick Filter - Local */}
              <Select value={quickLocation} onValueChange={setQuickLocation}>
                <SelectTrigger className="w-[160px] border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <SelectValue placeholder="Local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Locais</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Advanced Filters */}
              <AdvancedFilters
                filters={filterOptions}
                values={filters}
                onFiltersChange={setFilters}
                onClearFilters={() => setFilters({})}
                triggerProps={{
                  className: "gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shadow-md border-2 border-slate-200 dark:border-slate-700"
                }}
              />
              
              {/* Clear All Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-md"
                  onClick={clearAllFilters}
                >
                  <X className="w-4 h-4" />
                  Limpar ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>

          {/* Filter Summary */}
          {activeFiltersCount > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''} • {finalFilteredSupplies.length} resultado{finalFilteredSupplies.length !== 1 ? 's' : ''} encontrado{finalFilteredSupplies.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Gas Supply Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Registros de Abastecimento
          </h2>
          <div className="text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {finalFilteredSupplies.length} registros encontrados
          </div>
        </div>
        
        {finalFilteredSupplies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {finalFilteredSupplies.map((supply) => (
              <Card key={supply.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {supply.id.slice(-2)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
                          {supply.id}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(supply.dataAbastecimento)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => {
                          setSelectedGasSupply(supply);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteGasSupply(supply.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {supply.empilhadeira?.modelo || 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {supply.empilhadeiraId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <User className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {supply.operador?.nome || 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">Operador</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                      <Fuel className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {supply.quantidadeLitros.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">Litros</p>
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                      <Gauge className="w-5 h-5 mx-auto mb-1 text-green-600" />
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {calculateEfficiency(supply).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">L/h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {supply.horimetroInicial} → {supply.horimetroFinal}h
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        R$ {supply.custoTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                  Nenhum abastecimento encontrado
                </h3>
                <p className="text-muted-foreground mt-1">
                  Tente ajustar os filtros ou adicione um novo registro de abastecimento
                </p>
              </div>
              <Button 
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => {
                  setSelectedGasSupply(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Novo Abastecimento
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Gas Supply Dialogs */}
      <GasSupplyDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveGasSupply}
        availableForklifts={availableForklifts}
        availableOperators={availableOperators}
      />
      
      <GasSupplyDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        gasSupply={selectedGasSupply || undefined}
        onSave={handleSaveGasSupply}
        availableForklifts={availableForklifts}
        availableOperators={availableOperators}
      />
    </div>
  );
};

export default GasSupplyPage;
