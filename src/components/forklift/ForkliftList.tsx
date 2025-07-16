
import React from 'react';
import { cn } from '@/lib/utils';
import { Empilhadeira, StatusEmpilhadeira } from '@/types';
import { Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ForkliftListProps {
  forklifts: Empilhadeira[];
  onForkliftClick: (id: string) => void;
  onDeleteForklift?: (id: string) => void;
}

const ForkliftList: React.FC<ForkliftListProps> = ({ 
  forklifts, 
  onForkliftClick,
  onDeleteForklift 
}) => {
  // Get status color classes
  const getStatusColor = (status: StatusEmpilhadeira) => {
    switch (status) {
      case StatusEmpilhadeira.OPERACIONAL:
        return 'bg-green-100 text-green-800 border-green-200';
      case StatusEmpilhadeira.EM_MANUTENCAO:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case StatusEmpilhadeira.PARADA:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get type color classes
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Gás':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Elétrica':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Retrátil':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteForklift) {
      onDeleteForklift(id);
    }
  };

  // Handle view details click
  const handleViewDetails = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onForkliftClick(id);
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead className="hidden lg:table-cell">Capacidade</TableHead>
              <TableHead className="hidden xl:table-cell">Horímetro</TableHead>
              <TableHead className="hidden xl:table-cell">Última Manutenção</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forklifts.map((forklift) => (
              <TableRow 
                key={forklift.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onForkliftClick(forklift.id)}
              >
                <TableCell className="font-medium">{forklift.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{forklift.modelo}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      {forklift.capacidade} kg • {forklift.tipo}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" className={cn("border", getTypeColor(forklift.tipo))}>
                    {forklift.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{forklift.capacidade} kg</TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {forklift.horimetro.toString().padStart(5, '0')}
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">{forklift.ultimaManutencao}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("border", getStatusColor(forklift.status))}>
                    {forklift.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleViewDetails(e, forklift.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onDeleteForklift && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(e, forklift.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {forklifts.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-2">Nenhuma empilhadeira encontrada</h3>
          <p>Os dados aparecerão aqui quando disponíveis.</p>
        </div>
      )}
    </div>
  );
};

export default ForkliftList;
