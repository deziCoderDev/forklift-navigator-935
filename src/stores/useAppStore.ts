import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  MetricasDashboard, 
  Empilhadeira, 
  Operador, 
  Operacao, 
  OrdemServico, 
  Abastecimento,
  AlertaCritico,
  Notificacao,
  StatusEmpilhadeira,
  TipoEmpilhadeira,
  StatusOperador,
  StatusOperacao,
  TipoOperacao,
  OrdemServico as OrdemServicoType, // caso precise
  StatusManutencao,
  TipoManutencao,
  PrioridadeOperacao,
  FuncaoOperador,
} from '@/types';

import {
  empilhadeiras as mockEmpilhadeiras,
  operadores as mockOperadores,
  operacoes as mockOperacoes,
  ordemServicos as mockOrdemServicos,
  abastecimentos as mockAbastecimentos
} from "./mockData";

interface AppState {
  // Dashboard
  metricas: MetricasDashboard;
  alertas: AlertaCritico[];
  
  // Entidades principais
  empilhadeiras: Empilhadeira[];
  operadores: Operador[];
  operacoes: Operacao[];
  ordemServicos: OrdemServico[];
  abastecimentos: Abastecimento[];
  
  // UI State
  sidebarCollapsed: boolean;
  notificacoes: Notificacao[];
  loading: boolean;
  
  // Sync state
  lastUpdate: string;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotificacao: (notificacao: Notificacao) => void;
  markNotificacaoAsRead: (id: string) => void;
  updateMetricas: (metricas: Partial<MetricasDashboard>) => void;
  setLoading: (loading: boolean) => void;
  
  // Empilhadeiras Actions
  addEmpilhadeira: (empilhadeira: Empilhadeira) => void;
  updateEmpilhadeira: (id: string, empilhadeira: Partial<Empilhadeira>) => void;
  deleteEmpilhadeira: (id: string) => void;
  
  // Operadores Actions
  addOperador: (operador: Operador) => void;
  updateOperador: (id: string, operador: Partial<Operador>) => void;
  deleteOperador: (id: string) => void;
  
  // Operações Actions
  addOperacao: (operacao: Operacao) => void;
  updateOperacao: (id: string, operacao: Partial<Operacao>) => void;
  deleteOperacao: (id: string) => void;
  finalizarOperacao: (id: string) => void;
  
  // Manutenção Actions
  addOrdemServico: (ordem: OrdemServico) => void;
  updateOrdemServico: (id: string, ordem: Partial<OrdemServico>) => void;
  deleteOrdemServico: (id: string) => void;
  
  // Abastecimento Actions
  addAbastecimento: (abastecimento: Abastecimento) => void;
  updateAbastecimento: (id: string, abastecimento: Partial<Abastecimento>) => void;
  deleteAbastecimento: (id: string) => void;
  
  // Utility Actions
  recalculateMetrics: () => void;
  generateAlerts: () => void;
  triggerUpdate: () => void;
  addMockData: () => void;
}

// Métricas iniciais vazias
const initialMetricas: MetricasDashboard = {
  frotaTotal: 0,
  empilhadeirasOperacionais: 0,
  empilhadeirasManutencao: 0,
  empilhadeirasParadas: 0,
  operadoresAtivos: 0,
  operacoesAtivas: 0,
  operacoesConcluidas: 0,
  eficienciaGeral: 0,
  disponibilidadeGeral: 0,
  consumoGasTotal: 0,
  custoOperacionalDia: 0,
  produtividadeMedia: 0,
  tempoMedioOperacao: 0,
  alertasCriticos: 0
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial vazio - sem dados genéricos
        metricas: initialMetricas,
        alertas: [],
        empilhadeiras: [],
        operadores: [],
        operacoes: [],
        ordemServicos: [],
        abastecimentos: [],
        sidebarCollapsed: false,
        notificacoes: [],
        loading: false,
        lastUpdate: new Date().toISOString(),
        
        // Trigger update function for real-time sync
        triggerUpdate: () => 
          set({ lastUpdate: new Date().toISOString() }, false, 'triggerUpdate'),
        
        // UI Actions
        setSidebarCollapsed: (collapsed) => {
          set({ sidebarCollapsed: collapsed }, false, 'setSidebarCollapsed');
          get().triggerUpdate();
        },
          
        addNotificacao: (notificacao) => {
          set(
            (state) => ({ 
              notificacoes: [notificacao, ...state.notificacoes].slice(0, 50) 
            }),
            false,
            'addNotificacao'
          );
          get().triggerUpdate();
        },
          
        markNotificacaoAsRead: (id) => {
          set(
            (state) => ({
              notificacoes: state.notificacoes.map(n => 
                n.id === id ? { ...n, lida: true } : n
              )
            }),
            false,
            'markNotificacaoAsRead'
          );
          get().triggerUpdate();
        },
          
        updateMetricas: (metricas) => {
          set(
            (state) => ({ 
              metricas: { ...state.metricas, ...metricas } 
            }),
            false,
            'updateMetricas'
          );
          get().triggerUpdate();
        },
          
        setLoading: (loading) => {
          set({ loading }, false, 'setLoading');
          get().triggerUpdate();
        },

        // Empilhadeiras Actions
        addEmpilhadeira: (empilhadeira) => {
          set(
            (state) => ({
              empilhadeiras: [...state.empilhadeiras, empilhadeira]
            }),
            false,
            'addEmpilhadeira'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        updateEmpilhadeira: (id, empilhadeiraData) => {
          set(
            (state) => ({
              empilhadeiras: state.empilhadeiras.map(emp => 
                emp.id === id ? { ...emp, ...empilhadeiraData } : emp
              )
            }),
            false,
            'updateEmpilhadeira'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        deleteEmpilhadeira: (id) => {
          set(
            (state) => ({
              empilhadeiras: state.empilhadeiras.filter(emp => emp.id !== id),
              operacoes: state.operacoes.filter(op => op.empilhadeiraId !== id),
              ordemServicos: state.ordemServicos.filter(os => os.empilhadeiraId !== id),
              abastecimentos: state.abastecimentos.filter(ab => ab.empilhadeiraId !== id)
            }),
            false,
            'deleteEmpilhadeira'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        // Operadores Actions
        addOperador: (operador) => {
          set(
            (state) => ({
              operadores: [...state.operadores, operador]
            }),
            false,
            'addOperador'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        updateOperador: (id, operadorData) => {
          set(
            (state) => ({
              operadores: state.operadores.map(op => 
                op.id === id ? { ...op, ...operadorData } : op
              )
            }),
            false,
            'updateOperador'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        deleteOperador: (id) => {
          set(
            (state) => ({
              operadores: state.operadores.filter(op => op.id !== id),
              operacoes: state.operacoes.filter(operacao => operacao.operadorId !== id)
            }),
            false,
            'deleteOperador'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        // Operações Actions
        addOperacao: (operacao) => {
          set(
            (state) => {
              let empilhadeirasAtualizadas = state.empilhadeiras;
              if (operacao.status === StatusOperacao.EM_ANDAMENTO) {
                empilhadeirasAtualizadas = state.empilhadeiras.map(emp =>
                  emp.id === operacao.empilhadeiraId 
                    ? { ...emp, operadorAtual: operacao.operadorId }
                    : emp
                );
              }
              
              return {
                operacoes: [...state.operacoes, operacao],
                empilhadeiras: empilhadeirasAtualizadas
              };
            },
            false,
            'addOperacao'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        updateOperacao: (id, operacaoData) => {
          set(
            (state) => ({
              operacoes: state.operacoes.map(op => 
                op.id === id ? { ...op, ...operacaoData } : op
              )
            }),
            false,
            'updateOperacao'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        deleteOperacao: (id) => {
          set(
            (state) => ({
              operacoes: state.operacoes.filter(op => op.id !== id)
            }),
            false,
            'deleteOperacao'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        finalizarOperacao: (id) => {
          set(
            (state) => {
              const operacao = state.operacoes.find(op => op.id === id);
              if (!operacao) return state;

              const operacaoAtualizada = {
                ...operacao,
                status: StatusOperacao.CONCLUIDA,
                dataFim: new Date().toISOString(),
                duracaoReal: Math.floor((new Date().getTime() - new Date(operacao.dataInicio).getTime()) / (1000 * 60))
              };

              const empilhadeirasAtualizadas = state.empilhadeiras.map(emp =>
                emp.id === operacao.empilhadeiraId 
                  ? { ...emp, operadorAtual: undefined }
                  : emp
              );

              return {
                operacoes: state.operacoes.map(op => 
                  op.id === id ? operacaoAtualizada : op
                ),
                empilhadeiras: empilhadeirasAtualizadas
              };
            },
            false,
            'finalizarOperacao'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        // Manutenção Actions
        addOrdemServico: (ordem) => {
          set(
            (state) => {
              let empilhadeirasAtualizadas = state.empilhadeiras;
              if (ordem.status === StatusManutencao.EM_ANDAMENTO) {
                empilhadeirasAtualizadas = state.empilhadeiras.map(emp =>
                  emp.id === ordem.empilhadeiraId 
                    ? { ...emp, status: StatusEmpilhadeira.EM_MANUTENCAO }
                    : emp
                );
              }
              
              return {
                ordemServicos: [...state.ordemServicos, ordem],
                empilhadeiras: empilhadeirasAtualizadas
              };
            },
            false,
            'addOrdemServico'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        updateOrdemServico: (id, ordemData) => {
          set(
            (state) => {
              const ordem = state.ordemServicos.find(os => os.id === id);
              if (!ordem) return state;

              const ordemAtualizada = { ...ordem, ...ordemData };
              
              let empilhadeirasAtualizadas = state.empilhadeiras;
              if (ordemData.status === StatusManutencao.CONCLUIDA) {
                empilhadeirasAtualizadas = state.empilhadeiras.map(emp =>
                  emp.id === ordem.empilhadeiraId 
                    ? { ...emp, status: StatusEmpilhadeira.OPERACIONAL }
                    : emp
                );
              }

              return {
                ordemServicos: state.ordemServicos.map(os => 
                  os.id === id ? ordemAtualizada : os
                ),
                empilhadeiras: empilhadeirasAtualizadas
              };
            },
            false,
            'updateOrdemServico'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        deleteOrdemServico: (id) => {
          set(
            (state) => ({
              ordemServicos: state.ordemServicos.filter(os => os.id !== id)
            }),
            false,
            'deleteOrdemServico'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        // Abastecimento Actions
        addAbastecimento: (abastecimento) => {
          set(
            (state) => ({
              abastecimentos: [...state.abastecimentos, abastecimento]
            }),
            false,
            'addAbastecimento'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        updateAbastecimento: (id, abastecimentoData) => {
          set(
            (state) => ({
              abastecimentos: state.abastecimentos.map(ab => 
                ab.id === id ? { ...ab, ...abastecimentoData } : ab
              )
            }),
            false,
            'updateAbastecimento'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        deleteAbastecimento: (id) => {
          set(
            (state) => ({
              abastecimentos: state.abastecimentos.filter(ab => ab.id !== id)
            }),
            false,
            'deleteAbastecimento'
          );
          get().recalculateMetrics();
          get().triggerUpdate();
        },

        // Utility Actions
        recalculateMetrics: () =>
          set(
            (state) => {
              const { empilhadeiras, operacoes, ordemServicos, abastecimentos } = state;
              
              const frotaTotal = empilhadeiras.length;
              const empilhadeirasOperacionais = empilhadeiras.filter(e => e.status === StatusEmpilhadeira.OPERACIONAL).length;
              const empilhadeirasManutencao = empilhadeiras.filter(e => e.status === StatusEmpilhadeira.EM_MANUTENCAO).length;
              const empilhadeirasParadas = empilhadeiras.filter(e => e.status === StatusEmpilhadeira.PARADA).length;
              
              const operacoesAtivas = operacoes.filter(o => o.status === StatusOperacao.EM_ANDAMENTO).length;
              const operacoesConcluidas = operacoes.filter(o => o.status === StatusOperacao.CONCLUIDA).length;
              
              const consumoGasTotal = abastecimentos.reduce((sum, ab) => sum + ab.quantidadeLitros, 0);
              const custoOperacionalDia = abastecimentos.reduce((sum, ab) => sum + ab.custoTotal, 0) + 
                                          ordemServicos.reduce((sum, os) => sum + (os.custos?.total || 0), 0);
              
              const eficienciaGeral = frotaTotal > 0 ? empilhadeiras.reduce((sum, e) => sum + (e.eficiencia || 0), 0) / frotaTotal : 0;
              const disponibilidadeGeral = frotaTotal > 0 ? empilhadeiras.reduce((sum, e) => sum + (e.disponibilidade || 0), 0) / frotaTotal : 0;
              
              const produtividadeMedia = operacoes.length > 0 ? operacoes.reduce((sum, o) => sum + (o.produtividade || 0), 0) / operacoes.length : 0;
              const tempoMedioOperacao = operacoesConcluidas > 0 ? operacoes
                .filter(o => o.duracaoReal)
                .reduce((sum, o) => sum + (o.duracaoReal || 0), 0) / operacoesConcluidas : 0;

              const alertasCriticos = ordemServicos.filter(os => 
                os.prioridade === PrioridadeOperacao.CRITICA && 
                os.status !== StatusManutencao.CONCLUIDA
              ).length;

              return {
                metricas: {
                  frotaTotal,
                  empilhadeirasOperacionais,
                  empilhadeirasManutencao,
                  empilhadeirasParadas,
                  operadoresAtivos: state.operadores.filter(o => o.status === StatusOperador.ATIVO).length,
                  operacoesAtivas,
                  operacoesConcluidas,
                  eficienciaGeral,
                  disponibilidadeGeral,
                  consumoGasTotal,
                  custoOperacionalDia,
                  produtividadeMedia,
                  tempoMedioOperacao,
                  alertasCriticos
                }
              };
            },
            false,
            'recalculateMetrics'
          ),

        generateAlerts: () =>
          set(
            (state) => {
              const alertas: AlertaCritico[] = [];
              
              // Alertas de manutenção
              state.ordemServicos
                .filter(os => os.prioridade === PrioridadeOperacao.CRITICA && os.status !== StatusManutencao.CONCLUIDA)
                .forEach(os => {
                  alertas.push({
                    id: `alert-${os.id}`,
                    tipo: 'Manutenção',
                    nivel: 'Crítico',
                    titulo: `Manutenção Crítica - ${os.empilhadeiraId}`,
                    descricao: os.problema,
                    dataOcorrencia: os.dataAbertura,
                    responsavel: os.tecnico?.nome,
                    status: 'Pendente'
                  });
                });

              // Alertas de eficiência
              state.empilhadeiras
                .filter(e => (e.eficiencia || 0) < 80)
                .forEach(e => {
                  alertas.push({
                    id: `alert-eff-${e.id}`,
                    tipo: 'Operação',
                    nivel: 'Médio',
                    titulo: `Baixa Eficiência - ${e.id}`,
                    descricao: `Eficiência de ${e.eficiencia}% abaixo do esperado`,
                    dataOcorrencia: new Date().toISOString().split('T')[0],
                    status: 'Pendente'
                  });
                });

              return { alertas };
            },
            false,
            'generateAlerts'
          ),
        // ---------- MOCK DATA PARA DEMONSTRAÇÃO ----------
        addMockData: () => {
          set(
            {
              empilhadeiras: mockEmpilhadeiras,
              operadores: mockOperadores,
              operacoes: mockOperacoes,
              ordemServicos: mockOrdemServicos,
              abastecimentos: mockAbastecimentos,
            },
            false,
            "addMockData"
          );
          get().recalculateMetrics();
          get().generateAlerts();
          get().triggerUpdate();
        },
      }),
      {
        name: 'fleet-management-storage',
        // Persiste TUDO no localStorage
        partialize: (state) => ({
          empilhadeiras: state.empilhadeiras,
          operadores: state.operadores,
          operacoes: state.operacoes,
          ordemServicos: state.ordemServicos,
          abastecimentos: state.abastecimentos,
          metricas: state.metricas,
          alertas: state.alertas,
          notificacoes: state.notificacoes,
          sidebarCollapsed: state.sidebarCollapsed,
          lastUpdate: state.lastUpdate
        }),
      }
    ),
    { name: 'FleetManagementStore' }
  )
);
