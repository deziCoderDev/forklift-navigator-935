
import React from "react";
import { Operacao, StatusOperacao, PrioridadeOperacao, TipoOperacao } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Calendar, Fuel, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EnrichedOperacao = Operacao & {
  operadorNome: string;
  empilhadeiraModelo: string;
};

type CompletedOperationsSectionProps = {
  operations: EnrichedOperacao[];
  onDetails: (operation: EnrichedOperacao) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  calculateDuration: (operation: Operacao) => string;
  getPriorityInfo: (prioridade: PrioridadeOperacao) => any;
  getOperationTypeInfo: (tipo: TipoOperacao) => any;
};

const CompletedOperationsSection: React.FC<CompletedOperationsSectionProps> = ({
  operations,
  onDetails,
  onDelete,
  formatDate,
  formatTime,
  calculateDuration,
  getPriorityInfo,
  getOperationTypeInfo,
}) => (
  <div className="space-y-4 lg:space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
        <span className="hidden sm:inline">Operações Concluídas</span>
        <span className="sm:hidden">Concluídas</span>
      </h2>
      <span className="text-xs lg:text-sm text-muted-foreground">
        {operations.length} concluída{operations.length !== 1 ? 's' : ''}
      </span>
    </div>

    <Card className="glass-card overflow-hidden">
      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-border/50">
          {operations.map((operation) => {
            const priorityInfo = getPriorityInfo(operation.prioridade);
            const typeInfo = getOperationTypeInfo(operation.tipo);

            return (
              <div key={operation.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div>
                      <span className="text-foreground font-medium text-sm">#{operation.id}</span>
                      <div className="text-xs text-muted-foreground">{operation.operadorNome}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => onDetails(operation)}>
                        Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(operation.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <div className={cn("font-medium", typeInfo.color)}>{typeInfo.label}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Empilhadeira:</span>
                    <div className="text-foreground font-medium truncate">{operation.empilhadeiraModelo}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Setor:</span>
                    <div className="text-foreground font-medium">{operation.setor}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duração:</span>
                    <div className="text-foreground font-medium">{calculateDuration(operation)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data:</span>
                    <div className="text-foreground font-medium">{formatDate(operation.dataInicio)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Consumo:</span>
                    <div className="text-foreground font-medium">{(operation.consumoGas || 0).toFixed(1)}L</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
                    priorityInfo.bgColor, priorityInfo.color, priorityInfo.borderColor
                  )}>
                    <priorityInfo.icon className="w-3 h-3 mr-1" />
                    {operation.prioridade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">ID</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Tipo</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Operador</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Empilhadeira</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Setor</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Data</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Duração</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Prioridade</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Consumo (L)</th>
              <th className="p-3 lg:p-4 text-left font-semibold text-foreground text-sm">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {operations.map((operation) => {
              const priorityInfo = getPriorityInfo(operation.prioridade);
              const typeInfo = getOperationTypeInfo(operation.tipo);

              return (
                <tr key={operation.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 lg:p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-foreground font-medium text-sm">{operation.id}</span>
                    </div>
                  </td>
                  <td className="p-3 lg:p-4">
                    <span className={cn("text-sm font-medium", typeInfo.color)}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="p-3 lg:p-4 text-foreground text-sm">{operation.operadorNome}</td>
                  <td className="p-3 lg:p-4">
                    <div className="text-foreground text-sm">{operation.empilhadeiraModelo}</div>
                    <div className="text-xs text-muted-foreground">{operation.empilhadeiraId}</div>
                  </td>
                  <td className="p-3 lg:p-4 text-foreground text-sm">{operation.setor}</td>
                  <td className="p-3 lg:p-4">
                    <div className="text-foreground text-sm">{formatDate(operation.dataInicio)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(operation.dataInicio)} - {operation.dataFim ? formatTime(operation.dataFim) : "N/A"}
                    </div>
                  </td>
                  <td className="p-3 lg:p-4 text-foreground text-sm">{calculateDuration(operation)}</td>
                  <td className="p-3 lg:p-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
                      priorityInfo.bgColor, priorityInfo.color, priorityInfo.borderColor
                    )}>
                      <priorityInfo.icon className="w-3 h-3 mr-1" />
                      {operation.prioridade}
                    </span>
                  </td>
                  <td className="p-3 lg:p-4">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-orange-400" />
                      <span className="text-foreground text-sm">{(operation.consumoGas || 0).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="p-3 lg:p-4">
                    <div className="flex gap-1 lg:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent/50 h-7 lg:h-8 px-2 lg:px-3 text-xs"
                        onClick={() => onDetails(operation)}
                      >
                        Detalhes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-7 lg:h-8 px-2 lg:px-3 text-xs"
                        onClick={() => onDelete(operation.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {operations.length === 0 && (
        <CardContent className="p-8 lg:p-12 text-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-full bg-accent/30 flex items-center justify-center">
            <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-base lg:text-lg">Nenhuma operação concluída</p>
        </CardContent>
      )}
    </Card>
  </div>
);

export default CompletedOperationsSection;
