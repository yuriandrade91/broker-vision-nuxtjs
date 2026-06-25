import type { MonthlyData, ProductReport, GeneratedReport, PeriodFilter } from '~/types/report'

const ALL_MONTHLY_DATA: MonthlyData[] = [
  { mes: 'Jul/24', cotacoes: 9,  emitidas: 6,  premio: 98000 },
  { mes: 'Ago/24', cotacoes: 11, emitidas: 8,  premio: 124000 },
  { mes: 'Set/24', cotacoes: 14, emitidas: 10, premio: 163000 },
  { mes: 'Out/24', cotacoes: 10, emitidas: 7,  premio: 131000 },
  { mes: 'Nov/24', cotacoes: 16, emitidas: 12, premio: 198000 },
  { mes: 'Dez/24', cotacoes: 13, emitidas: 9,  premio: 172000 },
  { mes: 'Jan',    cotacoes: 12, emitidas: 9,  premio: 145000 },
  { mes: 'Fev',    cotacoes: 18, emitidas: 14, premio: 212000 },
  { mes: 'Mar',    cotacoes: 22, emitidas: 17, premio: 289000 },
  { mes: 'Abr',    cotacoes: 15, emitidas: 11, premio: 178000 },
  { mes: 'Mai',    cotacoes: 28, emitidas: 22, premio: 360000 },
  { mes: 'Jun',    cotacoes: 24, emitidas: 19, premio: 312000 },
]

const BY_PRODUCT: ProductReport[] = [
  { produto: 'Seguro Garantia', cotacoes: 68, percentual: 57, color: 'bg-teal-500' },
  { produto: 'Seguro Empresarial', cotacoes: 31, percentual: 26, color: 'bg-blue-400' },
  { produto: 'Seguro de Vida', cotacoes: 20, percentual: 17, color: 'bg-purple-400' },
]

const REPORT_TEMPLATES = [
  { titulo: 'Carteira Mensal',            tipo: 'PDF',  icon: 'i-lucide-file-text' },
  { titulo: 'Relatório de Comissões',     tipo: 'XLSX', icon: 'i-lucide-table' },
  { titulo: 'Apólices Vencendo em 30d',  tipo: 'PDF',  icon: 'i-lucide-file-text' },
  { titulo: 'Cotações por Produto',       tipo: 'PDF',  icon: 'i-lucide-pie-chart' },
  { titulo: 'Desempenho de Carteira',     tipo: 'XLSX', icon: 'i-lucide-bar-chart-2' },
  { titulo: 'Tomadores Ativos',           tipo: 'PDF',  icon: 'i-lucide-users' },
]

const _generatedReports = ref<GeneratedReport[]>([
  { id: 1, titulo: 'Carteira Mensal — Junho 2025', tipo: 'PDF', geradoEm: '01/06/2025', icon: 'i-lucide-file-text' },
  { id: 2, titulo: 'Relatório de Comissões — Mai/2025', tipo: 'XLSX', geradoEm: '03/05/2025', icon: 'i-lucide-table' },
  { id: 3, titulo: 'Apólices Vencendo em 30 dias', tipo: 'PDF', geradoEm: '06/06/2025', icon: 'i-lucide-file-text' },
  { id: 4, titulo: 'Cotações por Produto — Jun/2025', tipo: 'PDF', geradoEm: '10/06/2025', icon: 'i-lucide-pie-chart' },
  { id: 5, titulo: 'Desempenho de Carteira — Q2/2025', tipo: 'XLSX', geradoEm: '15/06/2025', icon: 'i-lucide-bar-chart-2' },
  { id: 6, titulo: 'Tomadores Ativos — Jun/2025', tipo: 'PDF', geradoEm: '18/06/2025', icon: 'i-lucide-users' },
  { id: 7, titulo: 'Carteira Mensal — Maio 2025', tipo: 'PDF', geradoEm: '01/05/2025', icon: 'i-lucide-file-text' },
  { id: 8, titulo: 'Relatório de Comissões — Abr/2025', tipo: 'XLSX', geradoEm: '03/04/2025', icon: 'i-lucide-table' },
  { id: 9, titulo: 'Apólices Vencendo em 30 dias — Abr', tipo: 'PDF', geradoEm: '06/04/2025', icon: 'i-lucide-file-text' },
  { id: 10, titulo: 'Cotações por Produto — Abr/2025', tipo: 'PDF', geradoEm: '10/04/2025', icon: 'i-lucide-pie-chart' },
  { id: 11, titulo: 'Desempenho de Carteira — Q1/2025', tipo: 'XLSX', geradoEm: '15/03/2025', icon: 'i-lucide-bar-chart-2' },
  { id: 12, titulo: 'Tomadores Ativos — Mar/2025', tipo: 'PDF', geradoEm: '18/03/2025', icon: 'i-lucide-users' },
])

export function useReports() {
  const allMonthlyData = ref<MonthlyData[]>(ALL_MONTHLY_DATA)
  const byProduct = ref<ProductReport[]>(BY_PRODUCT)
  const generatedReports = _generatedReports
  const periodFilter = ref<PeriodFilter>('6m')

  function generateReport() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const template = REPORT_TEMPLATES[Math.floor(Math.random() * REPORT_TEMPLATES.length)]!
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const mesLabel = `${meses[now.getMonth()]}/${year}`
    generatedReports.value.unshift({
      id: Date.now(),
      titulo: `${template.titulo} — ${mesLabel}`,
      tipo: template.tipo,
      geradoEm: `${day}/${month}/${year}`,
      icon: template.icon,
    })
  }

  const monthlyData = computed(() => {
    const n = periodFilter.value === '3m' ? 3 : periodFilter.value === '6m' ? 6 : 12
    return allMonthlyData.value.slice(-n)
  })

  const maxPremio = computed(() => Math.max(...monthlyData.value.map(d => d.premio)))

  const kpis = computed(() => {
    const base = allMonthlyData.value
    const last = base[base.length - 1]!
    const prev = base[base.length - 2]!
    return {
      cotacoes: last.cotacoes,
      conversao: Math.round((last.emitidas / last.cotacoes) * 100),
      premio: last.premio,
      comissao: Math.round(last.premio * 0.25),
      deltaCotacoes: Math.round(((last.cotacoes - prev.cotacoes) / prev.cotacoes) * 100),
      deltaConversao: Math.round(((last.emitidas / last.cotacoes) - (prev.emitidas / prev.cotacoes)) * 100),
      deltaPremio: Math.round(((last.premio - prev.premio) / prev.premio) * 100),
    }
  })

  return { monthlyData, byProduct, generatedReports, maxPremio, kpis, periodFilter, generateReport }
}
