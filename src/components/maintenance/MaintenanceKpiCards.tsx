import React from 'react';
import { 
  Wrench, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle
} from 'lucide-react';
import StandardCard from '@/components/common/StandardCard';
import { OrdemServico, StatusManutencao, PrioridadeOperacao } from '@/types';

interface MaintenanceKpiCardsProps {
  maintenanceData: OrdemServico[];
}

const MaintenanceKpiCards: React.FC<MaintenanceKpiCardsProps> = ({ maintenanceData }) => {
  // Calculate metrics
  const totalMaintenance = maintenanceData.length;
  const pendingMaintenance = maintenanceData.filter(m => m.status !== StatusManutencao.CONCLUIDA).length;
  const completedMaintenance = maintenanceData.filter(m => m.status === StatusManutencao.CONCLUIDA).length;
  
  const totalCosts = maintenanceData.reduce((sum, m) => sum + (m.custos?.total || 0), 0);
  
  const urgentMaintenance = maintenanceData.filter(m => 
    m.prioridade === PrioridadeOperacao.CRITICA || m.prioridade === PrioridadeOperacao.ALTA
  ).length;

  const kpis = [
    {
      title: 'Total de Manutenções',
      value: totalMaintenance,
      icon: Wrench,
      variant: 'info' as const
    },
    {
      title: 'Pendentes',
      value: pendingMaintenance,
      icon: Clock,
      variant: 'warning' as const
    },
    {
      title: 'Concluídas',
      value: completedMaintenance,
      icon: CheckCircle,
      variant: 'success' as const
    },
    {
      title: 'Custo Total',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCosts),
      icon: DollarSign,
      variant: 'danger' as const
    },
    {
      title: 'Urgentes',
      value: urgentMaintenance,
      icon: AlertTriangle,
      variant: 'danger' as const
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {kpis.map((kpi) => (
        <StandardCard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          variant={kpi.variant}
        />
      ))}
    </div>
  );
};

export default MaintenanceKpiCards;
