import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, Activity, Wrench, Fuel, FileText, ChevronLeft, ChevronRight, Gauge } from 'lucide-react';
import { MdForklift } from 'react-icons/md';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import { StatusOperacao, StatusManutencao } from "@/types";

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  // Obter status global de operações e manutenções
  const operacoes = useAppStore((state) => state.operacoes);
  const ordemServicos = useAppStore((state) => state.ordemServicos);

  const operacoesAtivas = operacoes.filter(op => op.status === StatusOperacao.EM_ANDAMENTO).length;
  const manutencoesPendentes = ordemServicos.filter(os => 
    [StatusManutencao.ABERTA, StatusManutencao.EM_ANDAMENTO].includes(os.status)
  ).length;
  // const relatoriosCount = 0; // ex: relatorios.length
  // const abastecimentosCount = 0; // ex: abastecimentos.length

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/'
    },
    {
      id: 'empilhadeiras',
      label: 'Empilhadeiras',
      icon: MdForklift,
      path: '/empilhadeiras'
    },
    {
      id: 'operadores',
      label: 'Operadores',
      icon: Users,
      path: '/operadores'
    },
    {
      id: 'operacoes',
      label: 'Operações',
      icon: Activity,
      path: '/operacoes',
      badge: operacoesAtivas > 0 ? operacoesAtivas : undefined
    },
    {
      id: 'manutencao',
      label: 'Manutenção',
      icon: Wrench,
      path: '/manutencao',
      badge: manutencoesPendentes > 0 ? manutencoesPendentes : undefined
    },
    {
      id: 'abastecimento',
      label: 'Abastecimento',
      icon: Fuel,
      path: '/abastecimento'
      // , badge: abastecimentosCount > 0 ? abastecimentosCount : undefined
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: FileText,
      path: '/relatorios'
      // , badge: relatoriosCount > 0 ? relatoriosCount : undefined
    }
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full glass-sidebar z-50 flex flex-col transition-all duration-300",
      sidebarCollapsed ? "w-20" : "w-64"
    )}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/20 dark:border-slate-700/50 bg-gradient-primary">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 interactive-scale">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg tracking-tight animate-slide-in-right">FleetPro</h1>
              <p className="text-xs text-white/80 font-medium">Gestão de Frotas</p>
            </div>
          </div>
        )}
        
        {sidebarCollapsed && (
          <div className="flex items-center justify-center w-full">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 interactive-scale">
              <Gauge className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
        
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "p-2 rounded-xl glass-button text-white border-white/30 hover:border-white/50 interactive-scale focus-ring-premium",
            sidebarCollapsed && "absolute top-4 right-2"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto stagger-children">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center rounded-xl transition-all duration-300 group relative glass-card card-hover-effect focus-ring-premium",
              sidebarCollapsed ? "justify-center p-3 mx-auto w-12 h-12" : "space-x-3 px-4 py-3",
              isActive
                ? "bg-primary/15 dark:bg-primary/25 text-primary border-primary/40 shadow-premium"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 border-transparent"
            )}
            title={sidebarCollapsed ? item.label : undefined}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-center flex-shrink-0 relative">
              <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {sidebarCollapsed && typeof item.badge === "number" && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-error text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 font-semibold shadow-premium border-2 border-card animate-pulse-glow">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="font-semibold truncate flex-1 transition-all duration-200 group-hover:translate-x-1">{item.label}</span>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="bg-error text-white text-xs px-2.5 py-1 rounded-full flex-shrink-0 min-w-[24px] h-6 flex items-center justify-center font-semibold shadow-lg animate-pulse-glow">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
