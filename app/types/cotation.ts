export interface CotacaoFormData {
  // Step 1 — Cotação
  tomadorSearch: string
  nomeTomador: string
  cnpjTomador: string
  produto: string
  modalidade: string
  acrescimo: string
  valorTotalIS: string
  dataInicio: string
  dataFim: string
  agravo: string
  comissao: number

  // Step 2 — Segurado
  seguradoNome: string
  seguradoCnpjCpf: string
  seguradoEmail: string
  seguradoTelefone: string
  seguradoCep: string
  seguradoCidadeUF: string
  seguradoEndereco: string

  // Step 3 — Risco
  riscoObjeto: string
  riscoNumeroProcesso: string
  riscoValorSegurado: string
  riscoLocal: string
  riscoInicioVigencia: string
  riscoFimVigencia: string
  riscoObservacoes: string

  // Step 4 — Pagamento
  metodoPagamento: 'boleto' | 'pix' | 'cartao' | ''
}

export interface StepDefinition {
  number: 1 | 2 | 3 | 4
  title: string
  subtitle: string
  icon: string
}

export type StatusCotacao = 'emitida' | 'em-analise' | 'registrada' | 'cancelada'

export interface CotacaoHistoricoItem {
  id: string
  numero: string
  tomador: string
  cnpj?: string
  produto?: string
  modalidade?: string
  valor: number
  premio?: number
  data: string
  status: StatusCotacao
}

export interface HistoricoGroup {
  produto: string
  icon: string
  items: CotacaoHistoricoItem[]
}

export interface PaymentMethod {
  id: 'boleto' | 'pix' | 'cartao'
  label: string
  description: string
  recommended?: boolean
  icon: string
}

export interface ValidationErrors {
  [field: string]: string
}

export interface Tomador {
  id: number
  nome: string
  cnpj: string
  email: string
  telefone: string
  cotacoes: number
  apolices: number
  // campos estendidos
  responsavel?: string
  cargo?: string
  site?: string
  cep?: string
  endereco?: string
  cidade?: string
  uf?: string
  observacoes?: string
}

export interface Apolice {
  numero: string
  tomador: string
  produto: string
  modalidade: string
  status: 'vigente' | 'vencida' | 'cancelada'
  dataInicio: string
  dataFim: string
  premio: number
  renovadaEm?: string
}
