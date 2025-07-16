
import React from 'react';
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Gauge,
  Users,
  Zap
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import PremiumMetricCard from '@/components/common/PremiumMetricCard';

const MetricsGrid: React.FC = () => {
  const { metricas } = useAppStore();

  const metrics = [
    {
      title: 'Frota Total',
      value: metricas.frotaTotal,
      icon: Activity,
      variant: 'primary' as const,
      subtitle: 'Empilhadeiras cadastradas'
    },
    {
      title: 'Operacionais',
      value: metricas.empilhadeirasOperacionais,
      icon: CheckCircle,
      variant: 'success' as const,
      trend: { value: 12, isPositive: true },
      subtitle: 'Equipamentos ativos'
    },
    {
      title: 'Em Manutenção',
      value: metricas.empilhadeirasManutencao,
      icon: AlertTriangle,
      variant: 'warning' as const,
      subtitle: 'Necessitam atenção'
    },
    {
      title: 'Operadores Ativos',
      value: metricas.operadoresAtivos,
      icon: Users,
      variant: 'info' as const,
      trend: { value: 8, isPositive: true },
      subtitle: 'Equipe operacional'
    },
    {
      title: 'Eficiência Geral',
      value: `${metricas.eficienciaGeral}%`,
      icon: Zap,
      variant: 'primary' as const,
      trend: { value: 5, isPositive: true },
      subtitle: 'Performance média'
    },
    {
      title: 'Custo Operacional',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metricas.custoOperacionalDia),
      icon: DollarSign,
      variant: 'danger' as const,
      subtitle: 'Gasto diário médio'
    },
    {
      title: 'Tempo Médio/Operação',
      value: `${metricas.tempoMedioOperacao}min`,
      icon: Clock,
      variant: 'warning' as const,
      subtitle: 'Duração média'
    },
    {
      title: 'Operações Ativas',
      value: metricas.operacoesAtivas,
      icon: Gauge,
      variant: 'success' as const,
      subtitle: 'Em execução agora'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={metric.title} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in-scale">
          <PremiumMetricCard
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            variant={metric.variant}
            trend={metric.trend}
            subtitle={metric.subtitle}
          />
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
