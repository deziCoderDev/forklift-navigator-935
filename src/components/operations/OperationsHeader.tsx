
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface OperationsHeaderProps {
  onAdd: () => void;
}

const OperationsHeader: React.FC<OperationsHeaderProps> = ({ onAdd }) => (
  <PageHeader 
    title="Operações"
    subtitle="Controle e monitoramento de operações em tempo real"
    description="Gerencie todas as operações ativas e monitore o desempenho da equipe"
    icon={Settings}
  >
    <Button
      className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      onClick={onAdd}
    >
      <Plus className="w-4 h-4" />
      Nova Operação
    </Button>
  </PageHeader>
);

export default OperationsHeader;
