
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Operacao, StatusOperacao } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Gauge, Info, Map, Settings, Truck, User, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

// Use the same enriched type as in Operations page
type EnrichedOperacao = Operacao & {
  operadorNome: string;
  empilhadeiraModelo: string;
};

interface OperationDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation: EnrichedOperacao | null;
  onEdit: () => void;
}

const OperationDetails = ({ open, onOpenChange, operation, onEdit }: OperationDetailsProps) => {
  if (!operation) return null;

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
  const calculateDuration = () => {
    if (!operation.dataFim) {
      const startTime = new Date(operation.dataInicio);
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m (em andamento)`;
    } else {
      const startTime = new Date(operation.dataInicio);
      const endTime = new Date(operation.dataFim);
      const diff = endTime.getTime() - startTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">Operação #{operation.id}</span>
            <Badge 
              variant={operation.status === StatusOperacao.EM_ANDAMENTO ? 'default' : 'secondary'}
              className={operation.status === StatusOperacao.EM_ANDAMENTO ? 'bg-green-500 text-white' : ''}
            >
              {operation.status === StatusOperacao.EM_ANDAMENTO ? 'Em Andamento' : 'Concluída'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Iniciada em: {formatDate(operation.dataInicio)} às {formatTime(operation.dataInicio)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Informações Gerais</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Operador</span>
                </div>
                <span className="text-sm font-medium">{operation.operadorNome}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Empilhadeira</span>
                </div>
                <span className="text-sm font-medium">{operation.empilhadeiraModelo} ({operation.empilhadeiraId})</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Setor</span>
                </div>
                <span className="text-sm font-medium">{operation.setor}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Período e Duração</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Início</span>
                <span className="text-sm font-medium">{formatTime(operation.dataInicio)}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Término</span>
                <span className="text-sm font-medium">
                  {operation.dataFim ? formatTime(operation.dataFim) : 'Em andamento'}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Duração</span>
                <span className="text-sm font-medium">{calculateDuration()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Observações</span>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-md">
            <div className="text-sm">{operation.observacoes || 'Nenhuma observação registrada'}</div>
          </div>
          
          {operation.consumoGas && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Consumo de Combustível</span>
              </div>
              
              <div className="p-3 bg-muted/20 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Consumo Total</span>
                  <span className="text-sm font-medium">{operation.consumoGas} L</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            Editar Operação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDetails;
