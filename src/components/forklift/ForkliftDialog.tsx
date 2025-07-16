
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
import { Empilhadeira, StatusEmpilhadeira, TipoEmpilhadeira } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface ForkliftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forklift?: Empilhadeira;
  onSave: (forklift: Empilhadeira) => void;
}

const ForkliftDialog = ({ open, onOpenChange, forklift, onSave }: ForkliftDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!forklift;
  
  const [formData, setFormData] = useState<Partial<Empilhadeira>>(
    forklift || {
      id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      modelo: '',
      marca: 'Toyota',
      tipo: TipoEmpilhadeira.GAS,
      capacidade: 2500,
      anoFabricacao: new Date().getFullYear(),
      dataAquisicao: '01/01/2023',
      numeroSerie: '',
      horimetro: 0,
      ultimaManutencao: format(new Date(), 'dd/MM/yyyy'),
      proximaManutencao: '',
      localizacaoAtual: '',
      setor: '',
      custoHora: 0,
      eficiencia: 85,
      disponibilidade: 95,
      qrCode: '',
      status: StatusEmpilhadeira.OPERACIONAL
    }
  );

  // Handle form field changes
  const handleChange = (field: keyof Empilhadeira, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Parse date string to Date object (dd/MM/yyyy -> Date)
  const parseDate = (dateStr: string): Date => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  // Format date for display (Date -> dd/MM/yyyy)
  const formatDateString = (date: Date): string => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.modelo || !formData.capacidade) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save forklift
    onSave(formData as Empilhadeira);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        modelo: '',
        marca: 'Toyota',
        tipo: TipoEmpilhadeira.GAS,
        capacidade: 2500,
        anoFabricacao: new Date().getFullYear(),
        dataAquisicao: '01/01/2023',
        numeroSerie: '',
        horimetro: 0,
        ultimaManutencao: format(new Date(), 'dd/MM/yyyy'),
        proximaManutencao: '',
        localizacaoAtual: '',
        setor: '',
        custoHora: 0,
        eficiencia: 85,
        disponibilidade: 95,
        qrCode: '',
        status: StatusEmpilhadeira.OPERACIONAL
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Empilhadeira atualizada" : "Empilhadeira adicionada",
      description: `${formData.modelo} foi ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Empilhadeira' : 'Adicionar Nova Empilhadeira'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações da empilhadeira nos campos abaixo.' 
              : 'Preencha as informações da nova empilhadeira nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input 
                id="id" 
                value={formData.id} 
                onChange={(e) => handleChange('id', e.target.value)}
                disabled={isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => handleChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoEmpilhadeira.GAS}>Gás</SelectItem>
                  <SelectItem value={TipoEmpilhadeira.ELETRICA}>Elétrica</SelectItem>
                  <SelectItem value={TipoEmpilhadeira.RETRATIL}>Retrátil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input 
                id="modelo" 
                value={formData.modelo} 
                onChange={(e) => handleChange('modelo', e.target.value)}
                placeholder="Ex: Toyota 8FGU25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade (kg)</Label>
              <Input 
                id="capacidade" 
                type="number"
                value={formData.capacidade} 
                onChange={(e) => handleChange('capacidade', parseInt(e.target.value))}
                placeholder="Ex: 2500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="horimetro">Horímetro</Label>
              <Input 
                id="horimetro" 
                type="number"
                min="0"
                value={formData.horimetro} 
                onChange={(e) => handleChange('horimetro', parseInt(e.target.value))}
              />
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
                  <SelectItem value={StatusEmpilhadeira.OPERACIONAL}>Operacional</SelectItem>
                  <SelectItem value={StatusEmpilhadeira.EM_MANUTENCAO}>Em Manutenção</SelectItem>
                  <SelectItem value={StatusEmpilhadeira.PARADA}>Parada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Data de Aquisição</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataAquisicao}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.dataAquisicao || '')}
                  onSelect={(date) => handleChange('dataAquisicao', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Última Manutenção</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.ultimaManutencao}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.ultimaManutencao || '')}
                  onSelect={(date) => handleChange('ultimaManutencao', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Empilhadeira'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForkliftDialog;
