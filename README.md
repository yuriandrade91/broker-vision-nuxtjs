# BrokerVision — Insurance Broker Dashboard

> Plataforma web para corretores de seguros gerenciarem cotações, apólices, tomadores e relatórios de performance em um único painel.

---

## Visão geral

O BrokerVision é um dashboard SPA construído com **Nuxt 4** e **Nuxt UI v4**, pensado para corretores de seguros que precisam de um ambiente ágil para emitir cotações multi-etapa, acompanhar apólices, gerenciar tomadores e extrair relatórios de desempenho — tudo com suporte a dark mode e internacionalização (PT/EN).

---

## Stack

| Camada                  | Tecnologia                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Framework               | [Nuxt 4](https://nuxt.com) (SSR opcional, `srcDir: app`)                           |
| UI / Estilo             | [Nuxt UI v4](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)     |
| Linguagem               | TypeScript 6                                                                       |
| Internacionalização     | [@nuxtjs/i18n v10](https://i18n.nuxtjs.org) — PT-BR / EN                           |
| Gráficos                | [Chart.js v4](https://www.chartjs.org) + [vue-chartjs v5](https://vue-chartjs.org) |
| Ícones                  | [Lucide](https://lucide.dev) + [Simple Icons](https://simpleicons.org) via Iconify |
| Gerenciamento de estado | Composables com `ref` em escopo de módulo                                          |
| Package manager         | [pnpm](https://pnpm.io)                                                            |
| Linting                 | ESLint + `@nuxt/eslint`                                                            |
| Testes                  | Vitest + Vue Test Utils                                                            |

---

## Funcionalidades

### Autenticação

- Tela de login com validação de campos
- Recuperação de senha (`/forgot`)

### Dashboard (`/home`)

- Cards de métricas em tempo real (cotações, taxa de conversão, prêmio emitido, comissão)
- Ações rápidas por produto (Garantia, Empresarial, Vida)
- Painel de notificações com marcação de leitura e remoção individual

### Cotação multi-etapa (`/quotes/create`)

Fluxo guiado em **4 etapas** com stepper visual:

1. **Cotação** — produto, modalidade, IS, vigência e comissão
2. **Segurado** — dados do segurado principal (nome, CNPJ/CPF, contato)
3. **Risco** — objeto contratual, número de processo e local do risco
4. **Pagamento** — seleção de método (boleto, PIX, cartão) com parcelamento e breakdown financeiro

### Cotações salvas (`/quotes/saved`)

- Listagem com filtro por status (rascunho, em análise, emitida, cancelada)
- Busca livre por tomador ou número
- Ações contextuais por status: continuar rascunho, acompanhar análise, ver apólice, recotar
- Preview detalhado em modal com exportação em PDF

### Histórico (`/quotes/history`)

- Histórico de cotações agrupado por produto
- Detalhe em modal com timeline de status e dados financeiros

### Apólices (`/policies`)

- Tabela de apólices com busca e filtro por status (vigente, vencida, cancelada)
- Modal de detalhe com renovação integrada e download de PDF
- Alerta contextual para apólices vencidas e canceladas

### Tomadores (`/policyholders`)

- CRUD de tomadores com razão social, CNPJ, contato e endereço
- Drawer de detalhe com abas: informações, cotações vinculadas e apólices
- Gráfico de distribuição de status de cotações por tomador
- Cadastro rápido via modal inline

### Relatórios (`/reports`)

- KPIs de período: cotações, conversão, prêmio emitido e comissão estimada
- Gráfico de performance mensal (Chart.js — linha)
- Detalhamento mensal em tabela
- Distribuição de cotações por produto
- Histórico de relatórios gerados com exportação e paginação

### Seções de Produção (`/production-sections`)

- Estrutura preparada para gestão de fluxos operacionais

### Perfil (`/profile`)

- Aba **Dados pessoais**: nome, CRB, bio e endereço
- Aba **Segurança**: troca de senha com medidor de força, 2FA e gestão de sessões
- Aba **Preferências**: idioma, tema (claro/escuro/sistema) e configurações de notificações

---

## Arquitetura

```
├── app/                          # srcDir do Nuxt 4
│   ├── components/
│   │   ├── App*.vue              # Genéricos reutilizáveis (AppDrawer, AppConfirmModal…)
│   │   ├── cotation/             # Etapas e stepper do fluxo de cotação
│   │   ├── policies/             # Modal de detalhe de apólice
│   │   ├── policyholders/        # Drawer de tomador e gráficos
│   │   ├── quotes/               # Modais de prévia, detalhe e pagamento
│   │   └── reports/              # Gráfico de performance
│   │
│   ├── composables/
│   │   ├── useCotationFlow.ts    # Estado global do fluxo de cotação (stepper + form)
│   │   ├── useDashboard.ts       # Métricas e action cards
│   │   ├── useHistorico.ts       # Histórico de cotações
│   │   ├── useLoadingDelay.ts    # Skeleton delay controlado
│   │   ├── useNotifications.ts   # Fila de notificações com mark-as-read
│   │   ├── usePolicies.ts        # Dados e constantes de apólices
│   │   ├── usePolicyholders.ts   # CRUD de tomadores
│   │   ├── useProducts.ts        # Catálogo de produtos e modalidades
│   │   ├── useReports.ts         # Dados e filtros de relatórios
│   │   └── useSavedQuotes.ts     # Cotações salvas com filtro e paginação
│   │
│   ├── layouts/
│   │   └── dashboard.vue         # Layout base com TheHeader
│   │
│   ├── pages/
│   │   ├── index.vue             # Login
│   │   ├── forgot.vue            # Recuperação de senha
│   │   ├── home.vue              # Dashboard principal
│   │   ├── policies.vue          # Gestão de apólices
│   │   ├── policyholders/        # Tomadores + cadastro
│   │   ├── quotes/               # create · history · saved · select-product
│   │   ├── reports.vue           # Relatórios e análises
│   │   ├── production-sections.vue
│   │   ├── cotation-form.vue
│   │   └── profile.vue
│   │
│   ├── services/
│   │   └── api.ts                # Cliente HTTP genérico e tipado (fetch wrapper)
│   │
│   ├── types/
│   │   ├── cotation.ts           # CotacaoFormData, Apolice, Tomador, StatusCotacao…
│   │   ├── dashboard.ts          # ActionCardItem, MetricItem
│   │   ├── notification.ts       # AppNotification
│   │   ├── report.ts             # MonthlyData, ProductReport, PeriodFilter
│   │   └── savedQuote.ts         # SavedQuote, SavedQuoteStatus
│   │
│   └── utils/
│       └── masks.ts              # Formatações (moeda, CNPJ, CEP, telefone)
│
├── i18n/
│   └── locales/
│       ├── en.json               # Inglês
│       └── pt.json               # Português do Brasil (padrão)
│
├── nuxt.config.ts
└── package.json
```

### Decisões de arquitetura

**Estado com composables em escopo de módulo**
O estado compartilhado (cotações salvas, notificações, fluxo de cotação) é gerenciado via `ref()` declarados no topo do arquivo do composable — fora da função exportada. Isso cria um singleton por módulo sem necessidade de Pinia para casos simples.

**Nomenclatura automática de componentes**
O Nuxt auto-importa componentes usando o diretório como prefixo. `app/components/quotes/PaymentMethodsModal.vue` é usado como `<QuotesPaymentMethodsModal>`. Componentes genéricos com prefixo `App` ficam na raiz de `components/`.

**Tipos centralizados em `app/types/`**
Interfaces e tipos são definidos uma única vez em `app/types/` e importados onde necessário — composables, páginas e componentes. Composables não re-exportam tipos; os consumidores importam diretamente da fonte.

**Resolução do i18n**
`@nuxtjs/i18n v10` resolve `langDir` relativo a `<rootDir>/i18n/` (o `restructureDir`). Os arquivos de locale ficam em `i18n/locales/`, fora do `srcDir`.

---

## Temas e i18n

- **Dark mode** nativo via `@nuxt/ui` com `colorMode.preference` (claro / escuro / sistema)
- **Idiomas**: Português (`pt`) e Inglês (`en`), alternáveis em tempo real via `setLocale()`
- Strings dinâmicas com interpolação (`{value}`), listas via `tm()` e e-mails escapados com `{'@'}` para evitar conflito com a sintaxe de linked messages do vue-i18n

---

## Rotas

| Rota                     | Página                | Layout    |
| ------------------------ | --------------------- | --------- |
| `/`                      | Login                 | padrão    |
| `/forgot`                | Recuperação de senha  | padrão    |
| `/home`                  | Dashboard             | dashboard |
| `/quotes/select-product` | Selecionar produto    | dashboard |
| `/quotes/create`         | Fluxo de cotação      | dashboard |
| `/quotes/saved`          | Cotações salvas       | dashboard |
| `/quotes/history`        | Histórico             | dashboard |
| `/policies`              | Apólices              | dashboard |
| `/policyholders`         | Tomadores             | dashboard |
| `/policyholders/create`  | Cadastrar tomador     | dashboard |
| `/reports`               | Relatórios            | dashboard |
| `/production-sections`   | Seções de produção    | dashboard |
| `/cotation-form`         | Formulário de cotação | dashboard |
| `/profile`               | Perfil do usuário     | dashboard |

---

## Começando

### Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9

### Instalação

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
pnpm build
pnpm preview
```

### Verificação de tipos

```bash
pnpm typecheck
```

### Lint

```bash
pnpm lint
```

### Testes

```bash
pnpm test
```
---