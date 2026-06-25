<script setup lang="ts">
import type { Apolice } from '~/types/cotation'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('policies.pageTitle') })

const route = useRoute()
const router = useRouter()
const { policies, filtered, paginated, page, pageSize, statusFilter, produtoFilter, produtoTabs, statusTabs, search, vigentes, premioTotal, renovar } = usePolicies()

// ─── Loading ──────────────────────────────────────────────────────────────────
const { isLoading: pageLoading, trigger: triggerPage } = useLoadingDelay(700, true)
const { isLoading: listLoading, trigger: triggerList } = useLoadingDelay(0)

onMounted(() => {
  triggerPage(800)
})

watch([search, statusFilter], () => {
  if (!pageLoading.value) triggerList(500)
})

watch(page, () => {
  if (!pageLoading.value) triggerList(400)
})

// ─── Detail ──────────────────────────────────────────────────────────────────
const detailOpen = ref(false)
const selectedPolicy = ref<Apolice | null>(null)

function openDetail(policy: Apolice) {
  selectedPolicy.value = policy
  detailOpen.value = true
}

watch(
  () => route.query.apolice,
  (numero) => {
    if (!numero || pageLoading.value) return
    const found = policies.value.find(p => p.numero === numero)
    if (found) {
      openDetail(found)
      router.replace({ query: {} })
    }
  },
)

watch(pageLoading, (loading) => {
  if (loading) return
  const numero = route.query.apolice
  if (!numero) return
  const found = policies.value.find(p => p.numero === numero)
  if (found) {
    openDetail(found)
    router.replace({ query: {} })
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">

    <AppPageHero
      icon="i-lucide-shield-check"
      :category="$t('policies.category')"
      :title="$t('policies.title')"
      :description="$t('policies.description')"
    >
      <UButton
        color="neutral"
        class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
        leading-icon="i-lucide-plus"
        to="/quotes/select-product"
      >
        {{ $t('policies.newQuote') }}
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
          icon="i-lucide-files"
          :label="$t('policies.stats.total')"
          :value="policies.length"
          :subtitle="$t('policies.stats.issuedPolicies')"
          color="slate"
        />
        <AppStatCard
          icon="i-lucide-shield-check"
          :label="$t('policies.stats.active')"
          :value="vigentes"
          :subtitle="$t('policies.stats.activeCoverage')"
          color="teal"
        />
        <AppStatCard
          icon="i-lucide-wallet"
          :label="$t('policies.stats.totalPremium')"
          :value="formatCurrencyBRL(premioTotal)"
          :subtitle="$t('policies.stats.activePortfolio')"
          color="slate"
        />
      </template>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
      <div class="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-100 dark:border-gray-800">
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-gray-800 rounded-lg p-1 flex-wrap">
          <button
            v-for="tab in produtoTabs"
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
              class="inline-flex items-center justify-center rounded-full min-w-4.5 h-4.5 px-1 text-[10px] font-bold"
              :class="produtoFilter === tab.value
                ? 'bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-gray-200'
                : 'bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400'"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Search -->
        <div class="relative shrink-0 w-64">
          <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none" />
          <input
            v-model="search"
            type="text"
            :placeholder="$t('policies.search')"
            class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <button
            v-if="search"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            @click="search = ''"
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

    <!-- Table -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full text-sm table-fixed">
        <colgroup>
          <col style="width:12%" />
          <col style="width:20%" />
          <col style="width:25%" />
          <col style="width:15%" />
          <col style="width:10%" />
          <col style="width:10%" />
          <col style="width:8%" />
        </colgroup>
        <thead>
          <tr class="border-b border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
            <th class="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('policies.table.policy') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('policies.table.policyholder') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('policies.table.productModality') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('policies.table.validity') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('policies.table.premium') }}</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{{ $t('policies.table.status') }}</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          <template v-if="pageLoading || listLoading">
            <tr v-for="i in 6" :key="i" class="border-b border-slate-50 dark:border-gray-800 last:border-0">
              <td class="px-5 py-4"><USkeleton class="h-4 w-32" /></td>
              <td class="px-4 py-4"><USkeleton class="h-4 w-44" /></td>
              <td class="px-4 py-4 space-y-1.5">
                <USkeleton class="h-3.5 block w-full" />
                <USkeleton class="h-3 block w-3/4" />
              </td>
              <td class="px-4 py-4"><USkeleton class="h-4 w-44" /></td>
              <td class="px-4 py-4"><USkeleton class="h-4 w-24" /></td>
              <td class="px-4 py-4"><USkeleton class="h-5 w-20 rounded-full" /></td>
              <td class="px-4 py-4"><USkeleton class="h-8 w-8 rounded-lg" /></td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="policy in paginated"
              :key="policy.numero"
              class="border-b border-slate-50 dark:border-gray-800 hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-colors last:border-0 cursor-pointer"
              @click="openDetail(policy)"
            >
              <td class="px-5 py-4">
                <span class="font-mono font-medium text-slate-700 dark:text-gray-200">{{ policy.numero }}</span>
              </td>
              <td class="px-4 py-4 font-medium text-slate-800 dark:text-white">{{ policy.tomador }}</td>
              <td class="px-4 py-4">
                <p class="text-slate-800 dark:text-gray-200">{{ policy.produto }}</p>
                <p class="text-xs text-slate-500 dark:text-gray-400">{{ policy.modalidade }}</p>
              </td>
              <td class="px-4 py-4 text-slate-500 dark:text-gray-400">
                {{ policy.dataInicio }} → {{ policy.dataFim }}
              </td>
              <td class="px-4 py-4 font-semibold text-slate-700 dark:text-gray-200">{{ formatCurrencyBRL(policy.premio) }}</td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border"
                  :class="POLICY_STATUS_STYLE[policy.status]"
                >
                  {{ $t(POLICY_STATUS_LABEL[policy.status]) }}
                </span>
              </td>
              <td class="px-4 py-4" @click.stop>
                <UButton size="sm" variant="ghost" color="neutral" icon="i-lucide-eye" @click="openDetail(policy)" />
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="7" class="text-center py-16 text-slate-400 dark:text-gray-500">
                <UIcon name="i-lucide-search-x" class="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p class="text-sm">{{ $t('policies.empty') }}</p>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!pageLoading && filtered.length > pageSize" class="flex items-center justify-between px-1">
      <p class="text-sm text-slate-500 dark:text-gray-400">
        {{ $t('policies.showing', { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, filtered.length), total: filtered.length }) }}
      </p>
      <UPagination
        v-model:page="page"
        :sibling-count="1"
        :total="filtered.length"
        :items-per-page="pageSize"
      />
    </div>

    <PoliciesPolicyDetailModal v-model:open="detailOpen" :policy="selectedPolicy" @renovar="renovar" />
  </div>
</template>
