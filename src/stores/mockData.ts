
import {
  TipoEmpilhadeira,
  StatusEmpilhadeira,
  FuncaoOperador,
  StatusOperador,
  StatusOperacao,
  TipoOperacao,
  TipoManutencao,
  StatusManutencao,
  PrioridadeOperacao
} from "@/types";

export const empilhadeiras = [
  {
    id: "E-001",
    modelo: "Hyster H2.5FT",
    marca: "Hyster",
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.OPERACIONAL,
    capacidade: 2500,
    anoFabricacao: 2019,
    dataAquisicao: "2019-06-10",
    numeroSerie: "HYSH2.5-0001",
    horimetro: 3700,
    ultimaManutencao: "2024-05-10",
    proximaManutencao: "2024-11-10",
    localizacaoAtual: "Armazém 1",
    setor: "Logística",
    operadorAtual: "O-001",
    custoHora: 120,
    eficiencia: 87,
    disponibilidade: 98,
    qrCode: "QRE001",
    observacoes: "Empilhadeira principal do setor.",
  },
  {
    id: "E-002",
    modelo: "Toyota 8FGCU25",
    marca: "Toyota",
    tipo: TipoEmpilhadeira.GAS,
    status: StatusEmpilhadeira.PARADA,
    capacidade: 2500,
    anoFabricacao: 2021,
    dataAquisicao: "2021-01-15",
    numeroSerie: "TYT8FG-0002",
    horimetro: 1200,
    ultimaManutencao: "2024-05-21",
    proximaManutencao: "2024-12-21",
    localizacaoAtual: "Armazém 2",
    setor: "Produção",
    eficiencia: 76,
    disponibilidade: 77,
    custoHora: 110,
    qrCode: "QRE002",
    observacoes: "Aguardando manutenção corretiva.",
  }
];

export const operadores = [
  {
    id: "O-001",
    nome: "Ana Silva",
    cpf: "123.456.789-00",
    email: "ana.silva@email.com",
    telefone: "11999999999",
    funcao: FuncaoOperador.OPERADOR,
    dataAdmissao: "2022-02-17",
    turno: "Manhã",
    setor: "Logística",
    certificacoes: [],
    avaliacoes: [],
    horasTrabalhadas: 1800,
    produtividade: 97,
    status: StatusOperador.ATIVO,
  },
  {
    id: "O-002",
    nome: "Carlos Dias",
    cpf: "987.654.321-00",
    email: "carlos.dias@email.com",
    telefone: "11988888888",
    funcao: FuncaoOperador.OPERADOR,
    dataAdmissao: "2021-11-02",
    turno: "Noite",
    setor: "Produção",
    certificacoes: [],
    avaliacoes: [],
    horasTrabalhadas: 2100,
    produtividade: 92,
    status: StatusOperador.ATIVO,
  }
];

export const operacoes = [
  {
    id: "OP-101",
    empilhadeiraId: "E-001",
    empilhadeira: empilhadeiras[0],
    operadorId: "O-001",
    operador: operadores[0],
    tipo: TipoOperacao.MOVIMENTACAO,
    status: StatusOperacao.EM_ANDAMENTO,
    prioridade: PrioridadeOperacao.NORMAL,
    setor: "Logística",
    localizacao: "Doca 3",
    dataInicio: new Date().toISOString(),
    duracaoEstimada: 40,
    produtividade: 90,
  }
];

export const ordemServicos = [
  {
    id: "OS-001",
    empilhadeiraId: "E-002",
    empilhadeira: empilhadeiras[1],
    tipo: TipoManutencao.CORRETIVA,
    status: StatusManutencao.EM_ANDAMENTO,
    prioridade: PrioridadeOperacao.CRITICA,
    problema: "Vazamento de óleo",
    dataAbertura: new Date().toISOString(),
    custos: {
      pecas: 200,
      maoObra: 400,
      terceiros: 0,
      total: 600
    },
    pecasUtilizadas: [],
    anexos: [],
  },
];

export const abastecimentos = [
  {
    id: "AB-001",
    empilhadeiraId: "E-001",
    empilhadeira: empilhadeiras[0],
    operadorId: "O-001",
    operador: operadores[0],
    dataAbastecimento: new Date().toISOString(),
    horimetroInicial: 3700,
    quantidadeLitros: 25,
    custoTotal: 160,
    precoLitro: 6.40,
    fornecedor: "Posto Shell",
    localAbastecimento: "Base Logística"
  }
];
