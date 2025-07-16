
import React from "react";
import { Operacao, StatusOperacao, PrioridadeOperacao, TipoOperacao } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity, Truck, MapPin, Clock, Fuel, CheckCircle2, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type EnrichedOperacao = Operacao & {
  operadorNome: string;
  empilhadeiraModelo: string;
};

type ActiveOperationsSectionProps = {
  operations: EnrichedOperacao[];
  onDetails: (operation: EnrichedOperacao) => void;
  onEdit: (operation: EnrichedOperacao) => void;
  calculateProgress: (operation: Operacao) => number;
  getPriorityInfo: (prioridade: PrioridadeOperacao) => any;
  getOperationTypeInfo: (tipo: TipoOperacao) => any;
  formatTime: (date: string) => string;
};

const ActiveOperationsSection: React.FC<ActiveOperationsSectionProps> = ({
  operations,
  onDetails,
  onEdit,
  calculateProgress,
  getPriorityInfo,
  getOperationTypeInfo,
  formatTime,
}) => (
  <div className="space-y-4 lg:space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl lg:text-2xl font-semibold text-foreground flex items-center gap-2">
        <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
        <span className="hidden sm:inline">Operações em Andamento</span>
        <span className="sm:hidden">Ativas</span>
      </h2>
      <span className="text-xs lg:text-sm text-muted-foreground">
        {operations.length} ativa{operations.length !== 1 ? 's' : ''}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-4">
      {operations.map((operation) => {
        const priorityInfo = getPriorityInfo(operation.prioridade);
        const typeInfo = getOperationTypeInfo(operation.tipo);
        const progress = calculateProgress(operation);

        return (
          <Card key={operation.id} className="glass-card-hover group relative overflow-hidden">
            <div className={cn("absolute top-0 left-0 w-1 h-full", priorityInfo.bgColor)} />

            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm lg:text-base truncate">{operation.operadorNome}</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground">#{operation.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 lg:gap-2 flex-shrink-0">
                  <span className="inline-flex items-center px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">
                    <span className="hidden sm:inline">Em Andamento</span>
                    <span className="sm:hidden">Ativa</span>
                  </span>
                  <span className={cn("inline-flex items-center px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium border", priorityInfo.bgColor, priorityInfo.color, priorityInfo.borderColor)}>
                    {operation.prioridade}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3 lg:space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={cn("text-xs lg:text-sm font-medium", typeInfo.color)}>
                    {typeInfo.label}
                  </span>
                  <span className="text-xs lg:text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-1.5 lg:h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 lg:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 lg:gap-3 text-xs lg:text-sm">
                <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md border border-border/30">
                  <Truck className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-foreground truncate">{operation.empilhadeiraModelo}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md border border-border/30">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-foreground truncate">{operation.setor}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md border border-border/30">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-cyan-500 flex-shrink-0" />
                  <span className="text-foreground">{formatTime(operation.dataInicio)}</span>
                </div>
                {operation.consumoGas && (
                  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md border border-border/30">
                    <Fuel className="w-3 h-3 lg:w-4 lg:h-4 text-red-500 flex-shrink-0" />
                    <span className="text-foreground">{operation.consumoGas}L</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2 lg:pt-3 border-t border-border/30">
                <Button variant="ghost" size="sm" className="h-7 lg:h-8 px-2 lg:px-3 text-xs hover:bg-accent/50" onClick={() => onDetails(operation)}>
                  Detalhes
                </Button>
                <Button variant="ghost" size="sm" className="h-7 lg:h-8 px-2 lg:px-3 text-xs text-primary hover:text-primary/80 hover:bg-primary/10" onClick={() => onEdit(operation)}>
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {operations.length === 0 && (
        <Card className="col-span-full glass-card">
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-full bg-accent/30 flex items-center justify-center">
              <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-base lg:text-lg">Nenhuma operação em andamento</p>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
);

export default ActiveOperationsSection;
