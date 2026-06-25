import type { Apolice } from '~/types/cotation'

export const POLICY_STATUS_LABEL: Record<'vigente' | 'vencida' | 'cancelada', string> = {
  vigente: 'policies.status.vigente',
  vencida: 'policies.status.vencida',
  cancelada: 'policies.status.cancelada',
}

export const POLICY_STATUS_STYLE: Record<'vigente' | 'vencida' | 'cancelada', string> = {
  vigente: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
  vencida: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  cancelada: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

const MOCK_POLICIES: Apolice[] = [
  { numero: 'APL-2026-0004', tomador: 'Logística Omega S.A.',        produto: 'Seguro Garantia',        modalidade: 'Judicial',                status: 'vigente',   dataInicio: '01/06/2026', dataFim: '01/06/2027', premio: 6440 },
  { numero: 'APL-2026-0003', tomador: 'Incorporadora Zenith LTDA',   produto: 'Seguro Garantia',        modalidade: 'Performance',             status: 'vigente',   dataInicio: '15/05/2026', dataFim: '15/05/2027', premio: 10920 },
  { numero: 'APL-2026-0002', tomador: 'Tech Solutions LTDA',         produto: 'Seguro Empresarial',     modalidade: 'Multirisco',              status: 'vigente',   dataInicio: '01/05/2026', dataFim: '01/05/2027', premio: 5940 },
  { numero: 'APL-2026-0001', tomador: 'Agroindústria Horizonte S.A.',produto: 'Seguro Empresarial',     modalidade: 'Incêndio',                status: 'vigente',   dataInicio: '10/04/2026', dataFim: '10/04/2027', premio: 10290 },
  { numero: 'APL-2025-0022', tomador: 'Construtora Alfa LTDA',       produto: 'Seguro Garantia',        modalidade: 'Licitante',               status: 'vigente',   dataInicio: '01/07/2025', dataFim: '01/07/2026', premio: 14560, renovadaEm: '18/06/2026 às 09:14' },
  { numero: 'APL-2025-0021', tomador: 'Logística Omega S.A.',        produto: 'Seguro de Vida',         modalidade: 'Doenças Graves',          status: 'vigente',   dataInicio: '15/06/2025', dataFim: '15/06/2026', premio: 2160 },
  { numero: 'APL-2025-0020', tomador: 'Incorporadora Zenith LTDA',   produto: 'Seguro Empresarial',     modalidade: 'Multirisco',              status: 'vigente',   dataInicio: '01/06/2025', dataFim: '01/06/2026', premio: 7830 },
  { numero: 'APL-2025-0019', tomador: 'Tech Solutions LTDA',         produto: 'Seguro Empresarial',     modalidade: 'Responsabilidade Civil',  status: 'vigente',   dataInicio: '10/05/2025', dataFim: '10/05/2026', premio: 3800 },
  { numero: 'APL-2025-0018', tomador: 'Mercado Central S.A.',        produto: 'Seguro de Vida',         modalidade: 'Invalidez',               status: 'vigente',   dataInicio: '15/06/2025', dataFim: '15/06/2026', premio: 8750 },
  { numero: 'APL-2025-0017', tomador: 'Engenharia Beta S.A.',        produto: 'Seguro Garantia',        modalidade: 'Judicial',                status: 'vigente',   dataInicio: '01/06/2025', dataFim: '01/06/2026', premio: 41200 },
  { numero: 'APL-2025-0016', tomador: 'Construtora Alfa LTDA',       produto: 'Seguro Empresarial',     modalidade: 'Roubo',                   status: 'vigente',   dataInicio: '15/05/2025', dataFim: '15/05/2026', premio: 11400, renovadaEm: '21/06/2026 às 16:47' },
  { numero: 'APL-2025-0015', tomador: 'RH Group Consultoria',        produto: 'Seguro de Vida',         modalidade: 'Morte',                   status: 'vigente',   dataInicio: '01/05/2025', dataFim: '01/05/2026', premio: 6300 },
  { numero: 'APL-2025-0014', tomador: 'Infraestrutura Delta LTDA',   produto: 'Seguro Garantia',        modalidade: 'Aduaneira',               status: 'vigente',   dataInicio: '10/04/2025', dataFim: '10/04/2026', premio: 24100 },
  { numero: 'APL-2025-0013', tomador: 'Mercado Central S.A.',        produto: 'Seguro Empresarial',     modalidade: 'Incêndio',                status: 'vigente',   dataInicio: '01/04/2025', dataFim: '01/04/2026', premio: 9200 },
  { numero: 'APL-2025-0012', tomador: 'Engenharia Beta S.A.',        produto: 'Seguro Garantia',        modalidade: 'Trabalhista',             status: 'vigente',   dataInicio: '15/03/2025', dataFim: '15/03/2026', premio: 32000 },
  { numero: 'APL-2025-0011', tomador: 'Construtora Alfa LTDA',       produto: 'Seguro Garantia',        modalidade: 'Judicial',                status: 'vigente',   dataInicio: '01/03/2025', dataFim: '01/03/2026', premio: 18500 },
  { numero: 'APL-2024-0044', tomador: 'Agroindústria Horizonte S.A.',produto: 'Seguro de Vida',         modalidade: 'Invalidez',               status: 'vencida',   dataInicio: '01/04/2024', dataFim: '01/04/2025', premio: 2520, renovadaEm: '20/06/2026 às 11:03' },
  { numero: 'APL-2024-0043', tomador: 'Logística Omega S.A.',        produto: 'Seguro Garantia',        modalidade: 'Trabalhista',             status: 'vencida',   dataInicio: '15/03/2024', dataFim: '15/03/2025', premio: 4900 },
  { numero: 'APL-2024-0041', tomador: 'RH Group Consultoria',        produto: 'Seguro de Vida',         modalidade: 'Invalidez',               status: 'vencida',   dataInicio: '01/06/2024', dataFim: '01/06/2025', premio: 4800 },
  { numero: 'APL-2024-0039', tomador: 'Infraestrutura Delta LTDA',   produto: 'Seguro Empresarial',     modalidade: 'Incêndio',                status: 'vencida',   dataInicio: '15/04/2024', dataFim: '15/04/2025', premio: 7600 },
  { numero: 'APL-2024-0031', tomador: 'Mercado Central S.A.',        produto: 'Seguro Garantia',        modalidade: 'Trabalhista',             status: 'vencida',   dataInicio: '01/03/2024', dataFim: '01/03/2025', premio: 15200 },
  { numero: 'APL-2024-0035', tomador: 'Infraestrutura Delta LTDA',   produto: 'Seguro Garantia',        modalidade: 'Aduaneira',               status: 'cancelada', dataInicio: '01/01/2024', dataFim: '01/01/2025', premio: 11200 },
  { numero: 'APL-2024-0028', tomador: 'Construtora Alfa LTDA',       produto: 'Seguro de Vida',         modalidade: 'Doenças Graves',          status: 'cancelada', dataInicio: '15/02/2024', dataFim: '15/02/2025', premio: 3900 },
  { numero: 'APL-2023-0097', tomador: 'Tech Solutions LTDA',         produto: 'Seguro Empresarial',     modalidade: 'Responsabilidade Civil',  status: 'cancelada', dataInicio: '01/09/2023', dataFim: '01/09/2024', premio: 2900 },
  { numero: 'APL-2023-0089', tomador: 'Engenharia Beta S.A.',        produto: 'Seguro Empresarial',     modalidade: 'Responsabilidade Civil',  status: 'cancelada', dataInicio: '01/08/2023', dataFim: '01/08/2024', premio: 22100 },
  { numero: 'APL-2023-0071', tomador: 'RH Group Consultoria',        produto: 'Seguro Garantia',        modalidade: 'Judicial',                status: 'cancelada', dataInicio: '01/05/2023', dataFim: '01/05/2024', premio: 9800 },
]

const PAGE_SIZE = 10

// Estado compartilhado entre todas as instâncias do composable
const _policies = ref<Apolice[]>(MOCK_POLICIES)

const PRODUTO_ICONS: Record<string, string> = {
  'Seguro Garantia':    'i-lucide-shield',
  'Seguro Empresarial': 'i-lucide-building-2',
  'Seguro de Vida':     'i-lucide-heart',
}

export function usePolicies() {
  const { t } = useI18n()
  const policies = _policies
  const statusFilter = ref('todos')
  const produtoFilter = ref('todos')
  const search = ref('')
  const page = ref(1)

  const filtered = computed(() =>
    policies.value.filter(p => {
      const matchesStatus  = statusFilter.value  === 'todos' || p.status  === statusFilter.value
      const matchesProduto = produtoFilter.value === 'todos' || p.produto === produtoFilter.value
      const q = search.value.toLowerCase()
      const matchesSearch = !q
        || p.numero.toLowerCase().includes(q)
        || p.tomador.toLowerCase().includes(q)
        || p.produto.toLowerCase().includes(q)
        || p.modalidade.toLowerCase().includes(q)
      return matchesStatus && matchesProduto && matchesSearch
    })
  )

  const paginated = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filtered.value.slice(start, start + PAGE_SIZE)
  })

  // Reseta página ao filtrar
  watch([search, statusFilter, produtoFilter], () => { page.value = 1 })

  const produtoTabs = computed(() => {
    const produtos = [...new Set(policies.value.map(p => p.produto))]
    return [
      { value: 'todos', label: t('history.status.todos'), icon: 'i-lucide-layers', count: policies.value.length },
      ...produtos.map(prod => ({
        value: prod,
        label: prod,
        icon: PRODUTO_ICONS[prod] ?? 'i-lucide-file',
        count: policies.value.filter(p => p.produto === prod).length,
      })),
    ]
  })

  const vigentes = computed(() => policies.value.filter(p => p.status === 'vigente').length)

  const premioTotal = computed(() =>
    policies.value.filter(p => p.status === 'vigente').reduce((s, p) => s + p.premio, 0)
  )

  const statusOptions = [
    ['todos', 'Todos'],
    ['vigente', 'Vigentes'],
    ['vencida', 'Vencidas'],
    ['cancelada', 'Canceladas'],
  ] as const

  const statusTabs = computed(() => [
    { value: 'todos',     label: t('history.status.todos'),      count: policies.value.length },
    { value: 'vigente',   label: t('policies.status.vigente'),   count: policies.value.filter(p => p.status === 'vigente').length },
    { value: 'vencida',   label: t('policies.status.vencida'),   count: policies.value.filter(p => p.status === 'vencida').length },
    { value: 'cancelada', label: t('policies.status.cancelada'), count: policies.value.filter(p => p.status === 'cancelada').length },
  ])

  function renovar(numero: string) {
    const policy = policies.value.find(p => p.numero === numero)
    if (!policy) return
    const now = new Date()
    const date = now.toLocaleDateString('pt-BR')
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    policy.renovadaEm = `${date} às ${time}`
  }

  return {
    policies,
    filtered,
    paginated,
    page,
    pageSize: PAGE_SIZE,
    statusFilter,
    produtoFilter,
    produtoTabs,
    search,
    vigentes,
    premioTotal,
    statusOptions,
    statusTabs,
    renovar,
  }
}
