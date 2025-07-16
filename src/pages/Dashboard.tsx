
import React from 'react';
import MetricsGrid from '@/components/dashboard/MetricsGrid';
import PageHeader from '@/components/layout/PageHeader';
import { useAppStore } from '@/stores/useAppStore';
import { useReports } from '@/hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, TrendingUp, Users, Wrench, Gauge, ArrowRight, Activity, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    alertas, 
    operacoes, 
    ordemServicos, 
    empilhadeiras, 
    operadores,
    lastUpdate
  } = useAppStore();
  
  const { resumoGeral } = useReports();

  // Operações mais recentes
  const operacoesRecentes = operacoes
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
    .slice(0, 3);

  // Alertas mais críticos
  const alertasCriticos = alertas.slice(0, 3);

  // Manutenções urgentes
  const manutencoesUrgentes = ordemServicos
    .filter(os => os.status !== 'Concluída')
    .sort((a, b) => {
      const prioridadeOrder = { 'Crítica': 0, 'Alta': 1, 'Normal': 2, 'Baixa': 3 };
      return prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder] - 
             prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder];
    })
    .slice(0, 3);

  // Empilhadeiras que precisam de atenção
  const empilhadeirasAtencao = empilhadeiras
    .filter(emp => (emp.eficiencia || 0) < 85 || (emp.disponibilidade || 0) < 90)
    .slice(0, 3);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Em Andamento':
      case 'Operacional':
        return 'default';
      case 'Concluída':
        return 'secondary';
      case 'Pendente':
      case 'Em Manutenção':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Padronizado */}
      <PageHeader 
        title="Dashboard de Controle"
        subtitle="Visão geral da operação em tempo real"
        description={`Monitore ${empilhadeiras.length} empilhadeiras e ${operadores.length} operadores ativos`}
        icon={Monitor}
      >
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
            💾 Dados Locais
          </Badge>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 mr-1" />
            Sync: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </PageHeader>

      {/* Metrics Grid */}
      <MetricsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operações Recentes */}
        <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-slate-900 dark:text-white">
              <Activity className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Operações Ativas
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/operacoes')}
              className="text-blue-600 hover:text-blue-700"
            >
              Ver todas <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {operacoesRecentes.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p>Nenhuma operação cadastrada</p>
                  <p className="text-xs mt-1">Adicione operações para começar</p>
                </div>
              ) : (
                operacoesRecentes.map((operacao) => (
                  <div key={operacao.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                       onClick={() => navigate('/operacoes')}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white">#{operacao.id}</p>
                        <Badge variant={getStatusBadgeVariant(operacao.status)}>
                          {operacao.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {operacao.empilhadeiraId} • {operacao.operador?.nome || 'Operador não informado'} • {operacao.setor}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {operacao.tipo} • {formatDate(operacao.dataInicio)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas Críticos */}
        <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-slate-900 dark:text-white">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
              Alertas do Sistema
            </CardTitle>
            <Badge variant="destructive" className="bg-red-500 text-white">
              {alertas.length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasCriticos.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p>Nenhum alerta crítico</p>
                  <p className="text-xs mt-1">Sistema funcionando normalmente</p>
                </div>
              ) : (
                alertasCriticos.map((alerta) => (
                  <div key={alerta.id} className="flex items-start justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-red-900 dark:text-red-400">{alerta.titulo}</p>
                        <Badge variant="destructive">
                          {alerta.nivel}
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-500 mt-1">{alerta.descricao}</p>
                      {alerta.responsavel && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Responsável: {alerta.responsavel}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manutenções Urgentes */}
        <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-slate-900 dark:text-white">
              <Wrench className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Manutenções Urgentes
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/manutencao')}
              className="text-purple-600 hover:text-purple-700"
            >
              Ver todas <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {manutencoesUrgentes.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p>Nenhuma manutenção urgente</p>
                  <p className="text-xs mt-1">Adicione ordens de serviço</p>
                </div>
              ) : (
                manutencoesUrgentes.map((ordem) => (
                  <div key={ordem.id} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
                       onClick={() => navigate('/manutencao')}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-purple-900 dark:text-purple-300">#{ordem.id}</p>
                        <Badge variant="outline" className="border-purple-300 text-purple-700">
                          {ordem.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                        {ordem.empilhadeiraId} • {ordem.problema}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                        {ordem.tipo} • Aberto em {new Date(ordem.dataAbertura).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-400" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empilhadeiras Atenção */}
        <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-slate-900 dark:text-white">
              <Gauge className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
              Equipamentos - Atenção
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/empilhadeiras')}
              className="text-amber-600 hover:text-amber-700"
            >
              Ver todas <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {empilhadeirasAtencao.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Gauge className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p>Nenhuma empilhadeira cadastrada</p>
                  <p className="text-xs mt-1">Adicione empilhadeiras para monitorar</p>
                </div>
              ) : (
                empilhadeirasAtencao.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
                       onClick={() => navigate('/empilhadeiras')}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-amber-900 dark:text-amber-300">{emp.id}</p>
                        <Badge variant="outline" className="border-amber-300 text-amber-700">
                          {emp.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        {emp.modelo} • {emp.setor}
                      </p>
                      <div className="flex gap-4 text-xs text-amber-600 dark:text-amber-500 mt-1">
                        <span>Eficiência: {emp.eficiencia || 0}%</span>
                        <span>Disponibilidade: {emp.disponibilidade || 0}%</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
