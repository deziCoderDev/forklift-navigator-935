
import React from 'react';
import PendingMaintenanceCard from '@/components/maintenance/PendingMaintenanceCard';
import { OrdemServico, StatusManutencao } from '@/types';

interface MaintenancePendingSectionProps {
  pendingMaintenance: OrdemServico[];
  onEdit: (maintenance: OrdemServico) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: StatusManutencao) => void;
}

const MaintenancePendingSection: React.FC<MaintenancePendingSectionProps> = ({
  pendingMaintenance,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (pendingMaintenance.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manutenções Pendentes</h2>
          <p className="text-muted-foreground">
            {pendingMaintenance.length} {pendingMaintenance.length === 1 ? 'manutenção aguardando' : 'manutenções aguardando'} atenção
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Atualizando em tempo real</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {pendingMaintenance.map((maintenance) => (
          <PendingMaintenanceCard
            key={maintenance.id}
            maintenance={maintenance}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default MaintenancePendingSection;
