
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Users, Wrench, Fuel, Activity, TrendingUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Empilhadeira, StatusEmpilhadeira, TipoEmpilhadeira } from '@/types';

// Mock data for dashboard overview - fixed to match interface
const mockForklifts: Empilhadeira[] = [
  {
    id: 'G001',
    modelo: 'Toyota 8FGU25',
    marca: 'Toyota',
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2500,
    anoFabricacao: 2022,
    dataAquisicao: '10/05/2022',
    numeroSerie: 'TOY001',
    horimetro: 12583,
    ultimaManutencao: '15/09/2023',
    proximaManutencao: '15/12/2023',
    localizacaoAtual: 'Setor A',
    setor: 'Armazém',
    custoHora: 45.50,
    eficiencia: 87.5,
    disponibilidade: 92.3,
    qrCode: 'QR001',
    // Legacy properties for compatibility
    model: 'Toyota 8FGU25',
    capacity: '2.500 kg',
    acquisitionDate: '10/05/2022',
    lastMaintenance: '15/09/2023',
    hourMeter: 12583
  },
  {
    id: 'E002',
    modelo: 'Hyster E50XN',
    marca: 'Hyster',
    tipo: TipoEmpilhadeira.ELETRICA,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2250,
    anoFabricacao: 2021,
    dataAquisicao: '22/11/2021',
    numeroSerie: 'HYS002',
    horimetro: 8452,
    ultimaManutencao: '30/10/2023',
    proximaManutencao: '30/01/2024',
    localizacaoAtual: 'Setor B',
    setor: 'Produção',
    custoHora: 38.75,
    eficiencia: 89.2,
    disponibilidade: 94.1,
    qrCode: 'QR002',
    // Legacy properties for compatibility
    model: 'Hyster E50XN',
    capacity: '2.250 kg',
    acquisitionDate: '22/11/2021',
    lastMaintenance: '30/10/2023',
    hourMeter: 8452
  },
  {
    id: 'R003',
    modelo: 'Crown RR5725',
    marca: 'Crown',
    tipo: TipoEmpilhadeira.RETRATIL,
    status: StatusEmpilhadeira.EM_MANUTENCAO,
    capacidade: 1800,
    anoFabricacao: 2022,
    dataAquisicao: '04/03/2022',
    numeroSerie: 'CRW003',
    horimetro: 10974,
    ultimaManutencao: '12/08/2023',
    proximaManutencao: '12/11/2023',
    localizacaoAtual: 'Oficina',
    setor: 'Manutenção',
    custoHora: 42.30,
    eficiencia: 85.1,
    disponibilidade: 88.7,
    qrCode: 'QR003',
    // Legacy properties for compatibility
    model: 'Crown RR5725',
    capacity: '1.800 kg',
    acquisitionDate: '04/03/2022',
    lastMaintenance: '12/08/2023',
    hourMeter: 10974
  },
  {
    id: 'G004',
    modelo: 'Yale GLP050',
    marca: 'Yale',
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.PARADA,
    capacidade: 2200,
    anoFabricacao: 2020,
    dataAquisicao: '18/07/2020',
    numeroSerie: 'YAL004',
    horimetro: 18500,
    ultimaManutencao: '25/08/2023',
    proximaManutencao: '25/11/2023',
    localizacaoAtual: 'Setor C',
    setor: 'Expedição',
    custoHora: 40.00,
    eficiencia: 82.8,
    disponibilidade: 85.5,
    qrCode: 'QR004',
    // Legacy properties for compatibility
    model: 'Yale GLP050',
    capacity: '2.200 kg',
    acquisitionDate: '18/07/2020',
    lastMaintenance: '25/08/2023',
    hourMeter: 18500
  }
];

const IndexPage = () => {
  const isMobile = useIsMobile();

  // Calculate statistics
  const stats = {
    totalForklifts: mockForklifts.length,
    operationalForklifts: mockForklifts.filter(f => f.status === StatusEmpilhadeira.OPERACIONAL).length,
    maintenanceForklifts: mockForklifts.filter(f => f.status === StatusEmpilhadeira.EM_MANUTENCAO).length,
    stoppedForklifts: mockForklifts.filter(f => f.status === StatusEmpilhadeira.PARADA).length,
    totalOperators: 12,
    averageEfficiency: mockForklifts.reduce((sum, f) => sum + f.eficiencia, 0) / mockForklifts.length
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar />
        
        <main className="flex-1 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sistema de Gestão de Frotas
              </h1>
              <p className="text-muted-foreground">
                Bem-vindo ao painel principal do sistema de gestão de empilhadeiras
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Empilhadeiras</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalForklifts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.operationalForklifts} operacionais
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Operadores Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOperators}</div>
                  <p className="text-xs text-muted-foreground">
                    Com certificações válidas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.maintenanceForklifts}</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando serviço
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eficiência Média</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageEfficiency.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    Da frota geral
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Gerenciar Empilhadeiras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visualize e gerencie todas as empilhadeiras da frota
                  </p>
                  <Link to="/forklifts">
                    <Button className="w-full">
                      Acessar Empilhadeiras
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gerenciar Operadores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Controle de operadores e suas certificações
                  </p>
                  <Link to="/operators">
                    <Button className="w-full">
                      Acessar Operadores
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Controlar Operações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitore operações em tempo real
                  </p>
                  <Link to="/operations">
                    <Button className="w-full">
                      Acessar Operações
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Manutenção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gerencie ordens de serviço e manutenções
                  </p>
                  <Link to="/maintenance">
                    <Button className="w-full">
                      Acessar Manutenção
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="h-5 w-5" />
                    Abastecimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Controle de abastecimento de gás
                  </p>
                  <Link to="/gas-supply">
                    <Button className="w-full">
                      Acessar Abastecimento
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Relatórios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Análises e relatórios detalhados
                  </p>
                  <Link to="/reports">
                    <Button className="w-full">
                      Acessar Relatórios
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Empilhadeira G001 iniciou operação</p>
                      <p className="text-xs text-muted-foreground">2 horas atrás</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Manutenção programada para R003</p>
                      <p className="text-xs text-muted-foreground">4 horas atrás</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Abastecimento realizado - E002</p>
                      <p className="text-xs text-muted-foreground">6 horas atrás</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IndexPage;
