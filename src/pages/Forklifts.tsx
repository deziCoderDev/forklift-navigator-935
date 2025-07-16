import React, { useState } from 'react';
import { Forklift, StatusEmpilhadeira, TipoEmpilhadeira } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Grid, List, Download, Upload, Truck, CheckCircle, Wrench, AlertTriangle } from 'lucide-react';
import ForkliftList from '@/components/forklift/ForkliftList';
import ForkliftCard from '@/components/forklift/ForkliftCard';
import ForkliftDialog from '@/components/forklift/ForkliftDialog';
import ForkliftDetails from '@/components/forklift/ForkliftDetails';
import AdvancedFilters from '@/components/common/AdvancedFilters';
import PaginationControls from '@/components/common/PaginationControls';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/layout/PageHeader';
import ForkliftStatsCard from '@/components/forklift/ForkliftStatsCard';
import ForkliftDeleteDialog from '@/components/forklift/ForkliftDeleteDialog';
import { useAppStore } from '@/stores/useAppStore';

// Mock data for the forklifts - Updated with proper data
const initialForklifts: Forklift[] = [
  {
    id: 'EMP001',
    modelo: 'Toyota 8FGU25',
    marca: 'Toyota',
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2500,
    anoFabricacao: 2022,
    dataAquisicao: '10/05/2022',
    numeroSerie: 'TOY001',
    horimetro: 12583,
    ultimaManutencao: '15/09/2023',
    proximaManutencao: '15/12/2023',
    localizacaoAtual: 'Setor A',
    setor: 'Armazém',
    custoHora: 45.50,
    eficiencia: 87.5,
    disponibilidade: 92.3,
    qrCode: 'QR001',
    // Legacy properties for compatibility
    model: 'Toyota 8FGU25',
    type: TipoEmpilhadeira.GAS,
    capacity: '2.500 kg',
    acquisitionDate: '10/05/2022',
    lastMaintenance: '15/09/2023',
    hourMeter: 12583,
  },
  {
    id: 'EMP002',
    modelo: 'Hyster E50XN',
    marca: 'Hyster',
    tipo: TipoEmpilhadeira.ELETRICA,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2250,
    anoFabricacao: 2021,
    dataAquisicao: '22/11/2021',
    numeroSerie: 'HYS002',
    horimetro: 8452,
    ultimaManutencao: '30/10/2023',
    proximaManutencao: '30/01/2024',
    localizacaoAtual: 'Setor B',
    setor: 'Produção',
    custoHora: 38.75,
    eficiencia: 89.2,
    disponibilidade: 94.1,
    qrCode: 'QR002',
    // Legacy properties for compatibility
    model: 'Hyster E50XN',
    type: TipoEmpilhadeira.ELETRICA,
    capacity: '2.250 kg',
    acquisitionDate: '22/11/2021',
    lastMaintenance: '30/10/2023',
    hourMeter: 8452,
  },
  {
    id: 'EMP003',
    modelo: 'Crown RR5725',
    marca: 'Crown',
    tipo: TipoEmpilhadeira.RETRATIL,
    status: StatusEmpilhadeira.EM_MANUTENCAO,
    capacidade: 1800,
    anoFabricacao: 2022,
    dataAquisicao: '04/03/2022',
    numeroSerie: 'CRW003',
    horimetro: 10974,
    ultimaManutencao: '12/08/2023',
    proximaManutencao: '12/11/2023',
    localizacaoAtual: 'Oficina',
    setor: 'Manutenção',
    custoHora: 42.30,
    eficiencia: 85.1,
    disponibilidade: 88.7,
    qrCode: 'QR003',
    // Legacy properties for compatibility
    model: 'Crown RR5725',
    type: TipoEmpilhadeira.RETRATIL,
    capacity: '1.800 kg',
    acquisitionDate: '04/03/2022',
    lastMaintenance: '12/08/2023',
    hourMeter: 10974,
  },
  {
    id: 'EMP004',
    modelo: 'Caterpillar EP25',
    marca: 'Caterpillar',
    tipo: TipoEmpilhadeira.ELETRICA,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2500,
    anoFabricacao: 2023,
    dataAquisicao: '15/07/2023',
    numeroSerie: 'CAT004',
    horimetro: 3245,
    ultimaManutencao: '20/11/2023',
    proximaManutencao: '20/02/2024',
    localizacaoAtual: 'Setor C',
    setor: 'Expedição',
    custoHora: 41.20,
    eficiencia: 91.8,
    disponibilidade: 96.5,
    qrCode: 'QR004',
    // Legacy properties for compatibility
    model: 'Caterpillar EP25',
    type: TipoEmpilhadeira.ELETRICA,
    capacity: '2.500 kg',
    acquisitionDate: '15/07/2023',
    lastMaintenance: '20/11/2023',
    hourMeter: 3245,
  },
  {
    id: 'EMP005',
    modelo: 'Yale GDP30',
    marca: 'Yale',
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.PARADA,
    capacidade: 3000,
    anoFabricacao: 2020,
    dataAquisicao: '08/02/2020',
    numeroSerie: 'YAL005',
    horimetro: 18567,
    ultimaManutencao: '05/12/2023',
    proximaManutencao: '05/03/2024',
    localizacaoAtual: 'Pátio',
    setor: 'Armazém',
    custoHora: 48.90,
    eficiencia: 72.3,
    disponibilidade: 65.8,
    qrCode: 'QR005',
    // Legacy properties for compatibility
    model: 'Yale GDP30',
    type: TipoEmpilhadeira.GAS,
    capacity: '3.000 kg',
    acquisitionDate: '08/02/2020',
    lastMaintenance: '05/12/2023',
    hourMeter: 18567,
  },
  {
    id: 'EMP006',
    modelo: 'Linde H25T',
    marca: 'Linde',
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2500,
    anoFabricacao: 2021,
    dataAquisicao: '12/09/2021',
    numeroSerie: 'LIN006',
    horimetro: 9834,
    ultimaManutencao: '18/10/2023',
    proximaManutencao: '18/01/2024',
    localizacaoAtual: 'Setor D',
    setor: 'Produção',
    custoHora: 44.75,
    eficiencia: 88.9,
    disponibilidade: 93.2,
    qrCode: 'QR006',
    // Legacy properties for compatibility
    model: 'Linde H25T',
    type: TipoEmpilhadeira.GAS,
    capacity: '2.500 kg',
    acquisitionDate: '12/09/2021',
    lastMaintenance: '18/10/2023',
    hourMeter: 9834,
  },
  {
    id: 'EMP007',
    modelo: 'Still RX70',
    marca: 'Still',
    tipo: TipoEmpilhadeira.ELETRICA,
    status: StatusEmpilhadeira.EM_MANUTENCAO,
    capacidade: 2000,
    anoFabricacao: 2023,
    dataAquisicao: '25/04/2023',
    numeroSerie: 'STL007',
    horimetro: 1876,
    ultimaManutencao: '10/12/2023',
    proximaManutencao: '10/03/2024',
    localizacaoAtual: 'Oficina',
    setor: 'Manutenção',
    custoHora: 39.60,
    eficiencia: 86.4,
    disponibilidade: 89.1,
    qrCode: 'QR007',
    // Legacy properties for compatibility
    model: 'Still RX70',
    type: TipoEmpilhadeira.ELETRICA,
    capacity: '2.000 kg',
    acquisitionDate: '25/04/2023',
    lastMaintenance: '10/12/2023',
    hourMeter: 1876,
  },
  {
    id: 'EMP008',
    modelo: 'Nissan PF02A25',
    marca: 'Nissan',
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2500,
    anoFabricacao: 2022,
    dataAquisicao: '30/01/2022',
    numeroSerie: 'NIS008',
    horimetro: 7629,
    ultimaManutencao: '02/11/2023',
    proximaManutencao: '02/02/2024',
    localizacaoAtual: 'Setor E',
    setor: 'Expedição',
    custoHora: 43.85,
    eficiencia: 90.1,
    disponibilidade: 94.7,
    qrCode: 'QR008',
    // Legacy properties for compatibility
    model: 'Nissan PF02A25',
    type: TipoEmpilhadeira.GAS,
    capacity: '2.500 kg',
    acquisitionDate: '30/01/2022',
    lastMaintenance: '02/11/2023',
    hourMeter: 7629,
  }
];

const ForkliftsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Zustand como FONTE DE DADOS para empilhadeiras
  const forklifts = useAppStore((state) => state.empilhadeiras);
  const addEmpilhadeira = useAppStore((state) => state.addEmpilhadeira);
  const updateEmpilhadeira = useAppStore((state) => state.updateEmpilhadeira);
  const deleteEmpilhadeira = useAppStore((state) => state.deleteEmpilhadeira);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusEmpilhadeira | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TipoEmpilhadeira | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Estado só de seleção, não de dados reais
  const [selectedForklift, setSelectedForklift] = useState<Forklift | null>(null);

  // Advanced filter options
  const filterOptions = [
    {
      key: 'capacidadeMin',
      label: 'Capacidade Mínima',
      type: 'number' as const,
    },
    {
      key: 'capacidadeMax',
      label: 'Capacidade Máxima',
      type: 'number' as const,
    },
    {
      key: 'anoFabricacao',
      label: 'Ano de Fabricação',
      type: 'select' as const,
      options: [
        { value: '2021', label: '2021' },
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
      ],
    },
    {
      key: 'setor',
      label: 'Setor',
      type: 'select' as const,
      options: [
        { value: 'Armazém', label: 'Armazém' },
        { value: 'Produção', label: 'Produção' },
        { value: 'Manutenção', label: 'Manutenção' },
      ],
    },
  ];

  // Filter forklifts based on all filters
  const filteredForklifts = forklifts.filter(forklift => {
    // Status filter
    if (statusFilter !== 'all' && forklift.status !== statusFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all' && forklift.tipo !== typeFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery && !forklift.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !forklift.modelo.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Advanced filters
    if (advancedFilters.capacidadeMin && forklift.capacidade < parseInt(advancedFilters.capacidadeMin)) {
      return false;
    }
    if (advancedFilters.capacidadeMax && forklift.capacidade > parseInt(advancedFilters.capacidadeMax)) {
      return false;
    }
    if (advancedFilters.anoFabricacao && forklift.anoFabricacao.toString() !== advancedFilters.anoFabricacao) {
      return false;
    }
    if (advancedFilters.setor && forklift.setor !== advancedFilters.setor) {
      return false;
    }
    
    return true;
  });

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    totalItems
  } = usePagination({
    data: filteredForklifts,
    itemsPerPage: viewMode === 'grid' ? 12 : 10
  });

  // Calculate summary statistics (já usando forklifts do Zustand)
  const stats = {
    total: forklifts.length,
    operational: forklifts.filter(f => f.status === StatusEmpilhadeira.OPERACIONAL).length,
    maintenance: forklifts.filter(f => f.status === StatusEmpilhadeira.EM_MANUTENCAO).length,
    stopped: forklifts.filter(f => f.status === StatusEmpilhadeira.PARADA).length,
  };

  // NOVO CRUD: todas ações refletem no Zustand 
  const handleSaveForklift = (forkliftData: Forklift) => {
    if (editDialogOpen && selectedForklift) {
      updateEmpilhadeira(forkliftData.id, forkliftData);
      toast({
        title: "Empilhadeira atualizada",
        description: "A empilhadeira foi atualizada com sucesso."
      });
    } else {
      addEmpilhadeira(forkliftData);
      toast({
        title: "Empilhadeira adicionada",
        description: "A empilhadeira foi adicionada com sucesso."
      });
    }
  };

  // Handle forklift click
  const handleForkliftClick = (id: string) => {
    const forklift = forklifts.find(f => f.id === id);
    if (forklift) {
      setSelectedForklift(forklift);
      setDetailsDialogOpen(true);
    }
  };

  // Handle edit from details view
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  // Handle delete forklift - open confirmation dialog
  const handleDeleteForklift = (id: string) => {
    const forklift = forklifts.find(f => f.id === id);
    if (forklift) {
      setSelectedForklift(forklift);
      setDeleteDialogOpen(true);
    }
  };

  // Confirm delete forklift
  const handleConfirmDelete = () => {
    if (selectedForklift) {
      deleteEmpilhadeira(selectedForklift.id);
      toast({
        title: "Empilhadeira excluída",
        description: `A empilhadeira ${selectedForklift.id} foi excluída com sucesso.`,
        variant: "destructive"
      });
      setSelectedForklift(null);
      setDeleteDialogOpen(false);
    }
  };

  // Handle export data
  const handleExportData = () => {
    toast({
      title: "Exportando dados",
      description: "Funcionalidade de exportação será implementada em breve."
    });
  };

  // Handle import data
  const handleImportData = () => {
    toast({
      title: "Importando dados",
      description: "Funcionalidade de importação será implementada em breve."
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header Padronizado */}
      <PageHeader 
        title="Gerenciamento de Empilhadeiras"
        subtitle="Gerencie sua frota de empilhadeiras de forma inteligente"
        description="Controle completo da sua frota com monitoramento em tempo real"
        icon={Truck}
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleImportData}>
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={() => {
            setSelectedForklift(null);
            setAddDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Empilhadeira
          </Button>
        </div>
      </PageHeader>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ForkliftStatsCard
          title="Total"
          value={stats.total}
          icon={Truck}
          info="Empilhadeiras"
          variant="default"
        />
        
        <ForkliftStatsCard
          title="Operacionais"
          value={stats.operational}
          icon={CheckCircle}
          info="Ativas"
          variant="success"
        />
        
        <ForkliftStatsCard
          title="Em Manutenção"
          value={stats.maintenance}
          icon={Wrench}
          info="Manutenção"
          variant="warning"
        />
        
        <ForkliftStatsCard
          title="Paradas"
          value={stats.stopped}
          icon={AlertTriangle}
          info="Inativas"
          variant="danger"
        />
      </div>
      
      {/* Compact Filters Section */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left side - Search and basic filters */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por ID ou modelo..."
                className="pl-9 h-9 w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-400 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/25"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Status filter */}
            <select 
              className="h-9 w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-1 text-sm text-slate-200 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/25"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusEmpilhadeira | 'all')}
            >
              <option value="all">Todos os Status</option>
              <option value={StatusEmpilhadeira.OPERACIONAL}>{StatusEmpilhadeira.OPERACIONAL}</option>
              <option value={StatusEmpilhadeira.EM_MANUTENCAO}>{StatusEmpilhadeira.EM_MANUTENCAO}</option>
              <option value={StatusEmpilhadeira.PARADA}>{StatusEmpilhadeira.PARADA}</option>
            </select>
            
            {/* Type filter */}
            <select 
              className="h-9 w-full rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-1 text-sm text-slate-200 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/25"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TipoEmpilhadeira | 'all')}
            >
              <option value="all">Todos os Tipos</option>
              <option value={TipoEmpilhadeira.GAS}>{TipoEmpilhadeira.GAS}</option>
              <option value={TipoEmpilhadeira.ELETRICA}>{TipoEmpilhadeira.ELETRICA}</option>
              <option value={TipoEmpilhadeira.RETRATIL}>{TipoEmpilhadeira.RETRATIL}</option>
            </select>
          </div>

          {/* Right side - Advanced filters and view mode */}
          <div className="flex items-center gap-2">
            {/* Advanced filters */}
            <AdvancedFilters
              filters={filterOptions}
              values={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              onClearFilters={() => setAdvancedFilters({})}
            />
            
            {/* View mode toggle */}
            <div className="flex items-center bg-slate-700/30 rounded-lg p-1 border border-slate-600/30">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7 px-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-7 px-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <Card className="bg-slate-800/20 border-slate-700/50 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-slate-200">
              Empilhadeiras ({filteredForklifts.length} de {forklifts.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-fade-in">
              {paginatedData.map((forklift, index) => (
                <div 
                  key={forklift.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ForkliftCard
                    forklift={forklift}
                    onClick={() => handleForkliftClick(forklift.id)}
                    onDelete={() => handleDeleteForklift(forklift.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
              <ForkliftList 
                forklifts={paginatedData}
                onForkliftClick={handleForkliftClick}
                onDeleteForklift={handleDeleteForklift}
              />
            </div>
          )}
          
          {filteredForklifts.length === 0 && (
            <div className="text-center py-16 text-slate-400 animate-fade-in">
              <div className="text-6xl mb-6 opacity-50">🔍</div>
              <h3 className="text-xl font-semibold mb-3 text-slate-300">Nenhuma empilhadeira encontrada</h3>
              <p className="text-slate-400">Tente ajustar os filtros ou adicionar uma nova empilhadeira.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Enhanced Pagination */}
      {filteredForklifts.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      )}
      
      {/* Add/Edit Forklift Dialog */}
      <ForkliftDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveForklift}
      />
      
      <ForkliftDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        forklift={selectedForklift || undefined}
        onSave={handleSaveForklift}
      />
      
      {/* Forklift Details Dialog */}
      <ForkliftDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        forklift={selectedForklift}
        onEdit={handleEditFromDetails}
      />
      
      {/* Delete Confirmation Dialog */}
      <ForkliftDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        forklift={selectedForklift}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ForkliftsPage;
