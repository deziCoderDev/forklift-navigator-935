
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { OrdemServico, StatusManutencao, TipoManutencao, PrioridadeOperacao } from '@/types';
import MaintenanceDialog from '@/components/maintenance/MaintenanceDialog';
import MaintenanceKpiCards from '@/components/maintenance/MaintenanceKpiCards';
import MaintenanceHistorySection from '@/components/maintenance/MaintenanceHistorySection';
import { useToast } from '@/hooks/use-toast';
import AdvancedFilters from '@/components/common/AdvancedFilters';
import { useFilters } from '@/hooks/use-filters';
import { useAppStore } from '@/stores/useAppStore';
import MaintenanceHeader from '@/components/maintenance/MaintenanceHeader';
import MaintenanceFilterBar from '@/components/maintenance/MaintenanceFilterBar';
import MaintenancePendingSection from '@/components/maintenance/MaintenancePendingSection';

const MaintenancePage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Zustand store usage
  const maintenanceItems = useAppStore((state) => state.ordemServicos);
  const operators = useAppStore((state) => state.operadores);
  const forklifts = useAppStore((state) => state.empilhadeiras);
  const addOrdemServico = useAppStore((state) => state.addOrdemServico);
  const updateOrdemServico = useAppStore((state) => state.updateOrdemServico);
  const deleteOrdemServico = useAppStore((state) => state.deleteOrdemServico);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<OrdemServico | null>(null);
  
  // Available options from store data
  const availableForklifts = forklifts.map(f => ({ id: f.id, model: f.modelo }));
  const availableOperators = operators.map(o => ({ id: o.id, name: o.nome }));
  
  // Filter configuration
  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: StatusManutencao.ABERTA, label: 'Aberta' },
        { value: StatusManutencao.EM_ANDAMENTO, label: 'Em Andamento' },
        { value: StatusManutencao.CONCLUIDA, label: 'Concluída' }
      ]
    },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select' as const,
      options: [
        { value: TipoManutencao.PREVENTIVA, label: 'Preventiva' },
        { value: TipoManutencao.CORRETIVA, label: 'Corretiva' },
        { value: TipoManutencao.PREDITIVA, label: 'Preditiva' }
      ]
    },
    {
      key: 'prioridade',
      label: 'Prioridade',
      type: 'select' as const,
      options: [
        { value: PrioridadeOperacao.BAIXA, label: 'Baixa' },
        { value: PrioridadeOperacao.NORMAL, label: 'Normal' },
        { value: PrioridadeOperacao.ALTA, label: 'Alta' },
        { value: PrioridadeOperacao.CRITICA, label: 'Crítica' }
      ]
    },
    {
      key: 'dataAbertura',
      label: 'Data de Abertura',
      type: 'date' as const
    }
  ];

  // Use the filters hook
  const {
    search,
    setSearch,
    filters,
    setFilters,
    filteredData,
    clearFilters
  } = useFilters({
    data: maintenanceItems,
    searchFields: ['problema', 'empilhadeiraId', 'reportedBy']
  });

  // Handle add/edit maintenance
  const handleSaveMaintenance = (maintenanceData: OrdemServico) => {
    if (editDialogOpen && selectedMaintenance) {
      updateOrdemServico(maintenanceData.id, maintenanceData);
      toast({
        title: "Manutenção atualizada",
        description: "Os dados da manutenção foram atualizados com sucesso."
      });
    } else {
      addOrdemServico(maintenanceData);
      toast({
        title: "Manutenção criada",
        description: "Nova ordem de serviço criada com sucesso."
      });
    }
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedMaintenance(null);
  };

  // Handle edit maintenance
  const handleEditMaintenance = (maintenance: OrdemServico) => {
    setSelectedMaintenance(maintenance);
    setEditDialogOpen(true);
  };

  // Handle delete maintenance
  const handleDeleteMaintenance = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro de manutenção?")) {
      deleteOrdemServico(id);
      toast({
        title: "Manutenção excluída",
        description: "O registro de manutenção foi excluído com sucesso."
      });
    }
  };

  // Handle status change
  const handleStatusChange = (id: string, newStatus: StatusManutencao) => {
    const item = maintenanceItems.find(m => m.id === id);
    if (!item) return;
    updateOrdemServico(id, { ...item, status: newStatus });
    toast({
      title: "Status atualizado",
      description: `Status da manutenção alterado para ${newStatus}.`
    });
  };

  // Handle export
  const handleExport = () => {
    toast({
      title: "Exportando dados",
      description: "O relatório será gerado em breve."
    });
  };

  // Handle report
  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "O relatório completo de manutenções foi gerado."
    });
  };

  // Get pending maintenance
  const pendingMaintenance = filteredData.filter(m => m.status !== StatusManutencao.CONCLUIDA);

  return (
    <div className="space-y-8">
      {/* Header */}
      <MaintenanceHeader
        onExport={handleExport}
        onOpenAdd={() => setAddDialogOpen(true)}
      />

      {/* KPI Cards */}
      <MaintenanceKpiCards maintenanceData={maintenanceItems} />

      {/* Filter Bar */}
      <MaintenanceFilterBar
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      {/* Pending Maintenance Section */}
      <MaintenancePendingSection
        pendingMaintenance={pendingMaintenance}
        onEdit={handleEditMaintenance}
        onDelete={handleDeleteMaintenance}
        onStatusChange={handleStatusChange}
      />

      {/* Maintenance History Section */}
      <MaintenanceHistorySection
        data={maintenanceItems}
        onEdit={handleEditMaintenance}
        onDelete={handleDeleteMaintenance}
        onReport={handleGenerateReport}
      />
      
      {/* Add/Edit Maintenance Dialog */}
      <MaintenanceDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveMaintenance}
        availableForklifts={availableForklifts}
        availableOperators={availableOperators}
      />
      <MaintenanceDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        maintenance={selectedMaintenance || undefined}
        onSave={handleSaveMaintenance}
        availableForklifts={availableForklifts}
        availableOperators={availableOperators}
      />
    </div>
  );
};

export default MaintenancePage;
