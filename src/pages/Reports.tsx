
import React, { useState } from 'react';
import ModernKpiCard from '@/components/dashboard/ModernKpiCard';
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportsFilters from '@/components/reports/ReportsFilters';
import ReportCategorySection from '@/components/reports/ReportCategorySection';
import ReportsEmptyState from '@/components/reports/ReportsEmptyState';
import { FileBarChart, Download, Calendar as CalendarIcon, Clock, TrendingUp, Users, Wrench, Fuel, BarChart3, Sparkles, Activity, Zap, Target } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useReports } from '@/hooks/useReports';
import { StatusOperacao, StatusManutencao } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ReportsPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedForklift, setSelectedForklift] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get data from store
  const { empilhadeiras, operadores, operacoes, ordemServicos, abastecimentos } = useAppStore();
  const { resumoGeral } = useReports();

  // Calculate real-time stats
  const totalOperacoes = operacoes.length;
  const operacoesAtivas = operacoes.filter(op => op.status === StatusOperacao.EM_ANDAMENTO).length;
  const totalManutencoes = ordemServicos.length;
  const manutencoesAbertas = ordemServicos.filter(os => os.status !== StatusManutencao.CONCLUIDA).length;
  const totalAbastecimentos = abastecimentos.length;

  // Handle report generation
  const handleGenerateReport = (reportType: string, categoryId: string) => {
    toast({
      title: "Relatório gerado",
      description: `Relatório ${reportType} da categoria ${categoryId} foi gerado com sucesso.`
    });
    console.log(`Generating report: ${reportType} for category: ${categoryId}`);
  };

  const reportCategories = [
    {
      id: 'operacoes',
      title: 'Operações',
      icon: BarChart3,
      gradient: 'from-blue-500 via-blue-600 to-indigo-700',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      reports: [
        { 
          name: 'Utilização de Empilhadeiras', 
          description: `Análise de ${empilhadeiras.length} empilhadeiras com ${totalOperacoes} operações registradas`, 
          type: 'Operacional',
          icon: Activity,
          trend: operacoesAtivas > 0 ? `+${operacoesAtivas}` : '0',
          lastUpdate: '2 min',
          priority: 'high' as const,
          onGenerate: () => handleGenerateReport('Utilização de Empilhadeiras', 'operacoes')
        },
        { 
          name: 'Produtividade por Operador', 
          description: `Dashboard de ${operadores.length} operadores ativos no sistema`, 
          type: 'Performance',
          icon: Target,
          trend: `${operadores.length}`,
          lastUpdate: '5 min',
          priority: 'medium' as const,
          onGenerate: () => handleGenerateReport('Produtividade por Operador', 'operacoes')
        },
        { 
          name: 'Movimentações por Período', 
          description: `${totalOperacoes} operações com análise temporal avançada`, 
          type: 'Operacional',
          icon: TrendingUp,
          trend: `${totalOperacoes}`,
          lastUpdate: '1 min',
          priority: 'high' as const,
          onGenerate: () => handleGenerateReport('Movimentações por Período', 'operacoes')
        }
      ]
    },
    {
      id: 'manutencao',
      title: 'Manutenção',
      icon: Wrench,
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/50 dark:to-red-900/50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
      reports: [
        { 
          name: 'Histórico de Manutenções', 
          description: `${totalManutencoes} registros com análise de custos e padrões`, 
          type: 'Histórico',
          icon: Clock,
          trend: `${totalManutencoes}`,
          lastUpdate: '10 min',
          priority: 'medium' as const,
          onGenerate: () => handleGenerateReport('Histórico de Manutenções', 'manutencao')
        },
        { 
          name: 'Preventivas Programadas', 
          description: `${manutencoesAbertas} manutenções abertas com alertas ativos`, 
          type: 'Preventivo',
          icon: CalendarIcon,
          trend: manutencoesAbertas > 0 ? `${manutencoesAbertas}` : '0',
          lastUpdate: '3 min',
          priority: manutencoesAbertas > 0 ? 'high' as const : 'low' as const,
          onGenerate: () => handleGenerateReport('Preventivas Programadas', 'manutencao')
        },
        { 
          name: 'Análise de Custos', 
          description: 'Dashboard financeiro com projeções baseadas em dados reais', 
          type: 'Financeiro',
          icon: TrendingUp,
          trend: `R$ ${resumoGeral.totalCustoManutencao.toFixed(0)}`,
          lastUpdate: '15 min',
          priority: 'medium' as const,
          onGenerate: () => handleGenerateReport('Análise de Custos', 'manutencao')
        }
      ]
    },
    {
      id: 'abastecimento',
      title: 'Abastecimento',
      icon: Fuel,
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      reports: [
        { 
          name: 'Consumo Inteligente', 
          description: `Análise de ${totalAbastecimentos} abastecimentos com ${resumoGeral.totalConsumo.toFixed(1)}L consumidos`, 
          type: 'Consumo',
          icon: Zap,
          trend: `${resumoGeral.totalConsumo.toFixed(1)}L`,
          lastUpdate: '1 min',
          priority: 'high' as const,
          onGenerate: () => handleGenerateReport('Consumo Inteligente', 'abastecimento')
        },
        { 
          name: 'Eficiência Energética', 
          description: `Otimização baseada em ${resumoGeral.eficienciaGeral.toFixed(1)}% de eficiência média`, 
          type: 'Eficiência',
          icon: Activity,
          trend: `${resumoGeral.eficienciaGeral.toFixed(1)}%`,
          lastUpdate: '2 min',
          priority: 'high' as const,
          onGenerate: () => handleGenerateReport('Eficiência Energética', 'abastecimento')
        },
        { 
          name: 'Histórico Avançado', 
          description: `Machine learning aplicado em ${totalAbastecimentos} registros históricos`, 
          type: 'Histórico',
          icon: BarChart3,
          trend: `${totalAbastecimentos}`,
          lastUpdate: '8 min',
          priority: 'medium' as const,
          onGenerate: () => handleGenerateReport('Histórico Avançado', 'abastecimento')
        }
      ]
    },
    {
      id: 'operadores',
      title: 'Operadores',
      icon: Users,
      gradient: 'from-purple-500 via-violet-500 to-indigo-600',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-900/50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
      reports: [
        { 
          name: 'Certificações Smart', 
          description: `Monitoramento de ${operadores.length} operadores e suas certificações`, 
          type: 'Certificação',
          icon: Users,
          trend: `${operadores.length}`,
          lastUpdate: '30 min',
          priority: 'medium' as const,
          onGenerate: () => handleGenerateReport('Certificações Smart', 'operadores')
        },
        { 
          name: 'Performance Analytics', 
          description: `Dashboard de produtividade com ${resumoGeral.eficienciaGeral.toFixed(1)}% de eficiência`, 
          type: 'Operacional',
          icon: Target,
          trend: `${resumoGeral.eficienciaGeral.toFixed(1)}%`,
          lastUpdate: '5 min',
          priority: 'high' as const,
          onGenerate: () => handleGenerateReport('Performance Analytics', 'operadores')
        },
        { 
          name: 'Treinamentos 4.0', 
          description: `Plataforma digital conectada com ${operadores.length} perfis ativos`, 
          type: 'Treinamento',
          icon: Sparkles,
          trend: `${operadores.length}`,
          lastUpdate: '12 min',
          priority: 'high' as const,
          onGenerate: () => handleGenerateReport('Treinamentos 4.0', 'operadores')
        }
      ]
    }
  ];

  const quickStats = [
    { 
      title: 'Relatórios Disponíveis', 
      value: reportCategories.reduce((sum, cat) => sum + cat.reports.length, 0), 
      icon: FileBarChart,
      trend: 'up',
      trendValue: 12
    },
    { 
      title: 'Dados Atualizados', 
      value: totalOperacoes + totalManutencoes + totalAbastecimentos, 
      icon: Download,
      trend: 'up',
      trendValue: 5
    },
    { 
      title: 'Categorias Ativas', 
      value: reportCategories.length, 
      icon: CalendarIcon,
      trend: null,
      trendValue: 0
    },
    { 
      title: 'Última Atualização', 
      value: '2min', 
      icon: Clock,
      trend: null,
      trendValue: 0
    }
  ];

  const filteredCategories = reportCategories.filter(category => {
    if (selectedCategory && selectedCategory !== 'all' && category.id !== selectedCategory) return false;
    if (search) {
      return category.title.toLowerCase().includes(search.toLowerCase()) ||
             category.reports.some(report => 
               report.name.toLowerCase().includes(search.toLowerCase()) ||
               report.description.toLowerCase().includes(search.toLowerCase())
             );
    }
    return true;
  });

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedPeriod('');
    setSelectedForklift('');
    setSelectedOperator('');
  };

  return (
    <div className="space-y-8">
      <ReportsHeader />

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <ModernKpiCard
            key={index}
            title={stat.title}
            value={typeof stat.value === 'string' ? 0 : stat.value}
            icon={stat.icon}
            variant="info"
            className="hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>

      <ReportsFilters
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedForklift={selectedForklift}
        setSelectedForklift={setSelectedForklift}
      />

      {/* Ultra-Premium Report Categories */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <ReportCategorySection key={category.id} category={category} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <ReportsEmptyState onClearFilters={handleClearFilters} />
      )}
    </div>
  );
};

export default ReportsPage;
