# BrokerVision — Insurance Broker Dashboard

> Web platform for insurance brokers to manage quotes, policies, policyholders, and performance reports in a single dashboard.

---

## Overview

BrokerVision is a SPA dashboard built with **Nuxt 4** and **Nuxt UI v4**, designed for insurance brokers who need an agile environment to issue multi-step quotes, track policies, manage policyholders, and extract performance reports — with full dark mode and internationalization (PT/EN) support.

---

## Stack

| Layer            | Technology                                                                         |
| ---------------- | ---------------------------------------------------------------------------------- |
| Framework        | [Nuxt 4](https://nuxt.com) (optional SSR, `srcDir: app`)                           |
| UI / Styling     | [Nuxt UI v4](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com)     |
| Language         | TypeScript 6                                                                       |
| i18n             | [@nuxtjs/i18n v10](https://i18n.nuxtjs.org) — PT-BR / EN                           |
| Charts           | [Chart.js v4](https://www.chartjs.org) + [vue-chartjs v5](https://vue-chartjs.org) |
| Icons            | [Lucide](https://lucide.dev) + [Simple Icons](https://simpleicons.org) via Iconify |
| State management | Module-scoped composables with `ref`                                               |
| Package manager  | [pnpm](https://pnpm.io)                                                            |
| Linting          | ESLint + `@nuxt/eslint`                                                            |
| Testing          | Vitest + Vue Test Utils                                                            |

---

## Features

### Dashboard (`/home`)

- Real-time metric cards (quotes, conversion rate, issued premium, commission)
- Quick actions per product (Surety, Commercial, Life)
- Notification panel with mark-as-read and individual dismiss

### Multi-step Quote (`/quotes/create`)

Guided flow in **4 steps** with a visual stepper:

1. **Quote** — product, modality, insured amount, validity, and commission
2. **Insured** — main insured data (name, CNPJ/CPF, contact)
3. **Risk** — contractual object, process number, and risk location
4. **Payment** — method selection (boleto, PIX, card) with installments and financial breakdown

### Saved Quotes (`/quotes/saved`)

- List with filter by status (draft, under review, issued, cancelled)
- Free-text search by policyholder or number
- Context actions by status: continue draft, track review, view policy, re-quote
- Detailed preview modal with PDF export

### History (`/quotes/history`)

- Quote history grouped by product
- Detail modal with status timeline and financial data

### Policies (`/policies`)

- Policy table with search and filter by status (active, expired, cancelled)
- Detail modal with integrated renewal and PDF download
- Contextual alert for expired and cancelled policies

### Policyholders (`/policyholders`)

- Policyholder CRUD with company name, CNPJ, contact, and address
- Detail drawer with tabs: info, linked quotes, and policies
- Quote status distribution chart per policyholder
- Quick registration via inline modal

### Reports (`/reports`)

- Period KPIs: quotes, conversion, issued premium, and estimated commission
- Monthly performance chart (Chart.js — line)
- Monthly breakdown table
- Quote distribution by product
- Generated report history with export and pagination

### Production Sections (`/production-sections`)

- Structure ready for operational workflow management

### Profile (`/profile`)

- **Personal info** tab: name, CRB, bio, and address
- **Security** tab: password change with strength meter, 2FA, and session management
- **Preferences** tab: language, theme (light/dark/system), and notification settings

---

## Architecture

```
├── app/                          # Nuxt 4 srcDir
│   ├── components/
│   │   ├── App*.vue              # Reusable generics (AppDrawer, AppConfirmModal…)
│   │   ├── cotation/             # Quote flow steps and stepper
│   │   ├── policies/             # Policy detail modal
│   │   ├── policyholders/        # Policyholder drawer and charts
│   │   ├── quotes/               # Preview, detail, and payment modals
│   │   └── reports/              # Performance chart
│   │
│   ├── composables/
│   │   ├── useCotationFlow.ts    # Global quote flow state (stepper + form)
│   │   ├── useDashboard.ts       # Metrics and action cards
│   │   ├── useHistorico.ts       # Quote history
│   │   ├── useLoadingDelay.ts    # Controlled skeleton delay
│   │   ├── useNotifications.ts   # Notification queue with mark-as-read
│   │   ├── usePolicies.ts        # Policy data and constants
│   │   ├── usePolicyholders.ts   # Policyholder CRUD
│   │   ├── useProducts.ts        # Product and modality catalog
│   │   ├── useReports.ts         # Report data and filters
│   │   └── useSavedQuotes.ts     # Saved quotes with filter and pagination
│   │
│   ├── layouts/
│   │   └── dashboard.vue         # Base layout with TheHeader
│   │
│   ├── pages/
│   │   ├── index.vue             # Login
│   │   ├── forgot.vue            # Password recovery
│   │   ├── home.vue              # Main dashboard
│   │   ├── policies.vue          # Policy management
│   │   ├── policyholders/        # Policyholders + create
│   │   ├── quotes/               # create · history · saved · select-product
│   │   ├── reports.vue           # Reports and analytics
│   │   ├── production-sections.vue
│   │   ├── cotation-form.vue
│   │   └── profile.vue
│   │
│   ├── services/
│   │   └── api.ts                # Generic typed HTTP client (fetch wrapper)
│   │
│   ├── types/
│   │   ├── cotation.ts           # CotacaoFormData, Apolice, Tomador, StatusCotacao…
│   │   ├── dashboard.ts          # ActionCardItem, MetricItem
│   │   ├── notification.ts       # AppNotification
│   │   ├── report.ts             # MonthlyData, ProductReport, PeriodFilter
│   │   └── savedQuote.ts         # SavedQuote, SavedQuoteStatus
│   │
│   └── utils/
│       └── masks.ts              # Formatters (currency, CNPJ, ZIP, phone)
│
├── i18n/
│   └── locales/
│       ├── en.json               # English
│       └── pt.json               # Brazilian Portuguese (default)
│
├── nuxt.config.ts
└── package.json
```

### Architecture decisions

**Module-scoped composable state**
Shared state (saved quotes, notifications, quote flow) is managed via `ref()` declared at the top of the composable file — outside the exported function. This creates a per-module singleton without needing Pinia for simple cases.

**Automatic component naming**
Nuxt auto-imports components using the directory as a prefix. `app/components/quotes/PaymentMethodsModal.vue` is used as `<QuotesPaymentMethodsModal>`. Generic components with the `App` prefix live at the root of `components/`.

**Centralized types in `app/types/`**
Interfaces and types are defined once in `app/types/` and imported where needed — composables, pages, and components. Composables do not re-export types; consumers import directly from the source.

**i18n resolution**
`@nuxtjs/i18n v10` resolves `langDir` relative to `<rootDir>/i18n/` (the `restructureDir`). Locale files live in `i18n/locales/`, outside the `srcDir`.

---

## Themes & i18n

- Native **dark mode** via `@nuxt/ui` with `colorMode.preference` (light / dark / system)
- **Languages**: Portuguese (`pt`) and English (`en`), switchable at runtime via `setLocale()`
- Dynamic strings with interpolation (`{value}`), lists via `tm()`, and emails escaped with `{'@'}` to avoid conflict with vue-i18n linked message syntax

---

## Routes

| Route                    | Page                  | Layout    |
| ------------------------ | --------------------- | --------- |
| `/`                      | Login                 | default   |
| `/forgot`                | Password recovery     | default   |
| `/home`                  | Dashboard             | dashboard |
| `/quotes/select-product` | Select product        | dashboard |
| `/quotes/create`         | Quote flow            | dashboard |
| `/quotes/saved`          | Saved quotes          | dashboard |
| `/quotes/history`        | History               | dashboard |
| `/policies`              | Policies              | dashboard |
| `/policyholders`         | Policyholders         | dashboard |
| `/policyholders/create`  | Create policyholder   | dashboard |
| `/reports`               | Reports               | dashboard |
| `/production-sections`   | Production sections   | dashboard |
| `/cotation-form`         | Cotation form         | dashboard |
| `/profile`               | User profile          | dashboard |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
pnpm build
pnpm preview
```

### Type check

```bash
pnpm typecheck
```

### Lint

```bash
pnpm lint
```

### Tests

```bash
pnpm test
```
