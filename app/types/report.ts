export interface MonthlyData {
  mes: string
  cotacoes: number
  emitidas: number
  premio: number
}

export interface ProductReport {
  produto: string
  cotacoes: number
  percentual: number
  color: string
}

export interface GeneratedReport {
  id: number
  titulo: string
  tipo: string
  geradoEm: string
  icon: string
}

export type PeriodFilter = '3m' | '6m' | '12m'
