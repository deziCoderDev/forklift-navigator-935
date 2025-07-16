
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Plus } from 'lucide-react';

interface MaintenanceHeaderProps {
  onExport: () => void;
  onOpenAdd: () => void;
}

const MaintenanceHeader: React.FC<MaintenanceHeaderProps> = ({
  onExport,
  onOpenAdd,
}) => (
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Gestão de Manutenção
      </h1>
      <p className="text-muted-foreground mt-1">
        Controle completo das ordens de serviço e manutenções
      </p>
    </div>
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={onExport}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar
      </Button>
      <Button
        onClick={onOpenAdd}
        className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="w-4 h-4" />
        Nova Manutenção
      </Button>
    </div>
  </div>
);

export default MaintenanceHeader;
