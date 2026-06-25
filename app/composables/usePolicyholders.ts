import type { Tomador } from '~/types/cotation'

const MOCK_TOMADORES: Tomador[] = [
  {
    id: 1,
    nome: 'Construtora Alfa LTDA',
    cnpj: '12.345.678/0001-90',
    email: 'contato@alfa.com.br',
    telefone: '(11) 93456-7890',
    cotacoes: 4,
    apolices: 4,
    responsavel: 'Carlos Eduardo Silva',
    cargo: 'Gerente Financeiro',
    site: 'www.construtoralfa.com.br',
    cep: '01310-100',
    endereco: 'Av. Paulista, 1578 — Sala 201',
    cidade: 'São Paulo',
    uf: 'SP',
    observacoes: 'Cliente desde 2022. Preferência por boleto bancário. Renovações automáticas aprovadas.',
  },
  {
    id: 2,
    nome: 'Engenharia Beta S.A.',
    cnpj: '23.456.789/0001-01',
    email: 'adm@beta.com.br',
    telefone: '(21) 98765-4321',
    cotacoes: 4,
    apolices: 3,
    responsavel: 'Mariana Costa',
    cargo: 'Diretora Administrativa',
    site: 'www.engenhariabeta.com.br',
    cep: '20040-020',
    endereco: 'Av. Rio Branco, 156 — 12º andar',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    observacoes: 'Exige análise prévia para modalidades judiciais acima de R$ 500k.',
  },
  {
    id: 3,
    nome: 'Infraestrutura Delta LTDA',
    cnpj: '34.567.890/0001-12',
    email: 'financeiro@delta.com.br',
    telefone: '(31) 97654-3210',
    cotacoes: 3,
    apolices: 3,
    responsavel: 'João Paulo Ramos',
    cargo: 'Coordenador de Contratos',
    cep: '30112-000',
    endereco: 'Av. Afonso Pena, 1000 — Bloco B',
    cidade: 'Belo Horizonte',
    uf: 'MG',
  },
  {
    id: 4,
    nome: 'RH Group Consultoria',
    cnpj: '45.678.901/0001-23',
    email: 'rh@rhgroup.com.br',
    telefone: '(41) 96543-2109',
    cotacoes: 3,
    apolices: 3,
    responsavel: 'Fernanda Lopes',
    cargo: 'Sócia-Diretora',
    site: 'www.rhgroup.com.br',
    cep: '80010-010',
    endereco: 'R. XV de Novembro, 500 — Conj. 301',
    cidade: 'Curitiba',
    uf: 'PR',
  },
  {
    id: 5,
    nome: 'Mercado Central S.A.',
    cnpj: '56.789.012/0001-34',
    email: 'comercial@central.com.br',
    telefone: '(51) 95432-1098',
    cotacoes: 4,
    apolices: 3,
    responsavel: 'Roberto Alves',
    cargo: 'CFO',
    site: 'www.mercadocentral.com.br',
    cep: '90010-080',
    endereco: 'Av. Borges de Medeiros, 200 — Torre Sul',
    cidade: 'Porto Alegre',
    uf: 'RS',
    observacoes: 'Preferência por pagamentos via PIX. Contato direto com o CFO para apólices acima de R$ 200k.',
  },
  {
    id: 6,
    nome: 'Logística Omega LTDA',
    cnpj: '67.890.123/0001-45',
    email: 'rh@omega.com.br',
    telefone: '(11) 94567-8901',
    cotacoes: 3,
    apolices: 3,
    responsavel: 'Ana Paula Ferreira',
    cargo: 'Diretora de RH',
    site: 'www.logisticaomega.com.br',
    cep: '04578-000',
    endereco: 'Av. das Nações Unidas, 14401 — Torre A',
    cidade: 'São Paulo',
    uf: 'SP',
    observacoes: 'Contrato corporativo. Frota acima de 200 veículos.',
  },
  {
    id: 7,
    nome: 'Tech Solutions LTDA',
    cnpj: '78.901.234/0001-56',
    email: 'financeiro@techsolutions.com.br',
    telefone: '(11) 93210-9876',
    cotacoes: 2,
    apolices: 3,
    responsavel: 'Lucas Martins',
    cargo: 'CEO',
    cep: '01452-000',
    endereco: 'R. Funchal, 418 — 12º andar',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  {
    id: 8,
    nome: 'Agroindústria Horizonte S.A.',
    cnpj: '89.012.345/0001-67',
    email: 'seguros@horizonte.agr.br',
    telefone: '(65) 99876-5432',
    cotacoes: 2,
    apolices: 2,
    responsavel: 'Marcelo Souza',
    cargo: 'Gerente de Riscos',
    site: 'www.horizonteagro.com.br',
    cep: '78048-000',
    endereco: 'Av. do CPA, 2100 — Bloco 4',
    cidade: 'Cuiabá',
    uf: 'MT',
    observacoes: 'Opera com apólices de grande porte. Exige inspeção in loco para coberturas acima de R$ 1M.',
  },
  {
    id: 9,
    nome: 'Incorporadora Zenith S.A.',
    cnpj: '90.123.456/0001-78',
    email: 'juridico@zenith.com.br',
    telefone: '(21) 97890-1234',
    cotacoes: 2,
    apolices: 2,
    responsavel: 'Patrícia Nunes',
    cargo: 'Diretora Jurídica',
    site: 'www.zenithincorporadora.com.br',
    cep: '22440-040',
    endereco: 'Av. Ataulfo de Paiva, 270 — Sala 901',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    observacoes: 'Atua exclusivamente com garantias judiciais e trabalhistas.',
  },
]

export const tomadores = ref<Tomador[]>(MOCK_TOMADORES)

const PAGE_SIZE = 5

export function usePolicyholders() {
  const search = ref('')
  const page = ref(1)

  const filtered = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return tomadores.value
    return tomadores.value.filter(t =>
      t.nome.toLowerCase().includes(q)
      || t.cnpj.includes(q)
      || t.email.toLowerCase().includes(q)
      || (t.responsavel ?? '').toLowerCase().includes(q)
    )
  })

  const paginated = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filtered.value.slice(start, start + PAGE_SIZE)
  })

  watch(search, () => { page.value = 1 })

  const totalCotacoes = computed(() => tomadores.value.reduce((s, t) => s + t.cotacoes, 0))
  const totalApolices = computed(() => tomadores.value.reduce((s, t) => s + t.apolices, 0))

  function getInitials(nome: string) {
    return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  function update(id: number, data: Partial<Tomador>) {
    const t = tomadores.value.find(t => t.id === id)
    if (t) Object.assign(t, data)
  }

  function create(data: Omit<Tomador, 'id' | 'cotacoes' | 'apolices'>) {
    const nextId = Math.max(...tomadores.value.map(t => t.id)) + 1
    tomadores.value.unshift({ ...data, id: nextId, cotacoes: 0, apolices: 0 })
  }

  return { tomadores, filtered, paginated, page, pageSize: PAGE_SIZE, search, totalCotacoes, totalApolices, getInitials, update, create }
}
