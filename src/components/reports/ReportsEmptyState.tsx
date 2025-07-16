
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, Sparkles } from 'lucide-react';

interface ReportsEmptyStateProps {
  onClearFilters: () => void;
}

const ReportsEmptyState: React.FC<ReportsEmptyStateProps> = ({ onClearFilters }) => {
  return (
    <Card className="p-16 text-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-white/20 shadow-2xl">
      <div className="space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto">
          <FileBarChart className="w-12 h-12 text-blue-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nenhum relatório encontrado
          </h3>
          <p className="text-muted-foreground mt-2 text-lg">
            Tente ajustar os filtros ou termo de busca para encontrar relatórios.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Limpar Filtros
        </Button>
      </div>
    </Card>
  );
};

export default ReportsEmptyState;
