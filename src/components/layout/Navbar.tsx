
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, User, Menu, X, BarChart3, Users, Activity, Wrench, Fuel, FileText, Gauge, Settings } from 'lucide-react';
import { MdForklift } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';
import { StatusOperacao, StatusManutencao } from "@/types";
import { useNavigate } from "react-router-dom";
import LogoOnly from "./LogoOnly";
import NavbarActions from "./NavbarActions";
import NavbarMenu from "./NavbarMenu";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const operacoes = useAppStore((state) => state.operacoes);
  const ordemServicos = useAppStore((state) => state.ordemServicos);

  const operacoesAtivas = operacoes.filter(op => op.status === StatusOperacao.EM_ANDAMENTO).length;
  const manutencoesPendentes = ordemServicos.filter(os => 
    [StatusManutencao.ABERTA, StatusManutencao.EM_ANDAMENTO].includes(os.status)
  ).length;

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
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: FileText,
      path: '/relatorios'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 h-14 sm:h-16 bg-card/95 dark:bg-card/95 backdrop-blur-md border-b border-slate-200 dark:border-border flex items-center justify-between px-3 sm:px-4 lg:px-6 shadow-premium dark:shadow-premium-dark">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <LogoOnly />
        </div>

        <NavbarMenu isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        <NavbarActions isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </header>
    </>
  );
};

export default Navbar;
