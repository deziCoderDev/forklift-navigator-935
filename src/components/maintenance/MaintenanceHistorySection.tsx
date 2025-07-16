
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import MaintenanceHistoryTable from '@/components/maintenance/MaintenanceHistoryTable';
import { OrdemServico } from '@/types';

interface MaintenanceHistorySectionProps {
  data: OrdemServico[];
  onEdit: (maintenance: OrdemServico) => void;
  onDelete: (id: string) => void;
  onReport?: () => void;
}

const MaintenanceHistorySection: React.FC<MaintenanceHistorySectionProps> = ({
  data,
  onEdit,
  onDelete,
  onReport
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Histórico Completo</h2>
          <p className="text-muted-foreground">
            Todas as manutenções registradas no sistema
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={onReport}>
          <FileText className="w-4 h-4" />
          Gerar Relatório
        </Button>
      </div>
      <MaintenanceHistoryTable
        data={data}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default MaintenanceHistorySection;
