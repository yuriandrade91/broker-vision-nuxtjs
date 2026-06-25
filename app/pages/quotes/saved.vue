<script setup lang="ts">
import type { SavedQuote, SavedQuoteStatus } from '~/types/savedQuote'
import {
  STATUS_LABEL,
  STATUS_STYLE,
  STATUS_ICON,
  STATUS_ICON_COLOR,
} from '~/composables/useSavedQuotes'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('savedQuotes.pageTitle') })

const router = useRouter()
const toast = useToast()
const {
  filtered,
  paginated,
  page,
  pageSize,
  statusFilter,
  search,
  counts,
  remove,
  marcarAcompanhando,
  pararAcompanhamento,
  getStepLabel,
} = useSavedQuotes()
const { loadFromDraft } = useCotationFlow()

const { isLoading, trigger } = useLoadingDelay(700, true)
onMounted(() => trigger(700))

const confirmDeleteOpen = ref(false)
const quoteToDelete = ref<number | null>(null)
const previewOpen = ref(false)
const previewQuote = ref<SavedQuote | null>(null)

const STATUS_TABS = computed<{ value: SavedQuoteStatus | 'todos'; label: string }[]>(() => [
  { value: 'todos',      label: t('savedQuotes.tabs.all') },
  { value: 'rascunho',   label: t('savedQuotes.tabs.draft') },
  { value: 'em-analise', label: t('savedQuotes.tabs.inReview') },
  { value: 'emitida',    label: t('savedQuotes.tabs.issued') },
  { value: 'cancelada',  label: t('savedQuotes.tabs.cancelled') },
])

function openPreview(quote: SavedQuote) {
  previewQuote.value = quote
  previewOpen.value = true
}

function askDelete(id: number) {
  quoteToDelete.value = id
  confirmDeleteOpen.value = true
}

function confirmDelete() {
  if (quoteToDelete.value === null) return
  remove(quoteToDelete.value)
  quoteToDelete.value = null
  toast.add({
    title: t('savedQuotes.toast.deleted'),
    description: t('savedQuotes.toast.deletedDesc'),
    color: 'neutral',
    icon: 'i-lucide-trash-2',
  })
}

function continueDraft(quote: SavedQuote) {
  loadFromDraft({ numero: quote.numero, etapa: quote.etapa, formData: quote.formData })
  router.push('/quotes/create')
}

function acompanhar(quote: SavedQuote) {
  if (quote.acompanhando) return
  marcarAcompanhando(quote.id)
  toast.add({
    title: t('savedQuotes.toast.following'),
    description: t('savedQuotes.toast.followingDesc', { number: quote.numero }),
    color: 'info',
    icon: 'i-lucide-bell',
  })
}

function deixarDeAcompanhar(quote: SavedQuote) {
  pararAcompanhamento(quote.id)
  toast.add({
    title: t('savedQuotes.toast.unfollowed'),
    description: t('savedQuotes.toast.unfollowedDesc', { number: quote.numero }),
    color: 'neutral',
    icon: 'i-lucide-bell-off',
  })
}

function verApolice(quote: SavedQuote) {
  if (quote.numeroApolice) {
    router.push(`/policies?apolice=${quote.numeroApolice}`)
  } else {
    router.push('/policies')
  }
}

function downloadPDF(quote: SavedQuote) {
  toast.add({
    title: t('savedQuotes.toast.downloaded'),
    description: t('savedQuotes.toast.downloadedDesc', { number: quote.numero }),
    color: 'success',
    icon: 'i-lucide-download',
  })
}

function recotar(quote: SavedQuote) {
  const novoNumero = `CT-${String(Math.floor(Math.random() * 90000) + 10000)}`
  loadFromDraft({ numero: novoNumero, etapa: 1, formData: quote.formData })
  router.push('/quotes/create')
  previewOpen.value = false
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">

    <AppPageHero
      icon="i-lucide-bookmark"
      :category="$t('savedQuotes.category')"
      :title="$t('savedQuotes.title')"
      :description="$t('savedQuotes.description')"
    >
      <UButton
        color="neutral"
        class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
        leading-icon="i-lucide-plus"
        to="/quotes/select-product"
      >
        {{ $t('savedQuotes.newQuote') }}
      </UButton>
    </AppPageHero>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div class="flex items-center gap-1 bg-slate-100 dark:bg-gray-800 rounded-lg p-1 flex-wrap">
        <button
          v-for="tab in STATUS_TABS"
          :key="tab.value"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
          :class="statusFilter === tab.value
            ? 'bg-white dark:bg-gray-700 text-slate-800 dark:text-white shadow-sm'
            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'"
          @click="statusFilter = tab.value"
        >
          {{ tab.label }}
          <span
            class="inline-flex items-center justify-center rounded-full min-w-4.5 h-4.5 px-1 text-[10px] font-bold transition-all"
            :class="statusFilter === tab.value
              ? 'bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-gray-200'
              : 'bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400'"
          >
            {{ counts[tab.value] }}
          </span>
        </button>
      </div>

      <div class="relative w-full sm:w-64 shrink-0">
        <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none" />
        <input
          v-model="search"
          type="text"
          :placeholder="$t('savedQuotes.search')"
          class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 transition"
        />
        <button
          v-if="search"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer"
          @click="search = ''"
        >
          <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- List -->
    <div class="space-y-3">
      <!-- Skeleton -->
      <template v-if="isLoading">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5 flex items-center gap-5"
        >
          <USkeleton class="w-10 h-10 rounded-full shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-2">
              <USkeleton class="h-4 w-28" />
              <USkeleton class="h-4 w-20 rounded-full" />
            </div>
            <USkeleton class="h-4 w-56" />
            <USkeleton class="h-3 w-44" />
          </div>
          <USkeleton class="h-3 w-28 shrink-0" />
          <div class="flex gap-2 shrink-0">
            <USkeleton class="h-8 w-20 rounded-lg" />
            <USkeleton class="h-8 w-24 rounded-lg" />
            <USkeleton class="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </template>

      <!-- Real items -->
      <template v-else>
        <div
          v-for="quote in paginated"
          :key="quote.id"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5 flex items-center gap-5 hover:border-teal-300 dark:hover:border-teal-700 transition-colors group"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            :class="STATUS_ICON_COLOR[quote.status]"
          >
            <UIcon :name="STATUS_ICON[quote.status]" class="w-5 h-5" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-mono text-sm font-medium text-slate-600 dark:text-gray-300">{{ quote.numero }}</span>
              <span
                class="text-xs border rounded-full px-2 py-0.5 font-medium"
                :class="STATUS_STYLE[quote.status]"
              >
                {{ $t(STATUS_LABEL[quote.status]) }}
              </span>
            </div>
            <p class="font-semibold text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors truncate">{{ quote.tomador }}</p>
            <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              {{ quote.produto }} · {{ formatCurrencyBRL(quote.valor) }}
              <span v-if="quote.cnpj"> · {{ quote.cnpj }}</span>
            </p>
          </div>

          <!-- Progress (drafts only) -->
          <div v-if="quote.status === 'rascunho'" class="flex items-center gap-2 shrink-0">
            <div class="flex gap-1">
              <div
                v-for="step in 4"
                :key="step"
                class="w-2 h-2 rounded-full transition-colors"
                :class="step <= quote.etapa ? 'bg-teal-500' : 'bg-slate-200 dark:bg-gray-700'"
              />
            </div>
            <span class="text-xs text-slate-500 dark:text-gray-400">
              {{ $t('savedQuotes.step', { step: quote.etapa, label: getStepLabel(quote.etapa) }) }}
            </span>
          </div>

          <p class="text-xs text-slate-400 dark:text-gray-500 shrink-0">{{ $t('savedQuotes.updatedAt', { date: quote.updatedAt }) }}</p>

          <!-- Actions -->
          <div class="flex gap-2 shrink-0">
            <UButton
              size="sm"
              variant="outline"
              color="neutral"
              leading-icon="i-lucide-eye"
              @click="openPreview(quote)"
            >
              {{ $t('savedQuotes.preview') }}
            </UButton>

            <template v-if="quote.status === 'rascunho'">
              <UButton
                size="sm"
                color="neutral"
                class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
                leading-icon="i-lucide-pencil"
                @click="continueDraft(quote)"
              >
                {{ $t('savedQuotes.continue') }}
              </UButton>
              <UButton
                size="sm"
                variant="ghost"
                color="neutral"
                icon="i-lucide-trash-2"
                @click="askDelete(quote.id)"
              />
            </template>

            <template v-else-if="quote.status === 'em-analise'">
              <UButton
                v-if="!quote.acompanhando"
                size="sm"
                color="neutral"
                class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
                leading-icon="i-lucide-bell"
                @click="acompanhar(quote)"
              >
                {{ $t('savedQuotes.follow') }}
              </UButton>
              <UButton
                v-else
                size="sm"
                variant="outline"
                color="neutral"
                leading-icon="i-lucide-bell-off"
                @click="deixarDeAcompanhar(quote)"
              >
                {{ $t('savedQuotes.stopFollowing') }}
              </UButton>
            </template>

            <template v-else-if="quote.status === 'emitida'">
              <UButton
                size="sm"
                color="neutral"
                class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
                leading-icon="i-lucide-shield-check"
                @click="verApolice(quote)"
              >
                {{ $t('savedQuotes.viewPolicy') }}
              </UButton>
              <UButton
                size="sm"
                variant="outline"
                color="neutral"
                leading-icon="i-lucide-download"
                @click="downloadPDF(quote)"
              >
                {{ $t('savedQuotes.pdf') }}
              </UButton>
            </template>

            <template v-else-if="quote.status === 'cancelada'">
              <UButton
                size="sm"
                variant="outline"
                color="neutral"
                leading-icon="i-lucide-refresh-cw"
                @click="recotar(quote)"
              >
                {{ $t('savedQuotes.requote') }}
              </UButton>
              <UButton
                size="sm"
                variant="ghost"
                color="neutral"
                icon="i-lucide-trash-2"
                @click="askDelete(quote.id)"
              />
            </template>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="!paginated.length"
          class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 py-20 text-center text-slate-400 dark:text-gray-500"
        >
          <UIcon name="i-lucide-file-search" class="w-14 h-14 mx-auto mb-4 opacity-25" />
          <p class="font-semibold text-slate-500 dark:text-gray-400">{{ $t('savedQuotes.empty.title') }}</p>
          <p class="text-sm mt-1">{{ $t('savedQuotes.empty.subtitle') }}</p>
          <UButton
            variant="ghost"
            color="neutral"
            class="mt-4"
            @click="statusFilter = 'todos'; search = ''"
          >
            {{ $t('savedQuotes.clearFilters') }}
          </UButton>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && filtered.length > pageSize" class="flex items-center justify-between px-1">
      <p class="text-sm text-slate-500 dark:text-gray-400">
        {{ $t('savedQuotes.showing', { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, filtered.length), total: filtered.length }) }}
      </p>
      <UPagination
        v-model:page="page"
        :sibling-count="1"
        :total="filtered.length"
        :items-per-page="pageSize"
      />
    </div>

    <!-- Modals -->
    <AppConfirmModal
      v-model:open="confirmDeleteOpen"
      :title="$t('savedQuotes.deleteModal.title')"
      :description="$t('savedQuotes.deleteModal.description')"
      :confirm-label="$t('savedQuotes.deleteModal.confirm')"
      @confirm="confirmDelete"
    />

    <QuotesSavedQuotePreviewModal
      v-model:open="previewOpen"
      :quote="previewQuote"
      @continue="previewQuote && continueDraft(previewQuote)"
      @recotar="previewQuote && recotar(previewQuote)"
      @acompanhar="previewQuote && acompanhar(previewQuote)"
      @parar-acompanhar="previewQuote && deixarDeAcompanhar(previewQuote)"
    />
  </div>
</template>
