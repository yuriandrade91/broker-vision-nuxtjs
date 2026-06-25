<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('dashboard.pageTitle') })

const { actionCards, metrics } = useDashboard()

const today = new Date().toLocaleDateString('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
})

const { isLoading, trigger } = useLoadingDelay(700, true)
onMounted(() => trigger(700))
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">
    <p class="text-sm text-slate-500 dark:text-gray-400">{{ $t('dashboard.breadcrumb') }}</p>

    <DashboardHero
      :title="$t('dashboard.title')"
      :subtitle="$t('dashboard.subtitle')"
      :date="today"
    />

    <!-- Action Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="isLoading">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-6 flex flex-col gap-4"
        >
          <USkeleton class="w-11 h-11 rounded-full" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-5 w-36" />
            <USkeleton class="h-3.5 w-full" />
            <USkeleton class="h-3.5 w-3/4" />
          </div>
          <USkeleton class="h-9 w-full rounded-lg" />
        </div>
      </template>
      <template v-else>
        <ActionCard v-for="card in actionCards" :key="card.id" :card="card" />
      </template>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <template v-if="isLoading">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div class="flex items-start justify-between">
            <USkeleton class="w-10 h-10 rounded-full" />
            <USkeleton class="h-6 w-14 rounded-full" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-2.5 w-24" />
            <USkeleton class="h-8 w-32" />
            <USkeleton class="h-3.5 w-40" />
          </div>
        </div>
      </template>
      <template v-else>
        <MetricCard v-for="metric in metrics" :key="metric.id" :metric="metric" />
      </template>
    </div>
  </div>
</template>
