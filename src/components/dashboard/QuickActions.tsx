
import React from "react";
import { Truck, Plus, Settings, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
}

const actions: QuickAction[] = [
  {
    label: "Nova Operação",
    icon: ClipboardList,
    onClick: () => alert("Nova Operação clicada"),
    color: "bg-primary text-white",
  },
  {
    label: "Adicionar Empilhadeira",
    icon: Plus,
    onClick: () => alert("Adicionar Empilhadeira clicada"),
    color: "bg-status-operational text-white",
  },
  {
    label: "Agendar Manutenção",
    icon: Settings,
    onClick: () => alert("Agendar Manutenção clicada"),
    color: "bg-status-maintenance text-white",
  },
  {
    label: "Ver Frota",
    icon: Truck,
    onClick: () => alert("Ver Frota clicada"),
    color: "bg-status-warning text-white",
  },
];

const QuickActions: React.FC = () => (
  <div className="flex flex-row flex-wrap gap-3 w-full my-2 justify-center md:justify-start">
    {actions.map((action, idx) => (
      <button
        key={idx}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow uppercase text-xs tracking-wider hover:scale-105 transition",
          action.color
        )}
        onClick={action.onClick}
        type="button"
      >
        <action.icon className="w-4 h-4" />
        {action.label}
      </button>
    ))}
  </div>
);

export default QuickActions;
