import type { SavedQuote, SavedQuoteStatus } from '~/types/savedQuote'

const STEP_LABEL_KEYS = ['', 'savedQuotes.stepLabels.1', 'savedQuotes.stepLabels.2', 'savedQuotes.stepLabels.3', 'savedQuotes.stepLabels.4'] as const

const MOCK_SAVED: SavedQuote[] = [
  // ── Em análise ──────────────────────────────────────────────────────────────
  {
    id: 11,
    numero: 'CT-00487',
    tomador: 'Construtora Alfa LTDA',
    cnpj: '12.345.678/0001-90',
    produto: 'Seguro Garantia',
    valor: 520000,
    etapa: 4,
    status: 'em-analise',
    updatedAt: '05/06/2026',
    formData: {
      nomeTomador: 'Construtora Alfa LTDA',
      cnpjTomador: '12.345.678/0001-90',
      produto: 'garantia',
      modalidade: 'licitante',
      valorTotalIS: 'R$ 520.000,00',
      dataInicio: '01/07/2026',
      dataFim: '01/07/2027',
      comissao: 25.5,
      seguradoNome: 'Construtora Alfa LTDA',
      seguradoCnpjCpf: '12.345.678/0001-90',
      seguradoEmail: 'contato@alfa.com.br',
      seguradoTelefone: '(11) 93456-7890',
      seguradoCep: '01310-100',
      seguradoCidadeUF: 'São Paulo — SP',
      seguradoEndereco: 'Av. Paulista, 1578',
      riscoObjeto: 'Garantia de licitação para obra pública — Lote 3',
      riscoNumeroProcesso: 'PROC-2026-0045',
      riscoValorSegurado: 'R$ 520.000,00',
      riscoLocal: 'Município de São Paulo — SP',
      riscoInicioVigencia: '01/07/2026',
      riscoFimVigencia: '01/07/2027',
    },
  },
  {
    id: 12,
    numero: 'CT-00477',
    tomador: 'Engenharia Beta S.A.',
    cnpj: '23.456.789/0001-01',
    produto: 'Seguro Garantia',
    valor: 320000,
    etapa: 4,
    status: 'em-analise',
    updatedAt: '27/05/2026',
    formData: {
      nomeTomador: 'Engenharia Beta S.A.',
      cnpjTomador: '23.456.789/0001-01',
      produto: 'garantia',
      modalidade: 'trabalhista',
      valorTotalIS: 'R$ 320.000,00',
      dataInicio: '01/07/2026',
      dataFim: '01/07/2027',
      comissao: 22.0,
      seguradoNome: 'Engenharia Beta S.A.',
      seguradoCnpjCpf: '23.456.789/0001-01',
      seguradoEmail: 'adm@beta.com.br',
      seguradoTelefone: '(21) 98765-4321',
      seguradoCep: '20040-020',
      seguradoCidadeUF: 'Rio de Janeiro — RJ',
      seguradoEndereco: 'Av. Rio Branco, 156',
      riscoObjeto: 'Ação trabalhista processo nº 0001234-56.2026',
      riscoNumeroProcesso: '0001234-56.2026.5.01.0001',
      riscoValorSegurado: 'R$ 320.000,00',
      riscoLocal: 'Vara do Trabalho de Niterói — RJ',
      riscoInicioVigencia: '01/07/2026',
      riscoFimVigencia: '01/07/2027',
    },
  },
  {
    id: 13,
    numero: 'CT-00476',
    tomador: 'Infraestrutura Delta LTDA',
    cnpj: '34.567.890/0001-12',
    produto: 'Seguro Garantia',
    valor: 280000,
    etapa: 4,
    status: 'em-analise',
    updatedAt: '25/05/2026',
    formData: {
      nomeTomador: 'Infraestrutura Delta LTDA',
      cnpjTomador: '34.567.890/0001-12',
      produto: 'garantia',
      modalidade: 'licitante',
      valorTotalIS: 'R$ 280.000,00',
      dataInicio: '01/06/2026',
      dataFim: '01/06/2027',
      comissao: 20.0,
      seguradoNome: 'Infraestrutura Delta LTDA',
      seguradoCnpjCpf: '34.567.890/0001-12',
      seguradoEmail: 'financeiro@delta.com.br',
      seguradoTelefone: '(31) 97654-3210',
      seguradoCep: '30112-000',
      seguradoCidadeUF: 'Belo Horizonte — MG',
      seguradoEndereco: 'Av. Afonso Pena, 1000',
      riscoObjeto: 'Licitação pública para infraestrutura viária',
      riscoNumeroProcesso: 'PROC-2026-0031',
      riscoValorSegurado: 'R$ 280.000,00',
      riscoLocal: 'Belo Horizonte — MG',
      riscoInicioVigencia: '01/06/2026',
      riscoFimVigencia: '01/06/2027',
    },
  },
  // ── Emitidas ────────────────────────────────────────────────────────────────
  {
    id: 21,
    numero: 'CT-00478',
    tomador: 'Construtora Alfa LTDA',
    cnpj: '12.345.678/0001-90',
    produto: 'Seguro Garantia',
    valor: 450000,
    etapa: 4,
    status: 'emitida',
    numeroApolice: 'APL-2025-0011',
    updatedAt: '28/05/2026',
    formData: {
      nomeTomador: 'Construtora Alfa LTDA',
      cnpjTomador: '12.345.678/0001-90',
      produto: 'garantia',
      modalidade: 'judicial',
      valorTotalIS: 'R$ 450.000,00',
      dataInicio: '01/06/2026',
      dataFim: '01/06/2027',
      comissao: 25.5,
      seguradoNome: 'Construtora Alfa LTDA',
      seguradoCnpjCpf: '12.345.678/0001-90',
      seguradoEmail: 'contato@alfa.com.br',
      seguradoTelefone: '(11) 93456-7890',
      seguradoCep: '01310-100',
      seguradoCidadeUF: 'São Paulo — SP',
      seguradoEndereco: 'Av. Paulista, 1578',
      riscoObjeto: 'Garantia judicial para ação cível nº 1001234',
      riscoNumeroProcesso: '1001234-55.2025.8.26.0100',
      riscoValorSegurado: 'R$ 450.000,00',
      riscoLocal: '12ª Vara Cível de São Paulo — SP',
      riscoInicioVigencia: '01/06/2026',
      riscoFimVigencia: '01/06/2027',
    },
  },
  {
    id: 22,
    numero: 'CT-00471',
    tomador: 'Mercado Central S.A.',
    cnpj: '56.789.012/0001-34',
    produto: 'Seguro Empresarial',
    valor: 120000,
    etapa: 4,
    status: 'emitida',
    numeroApolice: 'APL-2025-0013',
    updatedAt: '21/05/2026',
    formData: {
      nomeTomador: 'Mercado Central S.A.',
      cnpjTomador: '56.789.012/0001-34',
      produto: 'empresarial',
      modalidade: 'incendio',
      valorTotalIS: 'R$ 120.000,00',
      dataInicio: '01/06/2026',
      dataFim: '01/06/2027',
      comissao: 18.0,
      seguradoNome: 'Mercado Central S.A.',
      seguradoCnpjCpf: '56.789.012/0001-34',
      seguradoEmail: 'comercial@central.com.br',
      seguradoTelefone: '(51) 95432-1098',
      seguradoCep: '90010-080',
      seguradoCidadeUF: 'Porto Alegre — RS',
      seguradoEndereco: 'Av. Borges de Medeiros, 200',
      riscoObjeto: 'Cobertura contra incêndio — galpão central',
      riscoValorSegurado: 'R$ 120.000,00',
      riscoLocal: 'Porto Alegre — RS',
      riscoInicioVigencia: '01/06/2026',
      riscoFimVigencia: '01/06/2027',
    },
  },
  {
    id: 23,
    numero: 'CT-00455',
    tomador: 'Mercado Central S.A.',
    cnpj: '56.789.012/0001-34',
    produto: 'Seguro Garantia',
    valor: 200000,
    etapa: 4,
    status: 'emitida',
    numeroApolice: 'APL-2024-0031',
    updatedAt: '02/05/2026',
    formData: {
      nomeTomador: 'Mercado Central S.A.',
      cnpjTomador: '56.789.012/0001-34',
      produto: 'garantia',
      modalidade: 'trabalhista',
      valorTotalIS: 'R$ 200.000,00',
      dataInicio: '15/05/2026',
      dataFim: '15/05/2027',
      comissao: 20.0,
      seguradoNome: 'Mercado Central S.A.',
      seguradoCnpjCpf: '56.789.012/0001-34',
      seguradoEmail: 'comercial@central.com.br',
      seguradoTelefone: '(51) 95432-1098',
      seguradoCep: '90010-080',
      seguradoCidadeUF: 'Porto Alegre — RS',
      seguradoEndereco: 'Av. Borges de Medeiros, 200',
      riscoObjeto: 'Garantia trabalhista reclamatória nº 0000789',
      riscoNumeroProcesso: '0000789-12.2026.5.04.0001',
      riscoValorSegurado: 'R$ 200.000,00',
      riscoLocal: 'Vara do Trabalho de Porto Alegre — RS',
      riscoInicioVigencia: '15/05/2026',
      riscoFimVigencia: '15/05/2027',
    },
  },
  // ── Canceladas ──────────────────────────────────────────────────────────────
  {
    id: 31,
    numero: 'CT-00462',
    tomador: 'RH Group Consultoria',
    cnpj: '45.678.901/0001-23',
    produto: 'Seguro Garantia',
    valor: 150000,
    etapa: 4,
    status: 'cancelada',
    updatedAt: '10/05/2026',
    formData: {
      nomeTomador: 'RH Group Consultoria',
      cnpjTomador: '45.678.901/0001-23',
      produto: 'garantia',
      modalidade: 'judicial',
      valorTotalIS: 'R$ 150.000,00',
      dataInicio: '01/06/2026',
      dataFim: '01/06/2027',
      comissao: 22.0,
      seguradoNome: 'RH Group Consultoria',
      seguradoCnpjCpf: '45.678.901/0001-23',
      seguradoEmail: 'rh@rhgroup.com.br',
      seguradoTelefone: '(41) 96543-2109',
      seguradoCep: '80010-010',
      seguradoCidadeUF: 'Curitiba — PR',
      seguradoEndereco: 'R. XV de Novembro, 500',
      riscoObjeto: 'Garantia judicial — rescisão contratual',
      riscoNumeroProcesso: '0002345-67.2026.8.16.0001',
      riscoValorSegurado: 'R$ 150.000,00',
      riscoLocal: '3ª Vara Cível de Curitiba — PR',
      riscoInicioVigencia: '01/06/2026',
      riscoFimVigencia: '01/06/2027',
    },
  },
  {
    id: 32,
    numero: 'CT-00441',
    tomador: 'Engenharia Beta S.A.',
    cnpj: '23.456.789/0001-01',
    produto: 'Seguro Garantia',
    valor: 410000,
    etapa: 4,
    status: 'cancelada',
    updatedAt: '14/04/2026',
    formData: {
      nomeTomador: 'Engenharia Beta S.A.',
      cnpjTomador: '23.456.789/0001-01',
      produto: 'garantia',
      modalidade: 'judicial',
      valorTotalIS: 'R$ 410.000,00',
      dataInicio: '01/05/2026',
      dataFim: '01/05/2027',
      comissao: 22.0,
    },
  },
  // ── Rascunhos ───────────────────────────────────────────────────────────────
  {
    id: 1,
    numero: 'RASCUNHO-001',
    tomador: 'Construtora Alfa LTDA',
    cnpj: '12.345.678/0001-90',
    produto: 'Seguro Garantia',
    valor: 450000,
    etapa: 2,
    status: 'rascunho',
    updatedAt: '08/06/2025',
    formData: {
      nomeTomador: 'Construtora Alfa LTDA',
      cnpjTomador: '12.345.678/0001-90',
      produto: 'garantia',
      modalidade: 'judicial',
      valorTotalIS: 'R$ 450.000,00',
      dataInicio: '01/07/2025',
      dataFim: '01/07/2026',
      comissao: 25.5,
    },
  },
  {
    id: 2,
    numero: 'RASCUNHO-002',
    tomador: 'Infraestrutura Delta LTDA',
    cnpj: '34.567.890/0001-12',
    produto: 'Seguro Empresarial',
    valor: 120000,
    etapa: 3,
    status: 'rascunho',
    updatedAt: '07/06/2025',
    formData: {
      nomeTomador: 'Infraestrutura Delta LTDA',
      cnpjTomador: '34.567.890/0001-12',
      produto: 'empresarial',
      modalidade: 'incendio',
      valorTotalIS: 'R$ 120.000,00',
      dataInicio: '15/06/2025',
      dataFim: '15/06/2026',
      comissao: 20.0,
      seguradoNome: 'Infraestrutura Delta LTDA',
      seguradoCnpjCpf: '34.567.890/0001-12',
      seguradoEmail: 'financeiro@delta.com.br',
      seguradoTelefone: '(31) 97654-3210',
      seguradoCep: '30112-000',
      seguradoCidadeUF: 'Belo Horizonte — MG',
      seguradoEndereco: 'Av. Afonso Pena, 1000',
    },
  },
  {
    id: 3,
    numero: 'RASCUNHO-003',
    tomador: 'RH Group Consultoria',
    cnpj: '45.678.901/0001-23',
    produto: 'Seguro de Vida',
    valor: 80000,
    etapa: 1,
    status: 'rascunho',
    updatedAt: '05/06/2025',
    formData: {},
  },
  {
    id: 4,
    numero: 'RASCUNHO-004',
    tomador: 'Engenharia Beta S.A.',
    cnpj: '23.456.789/0001-01',
    produto: 'Seguro Garantia',
    valor: 320000,
    etapa: 4,
    status: 'rascunho',
    updatedAt: '04/06/2025',
    formData: {
      nomeTomador: 'Engenharia Beta S.A.',
      cnpjTomador: '23.456.789/0001-01',
      produto: 'garantia',
      modalidade: 'trabalhista',
      valorTotalIS: 'R$ 320.000,00',
      dataInicio: '01/07/2025',
      dataFim: '01/07/2026',
      comissao: 22.0,
      seguradoNome: 'Engenharia Beta S.A.',
      seguradoCnpjCpf: '23.456.789/0001-01',
      seguradoEmail: 'adm@beta.com.br',
      seguradoTelefone: '(21) 98765-4321',
      seguradoCep: '20040-020',
      seguradoCidadeUF: 'Rio de Janeiro — RJ',
      seguradoEndereco: 'Av. Rio Branco, 156',
      riscoObjeto: 'Ação trabalhista processo nº 0001234-56.2025',
      riscoNumeroProcesso: '0001234-56.2025.5.01.0001',
      riscoValorSegurado: 'R$ 320.000,00',
      riscoLocal: 'Vara do Trabalho de Niterói — RJ',
      riscoInicioVigencia: '01/07/2025',
      riscoFimVigencia: '01/07/2026',
    },
  },
  {
    id: 5,
    numero: 'RASCUNHO-005',
    tomador: 'Mercado Central S.A.',
    cnpj: '56.789.012/0001-34',
    produto: 'Seguro Empresarial',
    valor: 250000,
    etapa: 2,
    status: 'rascunho',
    updatedAt: '03/06/2025',
    formData: {
      nomeTomador: 'Mercado Central S.A.',
      cnpjTomador: '56.789.012/0001-34',
      produto: 'empresarial',
      modalidade: 'multirisco',
      valorTotalIS: 'R$ 250.000,00',
      dataInicio: '01/08/2025',
      dataFim: '01/08/2026',
      comissao: 18.0,
    },
  },
  {
    id: 6,
    numero: 'RASCUNHO-006',
    tomador: 'Logística Omega LTDA',
    cnpj: '67.890.123/0001-45',
    produto: 'Seguro de Vida',
    valor: 500000,
    etapa: 3,
    status: 'rascunho',
    updatedAt: '01/06/2025',
    formData: {
      nomeTomador: 'Logística Omega LTDA',
      cnpjTomador: '67.890.123/0001-45',
      produto: 'vida',
      modalidade: 'morte',
      valorTotalIS: 'R$ 500.000,00',
      dataInicio: '15/07/2025',
      dataFim: '15/07/2026',
      comissao: 30.0,
      seguradoNome: 'Logística Omega LTDA',
      seguradoCnpjCpf: '67.890.123/0001-45',
      seguradoEmail: 'rh@omega.com.br',
      seguradoTelefone: '(11) 94567-8901',
      seguradoCep: '04578-000',
      seguradoCidadeUF: 'São Paulo — SP',
      seguradoEndereco: 'Av. das Nações Unidas, 14401',
    },
  },
  {
    id: 7,
    numero: 'RASCUNHO-007',
    tomador: 'Tech Solutions LTDA',
    cnpj: '78.901.234/0001-56',
    produto: 'Seguro Garantia',
    valor: 180000,
    etapa: 1,
    status: 'rascunho',
    updatedAt: '30/05/2025',
    formData: {},
  },
]

export const STATUS_LABEL: Record<SavedQuoteStatus, string> = {
  rascunho:     'savedQuotes.status.rascunho',
  'em-analise': 'savedQuotes.status.em-analise',
  emitida:      'savedQuotes.status.emitida',
  cancelada:    'savedQuotes.status.cancelada',
}

export const STATUS_STYLE: Record<SavedQuoteStatus, string> = {
  rascunho:   'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  'em-analise': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  emitida:    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
  cancelada:  'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

export const STATUS_ICON: Record<SavedQuoteStatus, string> = {
  rascunho:   'i-lucide-file-clock',
  'em-analise': 'i-lucide-loader-circle',
  emitida:    'i-lucide-shield-check',
  cancelada:  'i-lucide-file-x',
}

export const STATUS_ICON_COLOR: Record<SavedQuoteStatus, string> = {
  rascunho:   'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  'em-analise': 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  emitida:    'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  cancelada:  'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400',
}

const PAGE_SIZE = 5

const saved = ref<SavedQuote[]>(MOCK_SAVED)

export function useSavedQuotes() {
  const { t } = useI18n()
  const statusFilter = ref<SavedQuoteStatus | 'todos'>('todos')
  const search = ref('')
  const page = ref(1)

  const filtered = computed(() => {
    const q = search.value.toLowerCase().trim()
    return saved.value.filter(item => {
      const matchStatus = statusFilter.value === 'todos' || item.status === statusFilter.value
      const matchSearch = !q
        || item.numero.toLowerCase().includes(q)
        || item.tomador.toLowerCase().includes(q)
        || item.produto.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  })

  const paginated = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filtered.value.slice(start, start + PAGE_SIZE)
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

  watch([statusFilter, search], () => { page.value = 1 })

  const counts = computed(() => ({
    todos:       saved.value.length,
    rascunho:    saved.value.filter(q => q.status === 'rascunho').length,
    'em-analise': saved.value.filter(q => q.status === 'em-analise').length,
    emitida:     saved.value.filter(q => q.status === 'emitida').length,
    cancelada:   saved.value.filter(q => q.status === 'cancelada').length,
  }))

  function marcarAcompanhando(id: number) {
    const q = saved.value.find(q => q.id === id)
    if (!q || q.acompanhando) return
    q.acompanhando = true
    q.updatedAt = new Date().toLocaleDateString('pt-BR')
  }

  function pararAcompanhamento(id: number) {
    const q = saved.value.find(q => q.id === id)
    if (!q) return
    q.acompanhando = false
  }

  function remove(id: number) {
    saved.value = saved.value.filter(q => q.id !== id)
  }

  function saveDraft(quote: Omit<SavedQuote, 'id'>) {
    const existing = saved.value.find(q => q.numero === quote.numero)
    if (existing) {
      Object.assign(existing, quote, { updatedAt: new Date().toLocaleDateString('pt-BR') })
    } else {
      saved.value.unshift({ ...quote, id: Date.now() })
    }
  }

  function getStepLabel(etapa: number): string {
    const key = STEP_LABEL_KEYS[etapa]
    return key ? t(key) : ''
  }

  return {
    saved,
    filtered,
    paginated,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    statusFilter,
    search,
    counts,
    remove,
    saveDraft,
    marcarAcompanhando,
    pararAcompanhamento,
    getStepLabel,
  }
}
