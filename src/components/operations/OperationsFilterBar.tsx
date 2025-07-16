
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Grid3X3, List } from "lucide-react";
import AdvancedFilters from "@/components/common/AdvancedFilters";
import { StatusOperacao, TipoOperacao, PrioridadeOperacao } from "@/types";
import { Button } from "@/components/ui/button";

interface OperationsFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  filters: any;
  setFilters: (f: any) => void;
  clearFilters: () => void;
  filterOptions: any;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const OperationsFilterBar: React.FC<OperationsFilterBarProps> = ({
  search,
  setSearch,
  filters,
  setFilters,
  clearFilters,
  filterOptions,
  viewMode,
  setViewMode,
}) => (
  <div className="glass-card px-6 py-4 mb-6">
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por ID ou modelo..."
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="min-w-[200px]">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value === "all" ? "" : value })
          }
        >
          <SelectTrigger className="h-10 bg-background/50 border-border/50">
            <SelectValue placeholder="Todos os Status" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value={StatusOperacao.EM_ANDAMENTO}>Em Andamento</SelectItem>
            <SelectItem value={StatusOperacao.CONCLUIDA}>Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[200px]">
        <Select
          value={filters.tipo || "all"}
          onValueChange={(value) =>
            setFilters({ ...filters, tipo: value === "all" ? "" : value })
          }
        >
          <SelectTrigger className="h-10 bg-background/50 border-border/50">
            <SelectValue placeholder="Todos os Tipos" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value={TipoOperacao.MOVIMENTACAO}>Movimentação</SelectItem>
            <SelectItem value={TipoOperacao.CARGA}>Carga</SelectItem>
            <SelectItem value={TipoOperacao.DESCARGA}>Descarga</SelectItem>
            <SelectItem value={TipoOperacao.ESTOQUE}>Estoque</SelectItem>
            <SelectItem value={TipoOperacao.PICKING}>Picking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AdvancedFilters
        filters={filterOptions}
        values={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        triggerProps={{
          variant: "outline",
          className: "h-10 px-4 border-border/50 text-foreground hover:bg-accent/50 hover:text-accent-foreground shadow-sm",
        }}
      />

      <div className="flex gap-1 border border-border/50 rounded-lg p-1 bg-background/30">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          className="h-8 px-3"
          data-state={viewMode === "grid" ? "active" : ""}
          onClick={() => setViewMode("grid")}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          className="h-8 px-3"
          onClick={() => setViewMode("list")}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

export default OperationsFilterBar;
