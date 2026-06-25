<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('reports.pageTitle') })

import type { PeriodFilter } from '~/types/report'

const { monthlyData, byProduct, generatedReports, kpis, periodFilter, generateReport } = useReports()
const toast = useToast()

const reportsPage = ref(1)
const reportsPageSize = 5
const reportsLoading = ref(false)

const paginatedReports = computed(() =>
  generatedReports.value.slice((reportsPage.value - 1) * reportsPageSize, reportsPage.value * reportsPageSize)
)

function handleGenerateNew() {
  reportsLoading.value = true
  setTimeout(() => {
    generateReport()
    reportsPage.value = 1
    reportsLoading.value = false
    toast.add({
      title: t('reports.toast.generateTitle'),
      description: t('reports.toast.generateDesc'),
      color: 'success',
      icon: 'i-lucide-file-plus',
    })
  }, 800)
}

function handleExportReport(titulo?: string) {
  toast.add({
    title: t('reports.toast.exportTitle'),
    description: titulo
      ? t('reports.toast.exportDesc', { name: titulo })
      : t('reports.toast.exportDescFull'),
    color: 'success',
    icon: 'i-lucide-download',
  })
}

const PERIOD_OPTIONS = computed<{ label: string; value: PeriodFilter }[]>(() => [
  { label: t('reports.periods.3m'), value: '3m' },
  { label: t('reports.periods.6m'), value: '6m' },
  { label: t('reports.periods.12m'), value: '12m' },
])

const { isLoading, trigger } = useLoadingDelay(700, true)
onMounted(() => trigger(900))
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">

    <AppPageHero
      icon="i-lucide-bar-chart-2"
      :category="$t('reports.category')"
      :title="$t('reports.title')"
      :description="$t('reports.description')"
    >
      <UButton
        color="neutral"
        class="bg-[#0b2540] hover:bg-[#0d2e50] text-white rounded-full"
        leading-icon="i-lucide-download"
        @click="handleExportReport()"
      >
        {{ $t('reports.export') }}
      </UButton>
    </AppPageHero>

    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-4">
      <template v-if="isLoading">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5 space-y-3"
        >
          <USkeleton class="w-10 h-10 rounded-full" />
          <div class="space-y-2 pt-1">
            <USkeleton class="h-2.5 w-24" />
            <USkeleton class="h-8 w-16" />
            <USkeleton class="h-2.5 w-32" />
          </div>
        </div>
      </template>
      <template v-else>
        <AppStatCard
          icon="i-lucide-file-text"
          :label="$t('reports.kpis.quotesMonth')"
          :value="kpis.cotacoes"
          :subtitle="$t('reports.kpis.deltaPercent', { sign: kpis.deltaCotacoes >= 0 ? '+' : '', value: kpis.deltaCotacoes })"
          color="slate"
        />
        <AppStatCard
          icon="i-lucide-trending-up"
          :label="$t('reports.kpis.conversionRate')"
          :value="`${kpis.conversao}%`"
          :subtitle="$t('reports.kpis.deltaPp', { sign: kpis.deltaConversao >= 0 ? '+' : '', value: kpis.deltaConversao })"
          color="teal"
        />
        <AppStatCard
          icon="i-lucide-wallet"
          :label="$t('reports.kpis.issuedPremium')"
          :value="formatCurrencyBRL(kpis.premio).replace('R$\xa0', 'R$ ')"
          :subtitle="$t('reports.kpis.deltaPercent', { sign: kpis.deltaPremio >= 0 ? '+' : '', value: kpis.deltaPremio })"
          color="slate"
        />
        <AppStatCard
          icon="i-lucide-percent"
          :label="$t('reports.kpis.generatedCommission')"
          :value="formatCurrencyBRL(kpis.comissao).replace('R$\xa0', 'R$ ')"
          :subtitle="$t('reports.kpis.estimated')"
          color="indigo"
        />
      </template>
    </div>

    <!-- Performance chart -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
      <div class="flex items-center justify-between mb-5">
        <div>
          <p class="font-semibold text-slate-800 dark:text-white">{{ $t('reports.performance.title') }}</p>
          <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('reports.performance.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            v-for="opt in PERIOD_OPTIONS"
            :key="opt.value"
            class="px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer"
            :class="periodFilter === opt.value
              ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'"
            @click="periodFilter = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
      <div class="h-72">
        <USkeleton v-if="isLoading" class="h-full w-full rounded-xl" />
        <ClientOnly v-else>
          <ReportsPerformanceChart :data="monthlyData" />
          <template #fallback>
            <div class="h-full flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm">
              <UIcon name="i-lucide-loader-circle" class="w-5 h-5 animate-spin mr-2" />
              {{ $t('reports.performance.loading') }}
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <div class="grid grid-cols-[1fr_300px] gap-5">
      <!-- Monthly breakdown -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 dark:border-gray-800">
          <p class="font-semibold text-slate-700 dark:text-gray-200">{{ $t('reports.monthly.title') }}</p>
        </div>
        <table class="w-full text-sm table-fixed">
          <colgroup>
            <col style="width:30%" />
            <col style="width:15%" />
            <col style="width:15%" />
            <col style="width:15%" />
            <col style="width:25%" />
          </colgroup>
          <thead>
            <tr class="border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/50">
              <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('reports.monthly.month') }}</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('reports.monthly.quotes') }}</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('reports.monthly.issued') }}</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('reports.monthly.conversion') }}</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('reports.monthly.premium') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr v-for="i in 6" :key="i" class="border-b border-slate-50 dark:border-gray-800 last:border-0">
                <td class="px-5 py-3"><USkeleton class="h-4 w-16" /></td>
                <td class="px-4 py-3 text-right"><div class="flex justify-end"><USkeleton class="h-4 w-8" /></div></td>
                <td class="px-4 py-3 text-right"><div class="flex justify-end"><USkeleton class="h-4 w-8" /></div></td>
                <td class="px-4 py-3 text-right"><div class="flex justify-end"><USkeleton class="h-4 w-12" /></div></td>
                <td class="px-5 py-3 text-right"><div class="flex justify-end"><USkeleton class="h-4 w-24" /></div></td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="d in monthlyData"
                :key="d.mes"
                class="border-b border-slate-50 dark:border-gray-800 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-colors last:border-0"
              >
                <td class="px-5 py-3 font-medium text-slate-700 dark:text-gray-200">{{ d.mes }}/2025</td>
                <td class="px-4 py-3 text-right text-slate-700 dark:text-gray-200">{{ d.cotacoes }}</td>
                <td class="px-4 py-3 text-right text-slate-700 dark:text-gray-200">{{ d.emitidas }}</td>
                <td class="px-4 py-3 text-right">
                  <span class="font-medium text-teal-600 dark:text-teal-400">{{ Math.round(d.emitidas / d.cotacoes * 100) }}%</span>
                </td>
                <td class="px-5 py-3 text-right font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(d.premio) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Quotes by product -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
        <p class="text-sm font-semibold text-slate-700 dark:text-gray-200 mb-4">{{ $t('reports.byProduct') }}</p>
        <div class="space-y-4">
          <template v-if="isLoading">
            <div v-for="i in 3" :key="i" class="space-y-2">
              <div class="flex justify-between items-center">
                <USkeleton class="h-3.5 w-32" />
                <USkeleton class="h-3.5 w-8" />
              </div>
              <USkeleton class="h-2 w-full rounded-full" />
              <USkeleton class="h-3 w-20" />
            </div>
          </template>
          <template v-else>
            <div v-for="item in byProduct" :key="item.produto">
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-sm text-slate-700 dark:text-gray-200">{{ item.produto }}</span>
                <span class="text-sm font-semibold text-slate-800 dark:text-white">{{ item.percentual }}%</span>
              </div>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-gray-700 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="item.color"
                  :style="{ width: `${item.percentual}%` }"
                />
              </div>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">{{ $t('reports.quotesCount', { count: item.cotacoes }) }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Generated reports -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-800">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
            <UIcon name="i-lucide-folder-open" class="w-4 h-4 text-slate-500 dark:text-gray-400" />
          </div>
          <p class="font-semibold text-slate-700 dark:text-gray-200">{{ $t('reports.generated.title') }}</p>
        </div>
        <UButton
          variant="ghost"
          size="sm"
          color="neutral"
          :loading="reportsLoading"
          :disabled="reportsLoading"
          leading-icon="i-lucide-file-plus"
          @click="handleGenerateNew"
        >
          {{ $t('reports.generated.generateNew') }}
        </UButton>
      </div>
      <div class="divide-y divide-slate-50 dark:divide-gray-800">
        <template v-if="isLoading || reportsLoading">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4 px-5 py-4">
            <USkeleton class="w-9 h-9 rounded-lg shrink-0" />
            <div class="flex-1 space-y-1.5">
              <USkeleton class="h-4 w-56" />
              <USkeleton class="h-3 w-32" />
            </div>
            <USkeleton class="h-5 w-10 rounded" />
            <USkeleton class="h-8 w-8 rounded-lg" />
          </div>
        </template>
        <template v-else>
          <div
            v-for="report in paginatedReports"
            :key="report.id"
            class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <UIcon :name="report.icon" class="w-4 h-4 text-slate-500 dark:text-gray-400" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-slate-800 dark:text-white text-sm">{{ report.titulo }}</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('reports.generated.generatedOn', { date: report.geradoEm }) }}</p>
            </div>
            <span class="text-xs font-bold text-slate-400 dark:text-gray-500 bg-slate-100 dark:bg-gray-800 rounded px-2 py-0.5">{{ report.tipo }}</span>
            <UButton size="sm" variant="ghost" color="neutral" icon="i-lucide-download" @click="handleExportReport(report.titulo)" />
          </div>
        </template>
      </div>

      <!-- Paginação -->
      <div v-if="!isLoading && !reportsLoading && generatedReports.length > reportsPageSize" class="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-gray-800">
        <p class="text-sm text-slate-500 dark:text-gray-400">
          {{ $t('policyholders.showing', {
            from: (reportsPage - 1) * reportsPageSize + 1,
            to: Math.min(reportsPage * reportsPageSize, generatedReports.length),
            total: generatedReports.length
          }) }}
        </p>
        <UPagination
          v-model:page="reportsPage"
          :sibling-count="1"
          :total="generatedReports.length"
          :items-per-page="reportsPageSize"
        />
      </div>
    </div>
  </div>
</template>
