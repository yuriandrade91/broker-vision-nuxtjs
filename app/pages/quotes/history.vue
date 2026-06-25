<script setup lang="ts">
import type { CotacaoHistoricoItem } from '~/types/cotation'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('history.pageTitle') })

const { groups, STATUS_LABEL, STATUS_STYLE, statusFilter, statusTabs } = useHistorico()

const { isLoading: pageLoading, trigger: triggerPage } = useLoadingDelay(700, true)
const { isLoading: listLoading, trigger: triggerList } = useLoadingDelay(0)

onMounted(() => triggerPage(800))

const produtoFilter = ref<string>('todos')

const PRODUTO_TABS = computed(() => [
  { value: 'todos', label: t('history.all'), icon: 'i-lucide-layers', count: groups.value.reduce((s, g) => s + g.items.length, 0) },
  ...groups.value.map(g => ({ value: g.produto, label: g.produto, icon: g.icon, count: g.items.length })),
])

const searchQuery = ref('')

watch(searchQuery,   () => { if (!pageLoading.value) triggerList(500) })
watch(produtoFilter, () => { if (!pageLoading.value) triggerList(300) })
watch(statusFilter,  () => { if (!pageLoading.value) triggerList(300) })

const filteredGroups = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()

  return groups.value
    .filter(g => produtoFilter.value === 'todos' || g.produto === produtoFilter.value)
    .map(g => ({
      ...g,
      items: g.items.filter(i => {
        const matchesStatus = statusFilter.value === 'todos' || i.status === statusFilter.value
        const matchesSearch = !q || i.numero.toLowerCase().includes(q) || i.tomador.toLowerCase().includes(q)
        return matchesStatus && matchesSearch
      }),
    }))
    .filter(g => g.items.length > 0)
})

const detailOpen = ref(false)
const selectedQuote = ref<CotacaoHistoricoItem | null>(null)

function openDetail(item: CotacaoHistoricoItem) {
  selectedQuote.value = item
  detailOpen.value = true
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">

    <AppPageHero
      icon="i-lucide-history"
      :title="$t('history.title')"
      :description="$t('history.description')"
    >
      <UButton
        color="neutral"
        class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
        leading-icon="i-lucide-plus"
        to="/quotes/select-product"
      >
        {{ $t('history.newQuote') }}
      </UButton>
    </AppPageHero>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
      <div class="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-100 dark:border-gray-800">
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-gray-800 rounded-lg p-1 flex-wrap">
          <button
            v-for="tab in PRODUTO_TABS"
            :key="tab.value"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
            :class="produtoFilter === tab.value
              ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'"
            @click="produtoFilter = tab.value"
          >
            <UIcon :name="tab.icon" class="w-3.5 h-3.5 shrink-0" />
            {{ tab.label }}
            <span
              class="inline-flex items-center justify-center rounded-full min-w-4.5 h-4.5 px-1 text-[10px] font-bold transition-all"
              :class="produtoFilter === tab.value
                ? 'bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-gray-200'
                : 'bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400'"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <div class="relative shrink-0 w-64">
          <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('history.search')"
            class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <button
            v-if="searchQuery"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
            @click="searchQuery = ''"
          >
            <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Status tabs -->
      <div class="flex items-center gap-1 px-4 py-2.5">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
          :class="statusFilter === tab.value
            ? 'bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-white'
            : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'"
          @click="statusFilter = tab.value"
        >
          {{ tab.label }}
          <span
            class="inline-flex items-center justify-center rounded-full min-w-4.5 h-4.5 px-1 text-[10px] font-bold"
            :class="statusFilter === tab.value
              ? 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-200 shadow-sm'
              : 'bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Skeleton -->
    <template v-if="pageLoading || listLoading">
      <div
        v-for="g in 2"
        :key="g"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="flex items-center gap-3 px-6 py-4 bg-teal-50/70 dark:bg-teal-900/20">
          <USkeleton class="w-10 h-10 rounded-xl" />
          <div class="space-y-1.5">
            <USkeleton class="h-4 w-40" />
            <USkeleton class="h-3 w-24" />
          </div>
        </div>
        <div
          v-for="i in 3"
          :key="i"
          class="px-6 py-4 flex items-center gap-4 border-b border-slate-100 dark:border-gray-800 last:border-0"
        >
          <USkeleton class="h-4 w-28" />
          <USkeleton class="h-4 flex-1" />
          <USkeleton class="h-4 w-28" />
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-5 w-20 rounded-full" />
        </div>
      </div>
    </template>

    <!-- Groups -->
    <template v-else>
      <div
        v-for="group in filteredGroups"
        :key="group.produto"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="flex items-center gap-3 px-6 py-4 bg-teal-50/70 dark:bg-teal-900/20">
          <div class="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center shrink-0">
            <UIcon :name="group.icon" class="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-800 dark:text-white text-sm">{{ group.produto }}</h3>
            <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ group.items.length }} {{ $t('history.quotesCount') }}</p>
          </div>
        </div>

        <div
          v-for="item in group.items"
          :key="item.id"
          class="px-6 py-4 flex items-center gap-4 border-t border-slate-100 dark:border-gray-800 hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
          @click="openDetail(item)"
        >
          <div class="min-w-35">
            <p class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-1">{{ $t('history.columns.number') }}</p>
            <p class="font-mono font-semibold text-slate-700 dark:text-gray-200 text-sm">{{ item.numero }}</p>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-1">{{ $t('history.columns.policyholder') }}</p>
            <p class="font-medium text-slate-800 dark:text-white text-sm truncate">{{ item.tomador }}</p>
          </div>
          <div class="min-w-37.5">
            <p class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-1">{{ $t('history.columns.value') }}</p>
            <p class="font-semibold text-slate-700 dark:text-gray-200 text-sm">{{ formatCurrencyBRL(item.valor) }}</p>
          </div>
          <div class="min-w-27.5">
            <p class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-1">{{ $t('history.columns.date') }}</p>
            <p class="text-slate-500 dark:text-gray-400 text-sm">{{ item.data }}</p>
          </div>
          <div class="flex items-center justify-end min-w-27.5">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border"
              :class="STATUS_STYLE[item.status]"
            >
              {{ $t(STATUS_LABEL[item.status]) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredGroups.length === 0"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 flex flex-col items-center justify-center py-20 text-slate-400 dark:text-gray-500 gap-3"
      >
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center mb-2">
          <UIcon name="i-lucide-search-x" class="w-8 h-8 opacity-50" />
        </div>
        <p class="font-semibold text-slate-500 dark:text-gray-400">{{ $t('history.empty.title') }}</p>
        <p class="text-sm">{{ $t('history.empty.subtitle') }}</p>
        <UButton variant="ghost" color="neutral" class="mt-2" @click="produtoFilter = 'todos'; statusFilter = 'todos'; searchQuery = ''">
          {{ $t('history.clearFilters') }}
        </UButton>
      </div>
    </template>

    <QuotesQuoteDetailModal v-model:open="detailOpen" :quote="selectedQuote" />
  </div>
</template>
