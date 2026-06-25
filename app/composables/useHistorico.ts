import type { HistoricoGroup, StatusCotacao } from '~/types/cotation'

const RAW_DATA: HistoricoGroup[] = [
  {
    produto: 'Seguro Garantia',
    icon: 'i-lucide-shield',
    items: [
      { id: '1',  numero: 'CT-00490', tomador: 'Logística Omega',          cnpj: '67.890.123/0001-45', produto: 'Seguro Garantia',    modalidade: 'Trabalhista',  valor: 175000, premio: 4900,  data: '10/06/2026', status: 'em-analise' },
      { id: '2',  numero: 'CT-00487', tomador: 'Construtora Alfa',         cnpj: '12.345.678/0001-90', produto: 'Seguro Garantia',    modalidade: 'Licitante',    valor: 520000, premio: 14560, data: '05/06/2026', status: 'em-analise' },
      { id: '3',  numero: 'CT-00485', tomador: 'Logística Omega',          cnpj: '67.890.123/0001-45', produto: 'Seguro Garantia',    modalidade: 'Judicial',     valor: 230000, premio: 6440,  data: '02/06/2026', status: 'emitida' },
      { id: '4',  numero: 'CT-00478', tomador: 'Construtora Alfa',         cnpj: '12.345.678/0001-90', produto: 'Seguro Garantia',    modalidade: 'Judicial',     valor: 450000, premio: 12480, data: '28/05/2026', status: 'emitida' },
      { id: '5',  numero: 'CT-00477', tomador: 'Engenharia Beta',          cnpj: '23.456.789/0001-01', produto: 'Seguro Garantia',    modalidade: 'Trabalhista',  valor: 320000, premio: 8910,  data: '27/05/2026', status: 'em-analise' },
      { id: '6',  numero: 'CT-00476', tomador: 'Infraestrutura Delta',     cnpj: '34.567.890/0001-12', produto: 'Seguro Garantia',    modalidade: 'Licitante',    valor: 280000, premio: 7650,  data: '25/05/2026', status: 'em-analise' },
      { id: '7',  numero: 'CT-00469', tomador: 'Construtora Alfa',         cnpj: '12.345.678/0001-90', produto: 'Seguro Garantia',    modalidade: 'Performance',  valor: 600000, premio: 16800, data: '18/05/2026', status: 'emitida' },
      { id: '8',  numero: 'CT-00462', tomador: 'RH Group Consultoria',     cnpj: '45.678.901/0001-23', produto: 'Seguro Garantia',    modalidade: 'Judicial',     valor: 150000, premio: 4200,  data: '10/05/2026', status: 'cancelada' },
      { id: '9',  numero: 'CT-00455', tomador: 'Mercado Central',          cnpj: '56.789.012/0001-34', produto: 'Seguro Garantia',    modalidade: 'Trabalhista',  valor: 200000, premio: 5600,  data: '02/05/2026', status: 'emitida' },
      { id: '10', numero: 'CT-00448', tomador: 'Incorporadora Zenith',     cnpj: '98.765.432/0001-11', produto: 'Seguro Garantia',    modalidade: 'Performance',  valor: 390000, premio: 10920, data: '24/04/2026', status: 'emitida' },
      { id: '11', numero: 'CT-00441', tomador: 'Engenharia Beta',          cnpj: '23.456.789/0001-01', produto: 'Seguro Garantia',    modalidade: 'Judicial',     valor: 410000, premio: 11480, data: '14/04/2026', status: 'cancelada' },
    ],
  },
  {
    produto: 'Seguro Empresarial',
    icon: 'i-lucide-building-2',
    items: [
      { id: '12', numero: 'CT-00488', tomador: 'Tech Solutions',           cnpj: '78.901.234/0001-56', produto: 'Seguro Empresarial', modalidade: 'Responsabilidade Civil', valor: 140000, premio: 3800, data: '08/06/2026', status: 'registrada' },
      { id: '13', numero: 'CT-00483', tomador: 'Agroindústria Horizonte',  cnpj: '89.012.345/0001-67', produto: 'Seguro Empresarial', modalidade: 'Incêndio',     valor: 380000, premio: 10290, data: '04/06/2026', status: 'em-analise' },
      { id: '14', numero: 'CT-00479', tomador: 'Incorporadora Zenith',     cnpj: '98.765.432/0001-11', produto: 'Seguro Empresarial', modalidade: 'Multirisco',   valor: 290000, premio: 7830,  data: '30/05/2026', status: 'emitida' },
      { id: '15', numero: 'CT-00471', tomador: 'Mercado Central',          cnpj: '56.789.012/0001-34', produto: 'Seguro Empresarial', modalidade: 'Incêndio',     valor: 120000, premio: 3220,  data: '21/05/2026', status: 'emitida' },
      { id: '16', numero: 'CT-00468', tomador: 'Engenharia Beta',          cnpj: '23.456.789/0001-01', produto: 'Seguro Empresarial', modalidade: 'Responsabilidade Civil', valor: 95000, premio: 2580, data: '19/05/2026', status: 'em-analise' },
      { id: '17', numero: 'CT-00461', tomador: 'Construtora Alfa',         cnpj: '12.345.678/0001-90', produto: 'Seguro Empresarial', modalidade: 'Multirisco',   valor: 250000, premio: 6800,  data: '08/05/2026', status: 'emitida' },
      { id: '18', numero: 'CT-00453', tomador: 'Infraestrutura Delta',     cnpj: '34.567.890/0001-12', produto: 'Seguro Empresarial', modalidade: 'Incêndio',     valor: 180000, premio: 4900,  data: '28/04/2026', status: 'registrada' },
      { id: '19', numero: 'CT-00447', tomador: 'Mercado Central',          cnpj: '56.789.012/0001-34', produto: 'Seguro Empresarial', modalidade: 'Multirisco',   valor: 310000, premio: 8400,  data: '20/04/2026', status: 'emitida' },
      { id: '20', numero: 'CT-00440', tomador: 'Tech Solutions',           cnpj: '78.901.234/0001-56', produto: 'Seguro Empresarial', modalidade: 'Multirisco',   valor: 220000, premio: 5940,  data: '12/04/2026', status: 'emitida' },
    ],
  },
  {
    produto: 'Seguro de Vida',
    icon: 'i-lucide-heart',
    items: [
      { id: '21', numero: 'CT-00486', tomador: 'RH Group Consultoria',     cnpj: '45.678.901/0001-23', produto: 'Seguro de Vida',     modalidade: 'Morte',        valor: 600000, premio: 4320,  data: '03/06/2026', status: 'em-analise' },
      { id: '22', numero: 'CT-00481', tomador: 'Agroindústria Horizonte',  cnpj: '89.012.345/0001-67', produto: 'Seguro de Vida',     modalidade: 'Invalidez',    valor: 350000, premio: 2520,  data: '29/05/2026', status: 'registrada' },
      { id: '23', numero: 'CT-00465', tomador: 'RH Group Consultoria',     cnpj: '45.678.901/0001-23', produto: 'Seguro de Vida',     modalidade: 'Invalidez',    valor: 80000,  premio: 1150,  data: '15/05/2026', status: 'registrada' },
      { id: '24', numero: 'CT-00458', tomador: 'Engenharia Beta',          cnpj: '23.456.789/0001-01', produto: 'Seguro de Vida',     modalidade: 'Morte',        valor: 500000, premio: 3600,  data: '06/05/2026', status: 'em-analise' },
      { id: '25', numero: 'CT-00450', tomador: 'Mercado Central',          cnpj: '56.789.012/0001-34', produto: 'Seguro de Vida',     modalidade: 'Invalidez',    valor: 250000, premio: 1820,  data: '25/04/2026', status: 'emitida' },
      { id: '26', numero: 'CT-00443', tomador: 'Infraestrutura Delta',     cnpj: '34.567.890/0001-12', produto: 'Seguro de Vida',     modalidade: 'Morte',        valor: 400000, premio: 2900,  data: '14/04/2026', status: 'emitida' },
      { id: '27', numero: 'CT-00436', tomador: 'Logística Omega',          cnpj: '67.890.123/0001-45', produto: 'Seguro de Vida',     modalidade: 'Doenças Graves', valor: 300000, premio: 2160, data: '03/04/2026', status: 'emitida' },
    ],
  },
]

const HISTORICO_STATUS_LABEL: Record<StatusCotacao, string> = {
  'emitida': 'history.status.emitida',
  'em-analise': 'history.status.em-analise',
  'registrada': 'history.status.registrada',
  'cancelada': 'history.status.cancelada',
}

const HISTORICO_STATUS_STYLE: Record<StatusCotacao, string> = {
  'emitida': 'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
  'em-analise': 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'registrada': 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  'cancelada': 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

export function useHistorico() {
  const { t } = useI18n()
  const groups = ref<HistoricoGroup[]>(RAW_DATA)

  const totalCotacoes = computed(() => groups.value.reduce((acc, g) => acc + g.items.length, 0))

  const statusFilter = ref<StatusCotacao | 'todos'>('todos')

  const allItems = computed(() => groups.value.flatMap(g => g.items))

  const statusTabs = computed(() => [
    { value: 'todos'      as const, label: t('history.status.todos'),      count: allItems.value.length },
    { value: 'emitida'   as const, label: t('history.status.emitidas'),    count: allItems.value.filter(i => i.status === 'emitida').length },
    { value: 'em-analise'as const, label: t('history.status.em-analises'), count: allItems.value.filter(i => i.status === 'em-analise').length },
    { value: 'registrada'as const, label: t('history.status.registradas'), count: allItems.value.filter(i => i.status === 'registrada').length },
    { value: 'cancelada' as const, label: t('history.status.canceladas'),  count: allItems.value.filter(i => i.status === 'cancelada').length },
  ])

  return { groups, totalCotacoes, statusFilter, statusTabs, STATUS_LABEL: HISTORICO_STATUS_LABEL, STATUS_STYLE: HISTORICO_STATUS_STYLE }
}
