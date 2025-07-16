
import { useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Empilhadeira, 
  Operador, 
  Operacao, 
  OrdemServico, 
  Abastecimento,
  StatusEmpilhadeira,
  StatusOperacao,
  StatusManutencao 
} from '@/types';

export const useDataValidation = () => {
  const { toast } = useToast();
  const { empilhadeiras, operadores, operacoes, ordemServicos } = useAppStore();

  const validateEmpilhadeira = useCallback((empilhadeira: Partial<Empilhadeira>): string[] => {
    const errors: string[] = [];
    
    if (!empilhadeira.modelo?.trim()) {
      errors.push('Modelo é obrigatório');
    }
    
    if (!empilhadeira.marca?.trim()) {
      errors.push('Marca é obrigatória');
    }
    
    if (!empilhadeira.capacidade || empilhadeira.capacidade <= 0) {
      errors.push('Capacidade deve ser maior que zero');
    }
    
    if (!empilhadeira.numeroSerie?.trim()) {
      errors.push('Número de série é obrigatório');
    }
    
    // Verifica duplicação de número de série
    if (empilhadeira.numeroSerie) {
      const existeOutra = empilhadeiras.find(e => 
        e.numeroSerie === empilhadeira.numeroSerie && e.id !== empilhadeira.id
      );
      if (existeOutra) {
        errors.push('Número de série já existe em outra empilhadeira');
      }
    }
    
    return errors;
  }, [empilhadeiras]);

  const validateOperador = useCallback((operador: Partial<Operador>): string[] => {
    const errors: string[] = [];
    
    if (!operador.nome?.trim()) {
      errors.push('Nome é obrigatório');
    }
    
    if (!operador.cpf?.trim()) {
      errors.push('CPF é obrigatório');
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(operador.cpf)) {
      errors.push('CPF deve estar no formato 000.000.000-00');
    }
    
    if (!operador.email?.trim()) {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(operador.email)) {
      errors.push('Email deve ter formato válido');
    }
    
    // Verifica duplicação de CPF
    if (operador.cpf) {
      const existeOutro = operadores.find(o => 
        o.cpf === operador.cpf && o.id !== operador.id
      );
      if (existeOutro) {
        errors.push('CPF já cadastrado para outro operador');
      }
    }
    
    // Verifica duplicação de email
    if (operador.email) {
      const existeOutro = operadores.find(o => 
        o.email === operador.email && o.id !== operador.id
      );
      if (existeOutro) {
        errors.push('Email já cadastrado para outro operador');
      }
    }
    
    return errors;
  }, [operadores]);

  const validateOperacao = useCallback((operacao: Partial<Operacao>): string[] => {
    const errors: string[] = [];
    
    if (!operacao.empilhadeiraId) {
      errors.push('Empilhadeira é obrigatória');
    } else {
      // Verifica se empilhadeira existe e está disponível
      const empilhadeira = empilhadeiras.find(e => e.id === operacao.empilhadeiraId);
      if (!empilhadeira) {
        errors.push('Empilhadeira não encontrada');
      } else if (empilhadeira.status !== StatusEmpilhadeira.OPERACIONAL) {
        errors.push('Empilhadeira não está operacional');
      } else if (operacao.status === StatusOperacao.EM_ANDAMENTO) {
        // Verifica se empilhadeira já está em uso
        const operacaoAtiva = operacoes.find(o => 
          o.empilhadeiraId === operacao.empilhadeiraId && 
          o.status === StatusOperacao.EM_ANDAMENTO &&
          o.id !== operacao.id
        );
        if (operacaoAtiva) {
          errors.push('Empilhadeira já está em uso em outra operação');
        }
      }
    }
    
    if (!operacao.operadorId) {
      errors.push('Operador é obrigatório');
    } else {
      // Verifica se operador existe e está ativo
      const operador = operadores.find(o => o.id === operacao.operadorId);
      if (!operador) {
        errors.push('Operador não encontrado');
      } else if (operador.status !== 'Ativo') {
        errors.push('Operador não está ativo');
      }
    }
    
    if (!operacao.tipo) {
      errors.push('Tipo de operação é obrigatório');
    }
    
    if (!operacao.setor?.trim()) {
      errors.push('Setor é obrigatório');
    }
    
    if (!operacao.duracaoEstimada || operacao.duracaoEstimada <= 0) {
      errors.push('Duração estimada deve ser maior que zero');
    }
    
    return errors;
  }, [empilhadeiras, operadores, operacoes]);

  const validateOrdemServico = useCallback((ordem: Partial<OrdemServico>): string[] => {
    const errors: string[] = [];
    
    if (!ordem.empilhadeiraId) {
      errors.push('Empilhadeira é obrigatória');
    } else {
      const empilhadeira = empilhadeiras.find(e => e.id === ordem.empilhadeiraId);
      if (!empilhadeira) {
        errors.push('Empilhadeira não encontrada');
      }
    }
    
    if (!ordem.problema?.trim()) {
      errors.push('Descrição do problema é obrigatória');
    }
    
    if (!ordem.tecnicoId) {
      errors.push('Técnico responsável é obrigatório');
    } else {
      const tecnico = operadores.find(o => o.id === ordem.tecnicoId);
      if (!tecnico) {
        errors.push('Técnico não encontrado');
      }
    }
    
    if (!ordem.tipo) {
      errors.push('Tipo de manutenção é obrigatório');
    }
    
    if (!ordem.dataAbertura) {
      errors.push('Data de abertura é obrigatória');
    }
    
    // Se status é concluída, deve ter data de conclusão
    if (ordem.status === StatusManutencao.CONCLUIDA && !ordem.dataConclusao) {
      errors.push('Data de conclusão é obrigatória para ordens concluídas');
    }
    
    return errors;
  }, [empilhadeiras, operadores]);

  const validateAbastecimento = useCallback((abastecimento: Partial<Abastecimento>): string[] => {
    const errors: string[] = [];
    
    if (!abastecimento.empilhadeiraId) {
      errors.push('Empilhadeira é obrigatória');
    } else {
      const empilhadeira = empilhadeiras.find(e => e.id === abastecimento.empilhadeiraId);
      if (!empilhadeira) {
        errors.push('Empilhadeira não encontrada');
      }
    }
    
    if (!abastecimento.operadorId) {
      errors.push('Operador é obrigatório');
    } else {
      const operador = operadores.find(o => o.id === abastecimento.operadorId);
      if (!operador) {
        errors.push('Operador não encontrado');
      }
    }
    
    if (!abastecimento.quantidadeLitros || abastecimento.quantidadeLitros <= 0) {
      errors.push('Quantidade de litros deve ser maior que zero');
    }
    
    if (!abastecimento.precoLitro || abastecimento.precoLitro <= 0) {
      errors.push('Preço por litro deve ser maior que zero');
    }
    
    if (!abastecimento.fornecedor?.trim()) {
      errors.push('Fornecedor é obrigatório');
    }
    
    if (!abastecimento.dataAbastecimento) {
      errors.push('Data de abastecimento é obrigatória');
    }
    
    return errors;
  }, [empilhadeiras, operadores]);

  const showValidationErrors = useCallback((errors: string[]) => {
    if (errors.length > 0) {
      toast({
        title: "Erro de Validação",
        description: errors.join('\n'),
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, [toast]);

  return {
    validateEmpilhadeira,
    validateOperador,
    validateOperacao,
    validateOrdemServico,
    validateAbastecimento,
    showValidationErrors
  };
};
