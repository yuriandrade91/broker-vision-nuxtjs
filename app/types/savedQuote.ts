import type { CotacaoFormData } from '~/types/cotation'

export type SavedQuoteStatus = 'rascunho' | 'em-analise' | 'emitida' | 'cancelada'

export interface SavedQuote {
  id: number
  numero: string
  tomador: string
  cnpj?: string
  produto: string
  valor: number
  etapa: number
  updatedAt: string
  status: SavedQuoteStatus
  numeroApolice?: string
  acompanhando?: boolean
  formData?: Partial<CotacaoFormData>
}
