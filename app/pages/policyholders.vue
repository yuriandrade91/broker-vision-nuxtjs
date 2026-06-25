<script setup lang="ts">
import type { Tomador } from '~/types/cotation'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('policyholders.pageTitle') })

const { tomadores, filtered, paginated, page, pageSize, search, totalCotacoes, totalApolices, getInitials } = usePolicyholders()

const { isLoading: pageLoading, trigger: triggerPage } = useLoadingDelay(700, true)
const { isLoading: listLoading, trigger: triggerList } = useLoadingDelay(0)

onMounted(() => triggerPage(800))

watch(search, () => {
  if (!pageLoading.value) triggerList(500)
})

watch(page, () => {
  if (!pageLoading.value) triggerList(300)
})

const detailOpen = ref(false)
const selectedTomador = ref<Tomador | null>(null)
const createOpen = ref(false)

function openDetail(tomador: Tomador) {
  selectedTomador.value = tomador
  detailOpen.value = true
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">

    <AppPageHero
      icon="i-lucide-building-2"
      :category="$t('policyholders.category')"
      :title="$t('policyholders.title')"
      :description="$t('policyholders.description')"
    >
      <UButton
        color="neutral"
        class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
        leading-icon="i-lucide-user-plus"
        @click="createOpen = true"
      >
        {{ $t('policyholders.register') }}
      </UButton>
    </AppPageHero>

    <!-- KPI Cards -->
    <div class="grid grid-cols-3 gap-4">
      <template v-if="pageLoading">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5 space-y-3"
        >
          <USkeleton class="w-10 h-10 rounded-full" />
          <div class="space-y-2 pt-1">
            <USkeleton class="h-2.5 w-20" />
            <USkeleton class="h-8 w-14" />
            <USkeleton class="h-3 w-28" />
          </div>
        </div>
      </template>
      <template v-else>
        <AppStatCard
          icon="i-lucide-building-2"
          :label="$t('policyholders.stats.label')"
          :value="tomadores.length"
          :subtitle="$t('policyholders.stats.registered')"
          color="slate"
        />
        <AppStatCard
          icon="i-lucide-file-text"
          :label="$t('policyholders.stats.quotesLabel')"
          :value="totalCotacoes"
          :subtitle="$t('policyholders.stats.totalQuotes')"
          color="teal"
        />
        <AppStatCard
          icon="i-lucide-shield"
          :label="$t('policyholders.stats.policiesLabel')"
          :value="totalApolices"
          :subtitle="$t('policyholders.stats.active')"
          color="indigo"
        />
      </template>
    </div>

    <!-- Search -->
    <div class="flex gap-3">
      <UInput v-model="search" :placeholder="$t('policyholders.search')" leading-icon="i-lucide-search" class="w-72" />
    </div>

    <!-- List -->
    <div class="space-y-3">
      <template v-if="pageLoading || listLoading">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5 flex items-center gap-5"
        >
          <USkeleton class="w-11 h-11 rounded-full shrink-0" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-4 w-48" />
            <USkeleton class="h-3 w-36" />
          </div>
          <USkeleton class="h-3 w-56 shrink-0" />
          <div class="flex gap-2 shrink-0">
            <USkeleton class="h-8 w-14 rounded-lg" />
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-for="tomador in paginated"
          :key="tomador.id"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5 flex items-center gap-5 hover:border-teal-300 dark:hover:border-teal-700 transition-colors cursor-pointer group"
          @click="openDetail(tomador)"
        >
          <div class="w-11 h-11 rounded-full bg-[#0b2540] flex items-center justify-center shrink-0">
            <span class="text-white text-sm font-bold">{{ getInitials(tomador.nome) }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{{ tomador.nome }}</p>
            <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5 font-mono">{{ tomador.cnpj }}</p>
          </div>

          <div class="flex items-center gap-6 text-sm text-slate-500 dark:text-gray-400 shrink-0">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-lucide-mail" class="w-4 h-4" />
              <span>{{ tomador.email }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <UIcon name="i-lucide-phone" class="w-4 h-4" />
              <span>{{ tomador.telefone }}</span>
            </div>
          </div>

          <div class="flex gap-2 shrink-0" @click.stop>
            <UButton size="sm" variant="outline" color="neutral" leading-icon="i-lucide-eye" @click="openDetail(tomador)">
              {{ $t('policyholders.view') }}
            </UButton>
          </div>
        </div>

        <div v-if="!filtered.length" class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 py-16 text-center text-slate-400 dark:text-gray-500">
          <UIcon name="i-lucide-search-x" class="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p class="text-sm">{{ $t('policyholders.empty') }}</p>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="!pageLoading && filtered.length > pageSize" class="flex items-center justify-between px-1">
      <p class="text-sm text-slate-500 dark:text-gray-400">
        {{ $t('policyholders.showing', { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, filtered.length), total: filtered.length }) }}
      </p>
      <UPagination
        v-model:page="page"
        :sibling-count="1"
        :total="filtered.length"
        :items-per-page="pageSize"
      />
    </div>

    <PolicyholdersPolicyholderDetailModal v-model:open="detailOpen" :tomador="selectedTomador" />
    <CotationTomadorCreateModal v-model:open="createOpen" />
  </div>
</template>
