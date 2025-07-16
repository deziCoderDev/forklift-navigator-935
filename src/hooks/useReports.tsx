
import { useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { 
  StatusEmpilhadeira, 
  StatusOperacao, 
  StatusManutencao, 
  TipoEmpilhadeira,
  TipoOperacao 
} from '@/types';

export interface RelatorioEficiencia {
  empilhadeiraId: string;
  modelo: string;
  eficienciaMedia: number;
  horasOperacao: number;
  operacoesConcluidas: number;
  consumoMedio: number;
  custoOperacional: number;
}

export interface RelatorioManutencao {
  empilhadeiraId: string;
  modelo: string;
  manutencoesPendentes: number;
  manutencoesConcluidas: number;
  custoManutencao: number;
  tempoMedioReparo: number;
  proximaManutencao: string;
}

export interface RelatorioOperador {
  operadorId: string;
  nome: string;
  horasTrabalhadas: number;
  operacoesConcluidas: number;
  produtividadeMedia: number;
  eficienciaMedia: number;
}

export interface RelatorioConsumo {
  empilhadeiraId: string;
  modelo: string;
  tipo: TipoEmpilhadeira;
  consumoTotal: number;
  custoTotal: number;
  eficienciaConsumo: number;
  ultimoAbastecimento: string;
}

export const useReports = () => {
  const { empilhadeiras, operadores, operacoes, ordemServicos, abastecimentos } = useAppStore();

  const relatorioEficiencia = useMemo((): RelatorioEficiencia[] => {
    return empilhadeiras.map(emp => {
      const operacoesEmp = operacoes.filter(op => op.empilhadeiraId === emp.id);
      const operacoesConcluidas = operacoesEmp.filter(op => op.status === StatusOperacao.CONCLUIDA);
      const abastecimentosEmp = abastecimentos.filter(ab => ab.empilhadeiraId === emp.id);
      
      const horasOperacao = operacoesConcluidas.reduce((sum, op) => 
        sum + (op.duracaoReal || op.duracaoEstimada || 0) / 60, 0
      );
      
      const eficienciaMedia = operacoesConcluidas.length > 0 
        ? operacoesConcluidas.reduce((sum, op) => sum + (op.produtividade || 0), 0) / operacoesConcluidas.length
        : emp.eficiencia;
      
      const consumoMedio = abastecimentosEmp.length > 0
        ? abastecimentosEmp.reduce((sum, ab) => sum + ab.quantidadeLitros, 0) / abastecimentosEmp.length
        : 0;
      
      const custoOperacional = abastecimentosEmp.reduce((sum, ab) => sum + ab.custoTotal, 0) +
        (horasOperacao * emp.custoHora);

      return {
        empilhadeiraId: emp.id,
        modelo: emp.modelo,
        eficienciaMedia,
        horasOperacao,
        operacoesConcluidas: operacoesConcluidas.length,
        consumoMedio,
        custoOperacional
      };
    });
  }, [empilhadeiras, operacoes, abastecimentos]);

  const relatorioManutencao = useMemo((): RelatorioManutencao[] => {
    return empilhadeiras.map(emp => {
      const ordensEmp = ordemServicos.filter(os => os.empilhadeiraId === emp.id);
      const manutencoesPendentes = ordensEmp.filter(os => os.status !== StatusManutencao.CONCLUIDA).length;
      const manutencoesConcluidas = ordensEmp.filter(os => os.status === StatusManutencao.CONCLUIDA).length;
      
      const custoManutencao = ordensEmp.reduce((sum, os) => sum + (os.custos?.total || 0), 0);
      
      const manutencoesComTempo = ordensEmp.filter(os => 
        os.status === StatusManutencao.CONCLUIDA && os.dataInicio && os.dataConclusao
      );
      
      const tempoMedioReparo = manutencoesComTempo.length > 0
        ? manutencoesComTempo.reduce((sum, os) => {
            const inicio = new Date(os.dataInicio!);
            const fim = new Date(os.dataConclusao!);
            return sum + (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / manutencoesComTempo.length
        : 0;

      return {
        empilhadeiraId: emp.id,
        modelo: emp.modelo,
        manutencoesPendentes,
        manutencoesConcluidas,
        custoManutencao,
        tempoMedioReparo,
        proximaManutencao: emp.proximaManutencao
      };
    });
  }, [empilhadeiras, ordemServicos]);

  const relatorioOperador = useMemo((): RelatorioOperador[] => {
    return operadores.map(op => {
      const operacoesOp = operacoes.filter(operacao => operacao.operadorId === op.id);
      const operacoesConcluidas = operacoesOp.filter(operacao => operacao.status === StatusOperacao.CONCLUIDA);
      
      const produtividadeMedia = operacoesConcluidas.length > 0
        ? operacoesConcluidas.reduce((sum, operacao) => sum + (operacao.produtividade || 0), 0) / operacoesConcluidas.length
        : op.produtividade;
      
      const horasOperacao = operacoesConcluidas.reduce((sum, operacao) => 
        sum + (operacao.duracaoReal || operacao.duracaoEstimada || 0) / 60, 0
      );

      // Calcular eficiência baseada nas empilhadeiras que operou
      const empilhadeirasOperadas = [...new Set(operacoesOp.map(operacao => operacao.empilhadeiraId))];
      const eficienciaMedia = empilhadeirasOperadas.length > 0
        ? empilhadeirasOperadas.reduce((sum, empId) => {
            const emp = empilhadeiras.find(e => e.id === empId);
            return sum + (emp?.eficiencia || 0);
          }, 0) / empilhadeirasOperadas.length
        : 0;

      return {
        operadorId: op.id,
        nome: op.nome,
        horasTrabalhadas: horasOperacao,
        operacoesConcluidas: operacoesConcluidas.length,
        produtividadeMedia,
        eficienciaMedia
      };
    });
  }, [operadores, operacoes, empilhadeiras]);

  const relatorioConsumo = useMemo((): RelatorioConsumo[] => {
    return empilhadeiras.map(emp => {
      const abastecimentosEmp = abastecimentos.filter(ab => ab.empilhadeiraId === emp.id);
      
      const consumoTotal = abastecimentosEmp.reduce((sum, ab) => sum + ab.quantidadeLitros, 0);
      const custoTotal = abastecimentosEmp.reduce((sum, ab) => sum + ab.custoTotal, 0);
      
      const eficienciaConsumo = abastecimentosEmp.length > 0
        ? abastecimentosEmp.reduce((sum, ab) => sum + (ab.eficiencia || 0), 0) / abastecimentosEmp.length
        : 0;
      
      const ultimoAbastecimento = abastecimentosEmp.length > 0
        ? abastecimentosEmp
            .sort((a, b) => new Date(b.dataAbastecimento).getTime() - new Date(a.dataAbastecimento).getTime())[0]
            .dataAbastecimento
        : '';

      return {
        empilhadeiraId: emp.id,
        modelo: emp.modelo,
        tipo: emp.tipo,
        consumoTotal,
        custoTotal,
        eficienciaConsumo,
        ultimoAbastecimento
      };
    });
  }, [empilhadeiras, abastecimentos]);

  const resumoGeral = useMemo(() => {
    const totalEmpilhadeiras = empilhadeiras.length;
    const empilhadeirasOperacionais = empilhadeiras.filter(e => e.status === StatusEmpilhadeira.OPERACIONAL).length;
    const totalOperacoes = operacoes.length;
    const operacoesAtivas = operacoes.filter(o => o.status === StatusOperacao.EM_ANDAMENTO).length;
    const totalManutencoes = ordemServicos.length;
    const manutencoesAbertas = ordemServicos.filter(os => os.status !== StatusManutencao.CONCLUIDA).length;
    const totalConsumo = abastecimentos.reduce((sum, ab) => sum + ab.quantidadeLitros, 0);
    const totalCustoAbastecimento = abastecimentos.reduce((sum, ab) => sum + ab.custoTotal, 0);
    const totalCustoManutencao = ordemServicos.reduce((sum, os) => sum + (os.custos?.total || 0), 0);
    
    const eficienciaGeral = totalEmpilhadeiras > 0 
      ? empilhadeiras.reduce((sum, e) => sum + e.eficiencia, 0) / totalEmpilhadeiras 
      : 0;
    const disponibilidadeGeral = totalEmpilhadeiras > 0 
      ? (empilhadeirasOperacionais / totalEmpilhadeiras) * 100 
      : 0;

    return {
      totalEmpilhadeiras,
      empilhadeirasOperacionais,
      disponibilidadeGeral,
      totalOperacoes,
      operacoesAtivas,
      totalManutencoes,
      manutencoesAbertas,
      totalConsumo,
      totalCustoAbastecimento,
      totalCustoManutencao,
      custoTotalOperacional: totalCustoAbastecimento + totalCustoManutencao,
      eficienciaGeral
    };
  }, [empilhadeiras, operacoes, ordemServicos, abastecimentos]);

  const getDadosParaGrafico = (tipo: 'eficiencia' | 'custo' | 'consumo' | 'manutencao') => {
    switch (tipo) {
      case 'eficiencia':
        return relatorioEficiencia.map(r => ({
          name: r.empilhadeiraId,
          value: r.eficienciaMedia,
          operacoes: r.operacoesConcluidas
        }));
      
      case 'custo':
        return relatorioConsumo.map(r => ({
          name: r.empilhadeiraId,
          value: r.custoTotal,
          consumo: r.consumoTotal
        }));
      
      case 'consumo':
        return relatorioConsumo.map(r => ({
          name: r.empilhadeiraId,
          value: r.consumoTotal,
          eficiencia: r.eficienciaConsumo
        }));
      
      case 'manutencao':
        return relatorioManutencao.map(r => ({
          name: r.empilhadeiraId,
          pendentes: r.manutencoesPendentes,
          concluidas: r.manutencoesConcluidas,
          custo: r.custoManutencao
        }));
      
      default:
        return [];
    }
  };

  return {
    relatorioEficiencia,
    relatorioManutencao,
    relatorioOperador,
    relatorioConsumo,
    resumoGeral,
    getDadosParaGrafico
  };
};
