
import React from "react";
import { Operacao, StatusOperacao } from "@/types";
import ModernKpiCard from "@/components/dashboard/ModernKpiCard";
import { Activity, Play, CheckCircle2, Fuel } from "lucide-react";

interface OperationsKpiCardsProps {
  data: Operacao[];
}

const OperationsKpiCards: React.FC<OperationsKpiCardsProps> = ({ data }) => {
  const stats = {
    total: data.length,
    active: data.filter((op) => op.status === StatusOperacao.EM_ANDAMENTO).length,
    completed: data.filter((op) => op.status === StatusOperacao.CONCLUIDA).length,
    totalGasConsumption: data
      .filter((op) => op.consumoGas)
      .reduce((sum, op) => sum + (op.consumoGas || 0), 0),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ModernKpiCard
        title="Total de Operações"
        value={stats.total}
        icon={Activity}
        variant="default"
      />
      <ModernKpiCard
        title="Em Andamento"
        value={stats.active}
        icon={Play}
        variant="success"
      />
      <ModernKpiCard
        title="Concluídas"
        value={stats.completed}
        icon={CheckCircle2}
        variant="info"
      />
      <ModernKpiCard
        title="Consumo Total (L)"
        value={stats.totalGasConsumption}
        icon={Fuel}
        variant="warning"
      />
    </div>
  );
};

export default OperationsKpiCards;
