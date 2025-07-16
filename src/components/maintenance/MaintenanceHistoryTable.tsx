
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Badge from "@/components/common/Badge";
import PaginationControls from "@/components/common/PaginationControls";
import StandardFilters, { FilterOption } from "@/components/common/StandardFilters";
import { usePagination } from "@/hooks/usePagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowUpDown, 
  Calendar, 
  DollarSign, 
  Edit, 
  Eye, 
  FileText, 
  MoreVertical, 
  Trash2, 
  User,
  Wrench,
  SortAsc,
  SortDesc,
  Clock,
  CheckCircle,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrdemServico, StatusManutencao, TipoManutencao, PrioridadeOperacao } from '@/types';

interface MaintenanceHistoryTableProps {
  data: OrdemServico[];
  onEdit: (maintenance: OrdemServico) => void;
  onDelete: (id: string) => void;
  onView?: (maintenance: OrdemServico) => void;
}

type SortField = 'id' | 'dataAbertura' | 'dataConclusao' | 'custos.total' | 'prioridade';
type SortDirection = 'asc' | 'desc';

const MaintenanceHistoryTable: React.FC<MaintenanceHistoryTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView
}) => {
  const [sortField, setSortField] = useState<SortField>('dataAbertura');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const filters: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'aberta', label: 'Aberta' },
        { value: 'andamento', label: 'Em Andamento' },
        { value: 'concluida', label: 'Concluída' }
      ]
    },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'preventiva', label: 'Preventiva' },
        { value: 'corretiva', label: 'Corretiva' },
        { value: 'preditiva', label: 'Preditiva' }
      ]
    },
    {
      key: 'prioridade',
      label: 'Prioridade',
      type: 'select',
      options: [
        { value: 'critica', label: 'Crítica' },
        { value: 'alta', label: 'Alta' },
        { value: 'normal', label: 'Normal' },
        { value: 'baixa', label: 'Baixa' }
      ]
    }
  ];

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = data.filter(item => {
      const searchMatch = searchTerm === '' || 
        (item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.empilhadeira?.modelo || item.forkliftModel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.problema || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.reportedBy || '').toLowerCase().includes(searchTerm.toLowerCase());

      const filterMatch = Object.entries(filterValues).every(([key, value]) => {
        if (!value) return true;
        
        switch (key) {
          case 'status':
            return (item.status || '').toLowerCase().includes(value.toLowerCase());
          case 'tipo':
            return (item.tipo || '').toLowerCase().includes(value.toLowerCase());
          case 'prioridade':
            return (item.prioridade || '').toLowerCase().includes(value.toLowerCase());
          default:
            return true;
        }
      });

      return searchMatch && filterMatch;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'custos.total':
          aValue = a.custos?.total || 0;
          bValue = b.custos?.total || 0;
          break;
        case 'dataAbertura':
          aValue = new Date(a.dataAbertura || a.reportedDate || '');
          bValue = new Date(b.dataAbertura || b.reportedDate || '');
          break;
        case 'dataConclusao':
          aValue = new Date(a.dataConclusao || '');
          bValue = new Date(b.dataConclusao || '');
          break;
        case 'prioridade':
          const priorityOrder: Record<string, number> = {};
          priorityOrder[PrioridadeOperacao.CRITICA] = 4;
          priorityOrder[PrioridadeOperacao.ALTA] = 3;
          priorityOrder[PrioridadeOperacao.NORMAL] = 2;
          priorityOrder[PrioridadeOperacao.BAIXA] = 1;
          aValue = priorityOrder[a.prioridade] || 0;
          bValue = priorityOrder[b.prioridade] || 0;
          break;
        default:
          aValue = (a as any)[sortField] || '';
          bValue = (b as any)[sortField] || '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, filterValues, sortField, sortDirection]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    canGoPrevious,
    canGoNext,
    goToPage,
    startIndex,
    endIndex
  } = usePagination({
    data: filteredAndSortedData,
    itemsPerPage: 10
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterValues({});
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const dateParts = dateString.split('-');
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } catch (e) {
      return dateString;
    }
  };

  const getStatusVariant = (status: StatusManutencao) => {
    switch (status) {
      case StatusManutencao.ABERTA:
        return 'warning';
      case StatusManutencao.EM_ANDAMENTO:
        return 'info';
      case StatusManutencao.CONCLUIDA:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: StatusManutencao) => {
    switch (status) {
      case StatusManutencao.ABERTA:
        return <Clock className="w-3 h-3" />;
      case StatusManutencao.EM_ANDAMENTO:
        return <Play className="w-3 h-3" />;
      case StatusManutencao.CONCLUIDA:
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityVariant = (priority: PrioridadeOperacao) => {
    switch (priority) {
      case PrioridadeOperacao.CRITICA:
        return 'danger';
      case PrioridadeOperacao.ALTA:
        return 'warning';
      case PrioridadeOperacao.NORMAL:
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: TipoManutencao) => {
    switch (type) {
      case TipoManutencao.PREVENTIVA:
        return <Calendar className="w-4 h-4" />;
      case TipoManutencao.CORRETIVA:
        return <Wrench className="w-4 h-4" />;
      case TipoManutencao.PREDITIVA:
        return <Eye className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    return sortDirection === 'asc' ? 
      <SortAsc className="ml-1 h-3 w-3 text-blue-500" /> : 
      <SortDesc className="ml-1 h-3 w-3 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Standardized Filters */}
      <StandardFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por ID, modelo, problema ou responsável..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Enhanced Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-lg border border-slate-200/60 dark:border-slate-700/60">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100/50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('id')}
                  className="h-auto p-0 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  ID
                  {getSortIcon('id')}
                </Button>
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Empilhadeira</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Tipo</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Problema</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Status</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('prioridade')}
                  className="h-auto p-0 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Prioridade
                  {getSortIcon('prioridade')}
                </Button>
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">Responsável</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('dataAbertura')}
                  className="h-auto p-0 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Abertura
                  {getSortIcon('dataAbertura')}
                </Button>
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('dataConclusao')}
                  className="h-auto p-0 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Conclusão
                  {getSortIcon('dataConclusao')}
                </Button>
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('custos.total')}
                  className="h-auto p-0 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Custo
                  {getSortIcon('custos.total')}
                </Button>
              </TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300 font-semibold w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((maintenance, index) => (
              <TableRow 
                key={maintenance.id} 
                className={cn(
                  "transition-all duration-200 border-slate-200/60 dark:border-slate-700/60",
                  index % 2 === 0 ? "bg-white/50 dark:bg-slate-800/30" : "bg-slate-50/50 dark:bg-slate-800/50",
                  "hover:bg-slate-100/50 dark:hover:bg-slate-700/50 hover:scale-[1.01] hover:shadow-sm"
                )}
              >
                <TableCell className="font-bold text-blue-600 dark:text-blue-400">#{maintenance.id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{maintenance.empilhadeira?.modelo || maintenance.forkliftModel || 'N/A'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{maintenance.empilhadeiraId || maintenance.forkliftId || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {getTypeIcon(maintenance.tipo)}
                    <span className="capitalize font-medium">{maintenance.tipo ? maintenance.tipo.toLowerCase() : 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="truncate text-slate-900 dark:text-slate-100 font-medium" title={maintenance.problema || 'Sem descrição'}>
                      {maintenance.problema || 'Sem descrição'}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(maintenance.status) as any} size="sm" className="gap-1">
                    {getStatusIcon(maintenance.status)}
                    {maintenance.status || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(maintenance.prioridade) as any} size="sm">
                    {maintenance.prioridade || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{maintenance.reportedBy || 'Sistema'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{formatDate(maintenance.dataAbertura || maintenance.reportedDate || '')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{formatDate(maintenance.dataConclusao || '')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {maintenance.custos?.total ? 
                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(maintenance.custos.total) : 
                        'R$ 0,00'
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(maintenance)} className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(maintenance)} className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
                        <FileText className="w-4 h-4 mr-2" />
                        Relatório
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(maintenance.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {paginatedData.length === 0 && (
          <div className="p-12 text-center bg-slate-50/50 dark:bg-slate-800/50">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center">
              <Wrench className="w-8 h-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Nenhuma manutenção encontrada</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || Object.values(filterValues).some(f => f) 
                ? "Tente ajustar os filtros de busca" 
                : "Não há registros de manutenção no histórico"
              }
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="glass-card rounded-lg p-4 border border-slate-200/60 dark:border-slate-700/60">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={filteredAndSortedData.length}
          />
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistoryTable;
