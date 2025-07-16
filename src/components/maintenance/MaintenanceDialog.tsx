
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrdemServico, StatusManutencao } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance?: OrdemServico;
  onSave: (maintenance: OrdemServico) => void;
  availableForklifts: { id: string; model: string }[];
  availableOperators: { id: string; name: string }[];
}

const MaintenanceDialog = ({ 
  open, 
  onOpenChange, 
  maintenance, 
  onSave,
  availableForklifts,
  availableOperators 
}: MaintenanceDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!maintenance;
  
  const [formData, setFormData] = useState<Partial<OrdemServico>>(
    maintenance || {
      id: `M${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      empilhadeiraId: '',
      problema: '',
      tecnicoId: '',
      dataAbertura: format(new Date(), 'yyyy-MM-dd'),
      status: StatusManutencao.ABERTA,
      dataConclusao: ''
    }
  );

  // Handle forklift selection
  const handleForkliftChange = (empilhadeiraId: string) => {
    const selectedForklift = availableForklifts.find(f => f.id === empilhadeiraId);
    setFormData(prev => ({ 
      ...prev, 
      empilhadeiraId
    }));
  };

  // Handle reporter selection
  const handleReporterChange = (tecnicoId: string) => {
    setFormData(prev => ({ ...prev, tecnicoId }));
  };

  // Handle form field changes
  const handleChange = (field: keyof OrdemServico, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If changing status to completed, set completed date to today
    if (field === 'status' && value === StatusManutencao.CONCLUIDA) {
      setFormData(prev => ({ 
        ...prev, 
        dataConclusao: format(new Date(), 'yyyy-MM-dd')
      }));
    }
    // If changing status from completed, clear completed date
    else if (field === 'status' && value !== StatusManutencao.CONCLUIDA && formData.dataConclusao) {
      setFormData(prev => ({ ...prev, dataConclusao: '' }));
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return undefined;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.empilhadeiraId || !formData.problema || !formData.tecnicoId || !formData.dataAbertura) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save maintenance
    onSave(formData as OrdemServico);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `M${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        empilhadeiraId: '',
        problema: '',
        tecnicoId: '',
        dataAbertura: format(new Date(), 'yyyy-MM-dd'),
        status: StatusManutencao.ABERTA,
        dataConclusao: ''
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Manutenção atualizada" : "Manutenção registrada",
      description: `Manutenção ${isEditing ? 'atualizada' : 'registrada'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Manutenção' : 'Registrar Nova Manutenção'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações da manutenção nos campos abaixo.' 
              : 'Preencha as informações da nova manutenção nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empilhadeiraId">Empilhadeira</Label>
                <Select 
                  value={formData.empilhadeiraId} 
                  onValueChange={handleForkliftChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empilhadeira" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableForklifts.map(forklift => (
                      <SelectItem key={forklift.id} value={forklift.id}>
                        {forklift.model} ({forklift.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StatusManutencao.ABERTA}>Aberta</SelectItem>
                    <SelectItem value={StatusManutencao.EM_ANDAMENTO}>Em andamento</SelectItem>
                    <SelectItem value={StatusManutencao.CONCLUIDA}>Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="problema">Descrição do Problema</Label>
              <Textarea 
                id="problema" 
                value={formData.problema} 
                onChange={(e) => handleChange('problema', e.target.value)}
                placeholder="Descreva o problema da empilhadeira"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tecnicoId">Reportado por</Label>
                <Select 
                  value={formData.tecnicoId} 
                  onValueChange={handleReporterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperators.map(operator => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Data Reportada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateForDisplay(formData.dataAbertura || '')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.dataAbertura || '')}
                      onSelect={(date) => handleChange('dataAbertura', format(date || new Date(), 'yyyy-MM-dd'))}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {formData.status === StatusManutencao.CONCLUIDA && (
              <div className="space-y-2">
                <Label>Data de Conclusão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateForDisplay(formData.dataConclusao || '')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.dataConclusao || '')}
                      onSelect={(date) => handleChange('dataConclusao', format(date || new Date(), 'yyyy-MM-dd'))}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Registrar Manutenção'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDialog;
