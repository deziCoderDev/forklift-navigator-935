
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileBarChart, Download, Calendar as CalendarIcon } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';

const ReportsHeader: React.FC = () => {
  return (
    <PageHeader 
      title="Relatórios do Sistema"
      subtitle="Análises inteligentes e insights da sua operação"
      description="Gere relatórios detalhados e acompanhe métricas de performance"
      icon={FileBarChart}
    >
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300 shadow-lg">
          <CalendarIcon className="w-4 h-4" />
          Agendar Relatório
        </Button>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <Download className="w-4 h-4" />
          Exportar Selecionados
        </Button>
      </div>
    </PageHeader>
  );
};

export default ReportsHeader;
