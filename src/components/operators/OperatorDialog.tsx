
import React from 'react';
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
import { StatusCertificacao, Operador, FuncaoOperador, StatusOperador } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

interface OperatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator?: Operador;
  onSave: (operator: Operador) => void;
}

const OperatorDialog = ({ open, onOpenChange, operator, onSave }: OperatorDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!operator;
  
  const [formData, setFormData] = React.useState<Partial<Operador>>(
    operator || {
      id: `OP${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      name: '',
      nome: '',
      role: FuncaoOperador.OPERADOR,
      funcao: FuncaoOperador.OPERADOR,
      cpf: '',
      contact: '',
      telefone: '',
      shift: 'Manhã',
      turno: 'Manhã',
      registrationDate: format(new Date(), 'dd/MM/yyyy'),
      dataAdmissao: format(new Date(), 'dd/MM/yyyy'),
      asoExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
      nrExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
      asoStatus: StatusCertificacao.VALIDO,
      nrStatus: StatusCertificacao.VALIDO,
      certificacoes: [],
      avaliacoes: [],
      horasTrabalhadas: 0,
      produtividade: 0,
      status: StatusOperador.ATIVO,
      email: '',
      setor: ''
    }
  );

  // Convert date string to Date object for Calendar
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Handle form field changes
  const handleChange = (field: keyof Operador, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      // Keep both Portuguese and English properties in sync
      ...(field === 'name' && { nome: value }),
      ...(field === 'nome' && { name: value }),
      ...(field === 'role' && { funcao: value as FuncaoOperador }),
      ...(field === 'funcao' && { role: value as FuncaoOperador }),
      ...(field === 'contact' && { telefone: value }),
      ...(field === 'telefone' && { contact: value }),
      ...(field === 'shift' && { turno: value }),
      ...(field === 'turno' && { shift: value }),
      ...(field === 'registrationDate' && { dataAdmissao: value }),
      ...(field === 'dataAdmissao' && { registrationDate: value })
    }));
  };

  // Handle date changes
  const handleDateChange = (field: 'asoExpirationDate' | 'nrExpirationDate', date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, 'dd/MM/yyyy');
    setFormData(prev => ({ ...prev, [field]: formattedDate }));
    
    // Update certificate status based on date
    const today = new Date();
    const expirationDate = date;
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    let status: StatusCertificacao;
    if (diffDays < 0) {
      status = StatusCertificacao.VENCIDO;
    } else if (diffDays < 30) {
      status = StatusCertificacao.VENCENDO;
    } else {
      status = StatusCertificacao.VALIDO;
    }
    
    const statusField = field === 'asoExpirationDate' ? 'asoStatus' : 'nrStatus';
    setFormData(prev => ({ ...prev, [statusField]: status }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name && !formData.nome || !formData.cpf || (!formData.contact && !formData.telefone)) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save operator
    onSave(formData as Operador);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `OP${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        name: '',
        nome: '',
        role: FuncaoOperador.OPERADOR,
        funcao: FuncaoOperador.OPERADOR,
        cpf: '',
        contact: '',
        telefone: '',
        shift: 'Manhã',
        turno: 'Manhã',
        registrationDate: format(new Date(), 'dd/MM/yyyy'),
        dataAdmissao: format(new Date(), 'dd/MM/yyyy'),
        asoExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
        nrExpirationDate: format(new Date(new Date().setMonth(new Date().getMonth() + 12)), 'dd/MM/yyyy'),
        asoStatus: StatusCertificacao.VALIDO,
        nrStatus: StatusCertificacao.VALIDO,
        certificacoes: [],
        avaliacoes: [],
        horasTrabalhadas: 0,
        produtividade: 0,
        status: StatusOperador.ATIVO,
        email: '',
        setor: ''
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Operador atualizado" : "Operador adicionado",
      description: `${formData.name || formData.nome} foi ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Operador' : 'Adicionar Novo Operador'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do operador nos campos abaixo.' 
              : 'Preencha as informações do novo operador nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input 
                id="name" 
                value={formData.name || formData.nome || ''} 
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nome do operador"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={formData.role || formData.funcao || ''} 
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FuncaoOperador.OPERADOR}>Operador</SelectItem>
                  <SelectItem value={FuncaoOperador.SUPERVISOR}>Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input 
                id="cpf" 
                value={formData.cpf || ''} 
                onChange={(e) => handleChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contato</Label>
              <Input 
                id="contact" 
                value={formData.contact || formData.telefone || ''} 
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shift">Turno</Label>
              <Select 
                value={formData.shift || formData.turno || ''} 
                onValueChange={(value) => handleChange('shift', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã">Manhã</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Noite">Noite</SelectItem>
                  <SelectItem value="Integral">Integral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Validade do ASO</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.asoExpirationDate || ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.asoExpirationDate || '')}
                  onSelect={(date) => handleDateChange('asoExpirationDate', date)}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Validade da NR-11</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.nrExpirationDate || ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.nrExpirationDate || '')}
                  onSelect={(date) => handleDateChange('nrExpirationDate', date)}
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
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Operador'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperatorDialog;
