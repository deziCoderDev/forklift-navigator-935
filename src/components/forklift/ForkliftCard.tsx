
import React from 'react';
import { cn } from '@/lib/utils';
import { Forklift, StatusEmpilhadeira } from '@/types';
import { Calendar, MapPin, Clock, Trash2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ForkliftCardProps {
  forklift: Forklift;
  onClick: () => void;
  onDelete?: () => void;
}

const ForkliftCard: React.FC<ForkliftCardProps> = ({ forklift, onClick, onDelete }) => {
  const getStatusConfig = (status: StatusEmpilhadeira) => {
    switch (status) {
      case StatusEmpilhadeira.OPERACIONAL:
        return {
          icon: CheckCircle,
          text: 'Operacional',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-700 dark:text-green-400',
          iconColor: 'text-green-600'
        };
      case StatusEmpilhadeira.EM_MANUTENCAO:
        return {
          icon: AlertTriangle,
          text: 'Manutenção',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          textColor: 'text-orange-700 dark:text-orange-400',
          iconColor: 'text-orange-600'
        };
      case StatusEmpilhadeira.PARADA:
        return {
          icon: XCircle,
          text: 'Parada',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-700 dark:text-red-400',
          iconColor: 'text-red-600'
        };
      default:
        return {
          icon: XCircle,
          text: status,
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
          textColor: 'text-gray-700 dark:text-gray-400',
          iconColor: 'text-gray-600'
        };
    }
  };

  const getTypeConfig = (tipo: string) => {
    const configs = {
      'Gás': { bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-700 dark:text-blue-400' },
      'Elétrica': { bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-700 dark:text-green-400' },
      'Retrátil': { bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-700 dark:text-purple-400' }
    };
    
    return configs[tipo as keyof typeof configs] || { 
      bgColor: 'bg-gray-100 dark:bg-gray-900/30', 
      textColor: 'text-gray-700 dark:text-gray-400' 
    };
  };

  const statusConfig = getStatusConfig(forklift.status);
  const typeConfig = getTypeConfig(forklift.tipo);
  const StatusIcon = statusConfig.icon;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg relative"
      onClick={onClick}
    >
      {/* Delete button */}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-red-500 z-10"
          title="Excluir empilhadeira"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between pr-8">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
              {forklift.id}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {forklift.modelo}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Type badges */}
        <div className="flex flex-wrap gap-2">
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            statusConfig.bgColor,
            statusConfig.textColor
          )}>
            <StatusIcon className={cn("w-3 h-3", statusConfig.iconColor)} />
            {statusConfig.text}
          </span>
          
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            typeConfig.bgColor,
            typeConfig.textColor
          )}>
            {forklift.tipo}
          </span>
        </div>

        {/* Capacity */}
        <div className="text-center py-4 bg-muted/30 rounded-lg">
          <div className="text-sm text-muted-foreground font-medium mb-1">
            CAPACIDADE
          </div>
          <div className="text-2xl font-bold text-foreground">
            {forklift.capacidade.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">kg</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Horímetro</span>
            </div>
            <span className="font-mono font-medium text-foreground">
              {forklift.horimetro?.toString().padStart(5, '0') || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Últ. Manutenção</span>
            </div>
            <span className="text-foreground">
              {forklift.ultimaManutencao || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Localização</span>
            </div>
            <span className="text-foreground truncate max-w-[120px]">
              {forklift.localizacaoAtual || forklift.setor || 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForkliftCard;
