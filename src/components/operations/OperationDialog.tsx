
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Operacao, StatusOperacao } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";

interface OperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation?: Operacao;
  onSave: (operation: Operacao) => void;
  availableOperators: { id: string; name: string }[];
  availableForklifts: { id: string; model: string }[];
}

const OperationDialog = ({ 
  open, 
  onOpenChange, 
  operation, 
  onSave,
  availableOperators,
  availableForklifts
}: OperationDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!operation;
  
  // Form state
  const [formData, setFormData] = useState<Partial<Operacao>>({
    operadorId: '',
    empilhadeiraId: '',
    setor: '',
    dataInicio: new Date().toISOString().slice(0, 16),
    status: StatusOperacao.EM_ANDAMENTO
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with operation data if editing
  useEffect(() => {
    if (operation) {
      setFormData({
        ...operation,
        dataInicio: new Date(operation.dataInicio).toISOString().slice(0, 16),
        dataFim: operation.dataFim ? new Date(operation.dataFim).toISOString().slice(0, 16) : undefined
      });
    } else {
      // Reset form for new operation
      setFormData({
        operadorId: '',
        empilhadeiraId: '',
        setor: '',
        dataInicio: new Date().toISOString().slice(0, 16),
        status: StatusOperacao.EM_ANDAMENTO
      });
    }
    setErrors({});
  }, [operation, open]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.operadorId) {
      newErrors.operadorId = 'Operador é obrigatório';
    }
    if (!formData.empilhadeiraId) {
      newErrors.empilhadeiraId = 'Empilhadeira é obrigatória';
    }
    if (!formData.setor?.trim()) {
      newErrors.setor = 'Setor é obrigatório';
    }
    if (!formData.dataInicio) {
      newErrors.dataInicio = 'Data/hora de início é obrigatória';
    }
    if (formData.dataFim && formData.dataInicio && new Date(formData.dataFim) <= new Date(formData.dataInicio)) {
      newErrors.dataFim = 'Data/hora de término deve ser posterior ao início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle operator selection
  const handleOperatorChange = (operadorId: string) => {
    setFormData(prev => ({
      ...prev,
      operadorId
    }));
    if (errors.operadorId) {
      setErrors(prev => ({ ...prev, operadorId: '' }));
    }
  };

  // Handle forklift selection
  const handleForkliftChange = (empilhadeiraId: string) => {
    setFormData(prev => ({
      ...prev,
      empilhadeiraId
    }));
    if (errors.empilhadeiraId) {
      setErrors(prev => ({ ...prev, empilhadeiraId: '' }));
    }
  };

  // Handle sector change
  const handleSectorChange = (value: string) => {
    setFormData(prev => ({ ...prev, setor: value }));
    if (errors.setor) {
      setErrors(prev => ({ ...prev, setor: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    // Generate ID for new operations
    const operationData: Operacao = {
      id: operation?.id || `OP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData as Operacao
    };

    // Save the operation
    onSave(operationData);
    
    // Close the dialog
    onOpenChange(false);
  };

  // Calculate if the operation can be completed
  const canComplete = isEditing && operation?.status === StatusOperacao.EM_ANDAMENTO;

  // Complete the operation
  const handleComplete = () => {
    if (!validateForm()) {
      return;
    }

    const now = new Date();
    const completedOperation: Operacao = {
      ...formData as Operacao,
      status: StatusOperacao.CONCLUIDA,
      dataFim: now.toISOString()
    };
    
    onSave(completedOperation);
    onOpenChange(false);
    
    toast({
      title: "Operação concluída",
      description: "A operação foi finalizada com sucesso."
    });
  };

  // Predefined sectors
  const sectors = [
    'Armazém A',
    'Armazém B', 
    'Armazém C',
    'Expedição',
    'Recebimento',
    'Produção',
    'Estoque',
    'Doca 1',
    'Doca 2',
    'Pátio'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? 'Editar Operação' : 'Nova Operação'}
            {isEditing && (
              <Badge 
                variant={operation?.status === StatusOperacao.EM_ANDAMENTO ? 'default' : 'secondary'}
                className={operation?.status === StatusOperacao.EM_ANDAMENTO ? 'bg-green-500 text-white' : ''}
              >
                {operation?.status === StatusOperacao.EM_ANDAMENTO ? 'Em Andamento' : 'Concluída'}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operadorId">Operador *</Label>
              <Select 
                value={formData.operadorId} 
                onValueChange={handleOperatorChange}
              >
                <SelectTrigger id="operadorId" className={errors.operadorId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione um operador" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map(operator => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.operadorId && <p className="text-sm text-red-500">{errors.operadorId}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="empilhadeiraId">Empilhadeira *</Label>
              <Select 
                value={formData.empilhadeiraId}
                onValueChange={handleForkliftChange}
              >
                <SelectTrigger id="empilhadeiraId" className={errors.empilhadeiraId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione uma empilhadeira" />
                </SelectTrigger>
                <SelectContent>
                  {availableForklifts.map(forklift => (
                    <SelectItem key={forklift.id} value={forklift.id}>
                      {forklift.model} ({forklift.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.empilhadeiraId && <p className="text-sm text-red-500">{errors.empilhadeiraId}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="setor">Setor *</Label>
            <Select value={formData.setor} onValueChange={handleSectorChange}>
              <SelectTrigger className={errors.setor ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.setor && <p className="text-sm text-red-500">{errors.setor}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data/Hora de Início *</Label>
              <Input
                id="dataInicio"
                name="dataInicio"
                type="datetime-local"
                value={formData.dataInicio}
                onChange={handleChange}
                className={errors.dataInicio ? 'border-red-500' : ''}
              />
              {errors.dataInicio && <p className="text-sm text-red-500">{errors.dataInicio}</p>}
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data/Hora de Término</Label>
                <Input
                  id="dataFim"
                  name="dataFim"
                  type="datetime-local"
                  value={formData.dataFim || ''}
                  onChange={handleChange}
                  disabled={formData.status === StatusOperacao.EM_ANDAMENTO}
                  className={errors.dataFim ? 'border-red-500' : ''}
                />
                {errors.dataFim && <p className="text-sm text-red-500">{errors.dataFim}</p>}
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            {canComplete && (
              <Button 
                type="button" 
                variant="outline" 
                className="mr-auto" 
                onClick={handleComplete}
              >
                Finalizar Operação
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Criar Operação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
