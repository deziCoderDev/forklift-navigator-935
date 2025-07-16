
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Wrench, 
  Fuel, 
  UserPlus, 
  FileText, 
  Activity,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

const QuickActionsIntegrated: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    empilhadeiras, 
    operadores, 
    addNotificacao,
    recalculateMetrics 
  } = useAppStore();
  
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleQuickAction = async (action: string, route: string) => {
    setIsLoading(action);
    
    // Simula um loading para feedback visual
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Adiciona notificação do sistema
    addNotificacao({
      id: `quick-${Date.now()}`,
      tipo: 'Info',
      titulo: 'Ação Rápida',
      mensagem: `Redirecionando para ${action}...`,
      dataCreacao: new Date().toISOString(),
      lida: false
    });

    navigate(route);
    setIsLoading(null);
  };

  const handleEmergencyAction = () => {
    toast({
      title: "Emergência Ativada",
      description: "Todas as operações foram pausadas. Administradores notificados.",
      variant: "destructive"
    });
    
    addNotificacao({
      id: `emergency-${Date.now()}`,
      tipo: 'Erro',
      titulo: 'Emergência Ativada',
      mensagem: 'Sistema em modo de emergência - Operações pausadas',
      dataCreacao: new Date().toISOString(),
      lida: false
    });
  };

  const quickActions = [
    {
      id: 'nova-operacao',
      icon: Plus,
      title: 'Nova Operação',
      description: 'Iniciar nova operação',
      route: '/operacoes',
      color: 'bg-blue-500 hover:bg-blue-600',
      available: empilhadeiras.filter(e => e.status === 'Operacional').length > 0 && 
                 operadores.filter(o => o.status === 'Ativo').length > 0
    },
    {
      id: 'manutencao',
      icon: Wrench,
      title: 'Abrir OS',
      description: 'Ordem de serviço',
      route: '/manutencao',
      color: 'bg-purple-500 hover:bg-purple-600',
      available: true
    },
    {
      id: 'abastecimento',
      icon: Fuel,
      title: 'Abastecimento',
      description: 'Registrar combustível',
      route: '/abastecimento',
      color: 'bg-green-500 hover:bg-green-600',
      available: empilhadeiras.filter(e => e.tipo === 'Gás').length > 0
    },
    {
      id: 'operador',
      icon: UserPlus,
      title: 'Novo Operador',
      description: 'Cadastrar operador',
      route: '/operadores',
      color: 'bg-orange-500 hover:bg-orange-600',
      available: true
    },
    {
      id: 'relatorio',
      icon: FileText,
      title: 'Relatórios',
      description: 'Gerar relatório',
      route: '/relatorios',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      available: true
    },
    {
      id: 'empilhadeira',
      icon: Activity,
      title: 'Nova Empilhadeira',
      description: 'Cadastrar equipamento',
      route: '/empilhadeiras',
      color: 'bg-cyan-500 hover:bg-cyan-600',
      available: true
    }
  ];

  return (
    <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900 dark:text-white">
          <Zap className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleQuickAction(action.title, action.route)}
              disabled={!action.available || isLoading === action.id}
              className={`
                ${action.color} text-white border-0 h-auto p-4 flex flex-col items-center gap-2
                ${!action.available ? 'opacity-50 cursor-not-allowed' : ''}
                ${isLoading === action.id ? 'animate-pulse' : ''}
              `}
              variant="default"
            >
              <action.icon className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
        
        {/* Botão de Emergência */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={handleEmergencyAction}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            🚨 PARADA DE EMERGÊNCIA
          </Button>
        </div>

        {/* Status de Disponibilidade */}
        <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Empilhadeiras disponíveis:</span>
            <span className="font-medium">
              {empilhadeiras.filter(e => e.status === 'Operacional').length}/{empilhadeiras.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Operadores ativos:</span>
            <span className="font-medium">
              {operadores.filter(o => o.status === 'Ativo').length}/{operadores.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsIntegrated;
