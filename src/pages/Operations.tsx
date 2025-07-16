import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Operacao, StatusOperacao, TipoOperacao, PrioridadeOperacao, StatusOperador } from '@/types';
import { useToast } from '@/hooks/use-toast';
import OperationDialog from '@/components/operations/OperationDialog';
import OperationDetails from '@/components/operations/OperationDetails';
import AdvancedFilters from '@/components/common/AdvancedFilters';
import { useFilters } from '@/hooks/use-filters';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from "@/components/ui/button";
import OperationsHeader from "@/components/operations/OperationsHeader";
import OperationsKpiCards from "@/components/operations/OperationsKpiCards";
import OperationsFilterBar from "@/components/operations/OperationsFilterBar";
import ActiveOperationsSection from "@/components/operations/ActiveOperationsSection";
import CompletedOperationsSection from "@/components/operations/CompletedOperationsSection";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Mock data for available operators and forklifts
const availableOperators = [
  { id: 'OP001', name: 'Carlos Silva' },
  { id: 'OP002', name: 'Maria Oliveira' },
  { id: 'OP003', name: 'João Pereira' },
  { id: 'OP004', name: 'Ana Costa' },
  { id: 'OP005', name: 'Pedro Santos' }
];

const availableForklifts = [
  { id: 'G001', model: 'Toyota 8FGU25' },
  { id: 'G004', model: 'Yale GLP050' },
  { id: 'E002', model: 'Hyster E50XN' },
  { id: 'G006', model: 'Caterpillar DP40' }
];

// Tipo estendido simplificado para operações enriquecidas
type EnrichedOperacao = Operacao & {
  operadorNome: string;
  empilhadeiraModelo: string;
};

const OperationsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Zustand store usage
  const operations = useAppStore((state) => state.operacoes);
  const operators = useAppStore((state) => state.operadores);
  const forklifts = useAppStore((state) => state.empilhadeiras);

  const addOperacao = useAppStore((state) => state.addOperacao);
  const updateOperacao = useAppStore((state) => state.updateOperacao);
  const deleteOperacao = useAppStore((state) => state.deleteOperacao);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<EnrichedOperacao | null>(null);

  // Use filters hook with corrected search fields
  const {
    search,
    setSearch,
    filters,
    setFilters,
    filteredData: filteredOperations,
    clearFilters
  } = useFilters({
    data: operations,
    searchFields: ['id', 'setor']
  });

  // Função simplificada para enriquecer dados da operação
  const joinOperationData = (operation: Operacao): EnrichedOperacao => {
    // Buscar operador
    const operador = operators.find((op) => op.id === operation.operadorId) ||
      availableOperators.find((op) => op.id === operation.operadorId);
    
    let operadorNome = "Operador Não Encontrado";
    if (operador) {
      // Handle both 'nome' and 'name' properties
      if ('nome' in operador) {
        operadorNome = operador.nome;
      } else if ('name' in operador) {
        operadorNome = operador.name;
      }
    }

    // Buscar empilhadeira
    const empilhadeira = forklifts.find((fork) => fork.id === operation.empilhadeiraId) ||
      availableForklifts.find((fork) => fork.id === operation.empilhadeiraId);
    
    let empilhadeiraModelo = "Empilhadeira Não Encontrada";
    if (empilhadeira) {
      // Handle both 'modelo' and 'model' properties
      if ('modelo' in empilhadeira) {
        empilhadeiraModelo = empilhadeira.modelo;
      } else if ('model' in empilhadeira) {
        empilhadeiraModelo = empilhadeira.model;
      }
    }

    return {
      ...operation,
      operadorNome,
      empilhadeiraModelo,
    };
  };

  // FILTRANDO E ENRIQUECENDO OPERAÇÕES
  const enrichedActiveOperations = filteredOperations
    .filter(op => op.status === StatusOperacao.EM_ANDAMENTO)
    .map(joinOperationData);

  const enrichedCompletedOperations = filteredOperations
    .filter(op => op.status === StatusOperacao.CONCLUIDA)
    .map(joinOperationData);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate operation duration
  const calculateDuration = (operation: Operacao) => {
    const startTime = new Date(operation.dataInicio);
    const endTime = operation.dataFim ? new Date(operation.dataFim) : new Date();
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m${!operation.dataFim ? ' (em andamento)' : ''}`;
  };

  // Save operation (uses Zustand)
  const handleSaveOperation = (operationData: Operacao) => {
    if (operations.some(op => op.id === operationData.id)) {
      updateOperacao(operationData.id, operationData);
      toast({
        title: "Operação atualizada",
        description: "A operação foi atualizada com sucesso."
      });
    } else {
      addOperacao(operationData);
      toast({
        title: "Operação criada",
        description: "A operação foi criada com sucesso."
      });
    }
  };

  // Open details dialog
  const handleViewDetails = (operation: EnrichedOperacao) => {
    setSelectedOperation(operation);
    setDetailsDialogOpen(true);
  };

  // Open edit dialog from details
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  // Open edit dialog directly
  const handleEdit = (operation: EnrichedOperacao) => {
    setSelectedOperation(operation);
    setEditDialogOpen(true);
  };

  // Delete operation (Zustand)
  const handleDeleteOperation = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta operação?")) {
      deleteOperacao(id);
      toast({
        title: "Operação excluída",
        description: "A operação foi excluída com sucesso."
      });
    }
  };

  // Get priority color and icon
  const getPriorityInfo = (prioridade: PrioridadeOperacao) => {
    switch (prioridade) {
      case PrioridadeOperacao.ALTA:
        return { color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30', icon: AlertCircle };
      case PrioridadeOperacao.NORMAL:
        return { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30', icon: CheckCircle2 };
      case PrioridadeOperacao.BAIXA:
        return { color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30', icon: CheckCircle2 };
      default:
        return { color: 'text-gray-400', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30', icon: CheckCircle2 };
    }
  };

  // Get operation type info
  const getOperationTypeInfo = (tipo: TipoOperacao) => {
    switch (tipo) {
      case TipoOperacao.MOVIMENTACAO:
        return { label: 'Movimentação', color: 'text-blue-400' };
      case TipoOperacao.CARGA:
        return { label: 'Carga', color: 'text-green-400' };
      case TipoOperacao.DESCARGA:
        return { label: 'Descarga', color: 'text-orange-400' };
      case TipoOperacao.ESTOQUE:
        return { label: 'Estoque', color: 'text-cyan-400' };
      case TipoOperacao.PICKING:
        return { label: 'Picking', color: 'text-yellow-400' };
      default:
        return { label: 'Outro', color: 'text-gray-400' };
    }
  };

  // Calculate progress percentage for active operations
  const calculateProgress = (operation: Operacao) => {
    if (operation.status !== StatusOperacao.EM_ANDAMENTO) return 100;
    const startTime = new Date(operation.dataInicio);
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const estimatedDuration = (operation.duracaoEstimada || 480) * 60 * 1000;
    return Math.min((elapsed / estimatedDuration) * 100, 95);
  };

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter configuration for advanced filters
  const filterOptions = [
    {
      key: 'prioridade',
      label: 'Prioridade',
      type: 'select' as const,
      options: [
        { value: PrioridadeOperacao.ALTA, label: 'Alta' },
        { value: PrioridadeOperacao.NORMAL, label: 'Normal' },
        { value: PrioridadeOperacao.BAIXA, label: 'Baixa' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <OperationsHeader onAdd={() => {
        setSelectedOperation(null);
        setAddDialogOpen(true);
      }} />

      {/* KPI Cards */}
      <OperationsKpiCards data={operations} />

      {/* Filter Bar */}
      <OperationsFilterBar
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        filterOptions={filterOptions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Active Operations Section */}
      <ActiveOperationsSection
        operations={enrichedActiveOperations}
        onDetails={handleViewDetails}
        onEdit={handleEdit}
        calculateProgress={calculateProgress}
        getPriorityInfo={getPriorityInfo}
        getOperationTypeInfo={getOperationTypeInfo}
        formatTime={formatTime}
      />

      {/* Completed Operations Section */}
      <CompletedOperationsSection
        operations={enrichedCompletedOperations}
        onDetails={handleViewDetails}
        onDelete={handleDeleteOperation}
        formatDate={formatDate}
        formatTime={formatTime}
        calculateDuration={calculateDuration}
        getPriorityInfo={getPriorityInfo}
        getOperationTypeInfo={getOperationTypeInfo}
      />

      {/* Add Operation Dialog */}
      <OperationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveOperation}
        availableOperators={availableOperators}
        availableForklifts={availableForklifts}
      />

      {/* Edit Operation Dialog */}
      <OperationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        operation={selectedOperation || undefined}
        onSave={handleSaveOperation}
        availableOperators={availableOperators}
        availableForklifts={availableForklifts}
      />

      {/* Operation Details Dialog */}
      <OperationDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        operation={selectedOperation}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default OperationsPage;
