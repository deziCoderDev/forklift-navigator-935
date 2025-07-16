
import React from "react";
import { CheckCircle, AlertTriangle, Users, Activity } from "lucide-react";
import { MetricasDashboard } from "@/types";
import PremiumMetricCard from "@/components/common/PremiumMetricCard";

const initialStats: MetricasDashboard = {
  frotaTotal: 15,
  empilhadeirasOperacionais: 9,
  empilhadeirasParadas: 3,
  empilhadeirasManutencao: 3,
  operadoresAtivos: 20,
  operacoesAtivas: 7,
  operacoesConcluidas: 147,
  eficienciaGeral: 87.5,
  disponibilidadeGeral: 92.3,
  consumoGasTotal: 2450.8,
  custoOperacionalDia: 15420.50,
  produtividadeMedia: 94.2,
  tempoMedioOperacao: 45,
  alertasCriticos: 3
};

interface DashboardOverviewProps {
  stats?: MetricasDashboard;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats = initialStats,
}) => {
  return (
    <section className="w-full mx-auto px-2 md:px-0 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <PremiumMetricCard
          title="Total Frota"
          value={stats.frotaTotal}
          icon={Activity}
          variant="primary"
          subtitle="Empilhadeiras registradas"
          trend={{ value: 8, isPositive: true }}
        />
        <PremiumMetricCard
          title="Operacionais"
          value={stats.empilhadeirasOperacionais}
          icon={CheckCircle}
          variant="success"
          subtitle="Equipamentos ativos"
          trend={{ value: 15, isPositive: true }}
        />
        <PremiumMetricCard
          title="Manutenção"
          value={stats.empilhadeirasManutencao}
          icon={AlertTriangle}
          variant="warning"
          subtitle="Necessitam atenção"
        />
        <PremiumMetricCard
          title="Operadores"
          value={stats.operadoresAtivos}
          icon={Users}
          variant="info"
          subtitle="Equipe ativa"
          trend={{ value: 12, isPositive: true }}
        />
      </div>
    </section>
  );
};

export default DashboardOverview;
