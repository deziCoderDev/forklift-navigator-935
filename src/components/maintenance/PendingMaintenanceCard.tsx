
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Badge from "@/components/common/Badge";
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  DollarSign, 
  Edit, 
  MoreVertical, 
  Trash2, 
  User, 
  Wrench,
  Truck,
  Play,
  Pause,
  CheckCircle,
  ArrowRight,
  Timer
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { OrdemServico, StatusManutencao, PrioridadeOperacao, TipoManutencao } from '@/types';

interface PendingMaintenanceCardProps {
  maintenance: OrdemServico;
  onEdit: (maintenance: OrdemServico) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: StatusManutencao) => void;
}

const PendingMaintenanceCard: React.FC<PendingMaintenanceCardProps> = ({
  maintenance,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const formatDate = (dateString: string) => {
    try {
      const dateParts = dateString.split('-');
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    } catch (e) {
      return dateString;
    }
  };

  const getPriorityConfig = (priority: PrioridadeOperacao) => {
    switch (priority) {
      case PrioridadeOperacao.CRITICA:
        return { 
          color: 'bg-red-500', 
          textColor: 'text-red-700', 
          label: 'Alta',
          accentColor: 'border-l-red-500'
        };
      case PrioridadeOperacao.ALTA:
        return { 
          color: 'bg-orange-500', 
          textColor: 'text-orange-700', 
          label: 'Alta',
          accentColor: 'border-l-orange-500'
        };
      case PrioridadeOperacao.NORMAL:
        return { 
          color: 'bg-blue-500', 
          textColor: 'text-blue-700', 
          label: 'Normal',
          accentColor: 'border-l-blue-500'
        };
      default:
        return { 
          color: 'bg-gray-500', 
          textColor: 'text-gray-700', 
          label: 'Baixa',
          accentColor: 'border-l-gray-500'
        };
    }
  };

  const getStatusConfig = (status: StatusManutencao) => {
    switch (status) {
      case StatusManutencao.ABERTA:
        return { variant: 'warning' as const, label: 'Aberta', icon: Clock };
      case StatusManutencao.EM_ANDAMENTO:
        return { variant: 'info' as const, label: 'Em Andamento', icon: Timer };
      default:
        return { variant: 'default' as const, label: status, icon: Clock };
    }
  };

  const getMaintenanceTypeIcon = (type: TipoManutencao) => {
    switch (type) {
      case TipoManutencao.PREVENTIVA:
        return <Calendar className="w-3 h-3" />;
      case TipoManutencao.CORRETIVA:
        return <Wrench className="w-3 h-3" />;
      case TipoManutencao.PREDITIVA:
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Wrench className="w-3 h-3" />;
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(maintenance);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir esta manutenção?")) {
      onDelete(maintenance.id);
    }
  };

  const handleStatusChange = (e: React.MouseEvent, newStatus: StatusManutencao) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(maintenance.id, newStatus);
    }
  };

  const priorityConfig = getPriorityConfig(maintenance.prioridade);
  const statusConfig = getStatusConfig(maintenance.status);

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer",
      "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
      "border-l-4 shadow-lg hover:shadow-xl",
      priorityConfig.accentColor
    )}>
      {/* Critical priority indicator */}
      {maintenance.prioridade === PrioridadeOperacao.CRITICA && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
        </div>
      )}

      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                #{maintenance.id}
              </span>
              <Badge variant={statusConfig.variant} size="sm" className="gap-1 text-xs">
                <statusConfig.icon className="w-2.5 h-2.5" />
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              {getMaintenanceTypeIcon(maintenance.tipo)}
              <span className="text-xs font-medium capitalize">
                {maintenance.tipo ? maintenance.tipo.toLowerCase() : 'N/A'}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-slate-800 border-slate-700">
              <DropdownMenuItem onClick={handleEdit} className="text-gray-300 hover:text-white hover:bg-slate-700">
                <Edit className="w-3 h-3 mr-2" />
                Editar
              </DropdownMenuItem>
              {maintenance.status === StatusManutencao.ABERTA && onStatusChange && (
                <DropdownMenuItem 
                  onClick={(e) => handleStatusChange(e, StatusManutencao.EM_ANDAMENTO)} 
                  className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                >
                  <Play className="w-3 h-3 mr-2" />
                  Iniciar
                </DropdownMenuItem>
              )}
              {maintenance.status === StatusManutencao.EM_ANDAMENTO && onStatusChange && (
                <>
                  <DropdownMenuItem 
                    onClick={(e) => handleStatusChange(e, StatusManutencao.ABERTA)} 
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-slate-700"
                  >
                    <Pause className="w-3 h-3 mr-2" />
                    Pausar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => handleStatusChange(e, StatusManutencao.CONCLUIDA)} 
                    className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                  >
                    <CheckCircle className="w-3 h-3 mr-2" />
                    Concluir
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Priority Badge */}
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
          "bg-gradient-to-r from-white/10 to-white/5 border border-white/20 w-fit"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full", priorityConfig.color)} />
          <span className="text-white text-xs">Prioridade {priorityConfig.label}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 relative">
        {/* Problem Description */}
        <div className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-200 leading-relaxed">{maintenance.problema || 'Sem descrição'}</p>
          </div>
        </div>

        {/* Compact Details Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Truck className="w-3 h-3" />
              <span className="text-xs uppercase tracking-wide">Empilhadeira</span>
            </div>
            <p className="text-sm font-bold text-white">{maintenance.empilhadeiraId || maintenance.forkliftId || 'N/A'}</p>
          </div>
          
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <User className="w-3 h-3" />
              <span className="text-xs uppercase tracking-wide">Responsável</span>
            </div>
            <p className="text-sm font-bold text-white">{maintenance.reportedBy || 'Sistema'}</p>
          </div>
          
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs uppercase tracking-wide">Abertura</span>
            </div>
            <p className="text-sm font-bold text-white">
              {formatDate(maintenance.dataAbertura || maintenance.reportedDate || '')}
            </p>
          </div>
          
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs uppercase tracking-wide">Custo</span>
            </div>
            <p className="text-sm font-bold text-white">
              {maintenance.custos?.total ? 
                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(maintenance.custos.total) : 
                'R$ 0,00'
              }
            </p>
          </div>
        </div>

        {/* Progress Bar for In-Progress Items */}
        {maintenance.status === StatusManutencao.EM_ANDAMENTO && (
          <div className="space-y-2 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-300">Progresso estimado</span>
              <span className="text-xs font-bold text-blue-400">65%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: '65%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleEdit}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300 group text-sm"
        >
          <span>Ver Detalhes</span>
          <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default PendingMaintenanceCard;
