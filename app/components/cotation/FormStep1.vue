<script setup lang="ts">
import { searchTomadores } from '~/composables/useCotationFlow'

const router = useRouter()
const toast = useToast()
const { t } = useI18n()
const {
  form, errors, taxaDisplay, valorIS,
  produtoOptions, modalidadeOptions, produtoLabel,
  nextStep, getDraftData,
} = useCotationFlow()
const { saveDraft } = useSavedQuotes()

function applyMask(field: keyof typeof form.value, fn: (v: string) => string, val: string) {
  (form.value[field] as string) = fn(val)
}

function saveAsDraft() {
  const data = getDraftData()
  saveDraft({
    numero: data.numero,
    tomador: form.value.nomeTomador || t('cotation.step1.searchPolicyholder'),
    cnpj: form.value.cnpjTomador || undefined,
    produto: produtoLabel.value || t('cotation.step1.selectProduct'),
    valor: valorIS.value,
    etapa: data.etapa,
    status: 'rascunho',
    updatedAt: new Date().toLocaleDateString('en-US'),
    formData: data.formData,
  })
  toast.add({
    title: t('cotation.step1.toast.draftSaved'),
    description: t('cotation.step1.toast.draftSavedDesc', { number: data.numero }),
    color: 'success',
    icon: 'i-lucide-bookmark',
  })
}

// ─── Policyholder autocomplete ────────────────────────────────────────────────
type Tomador = { nome: string; cnpj: string }

const tomadorQuery    = ref(form.value.nomeTomador || '')
const suggestions     = ref<Tomador[]>([])
const showDropdown    = ref(false)
const isSearching     = ref(false)
const selectedTomador = ref<Tomador | null>(
  form.value.nomeTomador ? { nome: form.value.nomeTomador, cnpj: form.value.cnpjTomador } : null
)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onTomadorInput() {
  selectedTomador.value = null
  showDropdown.value = false
  if (debounceTimer) clearTimeout(debounceTimer)

  if (tomadorQuery.value.length < 3) {
    suggestions.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  debounceTimer = setTimeout(() => {
    suggestions.value = searchTomadores(tomadorQuery.value)
    showDropdown.value = true
    isSearching.value = false
  }, 300)
}

function pickTomador(t: Tomador) {
  selectedTomador.value = t
  tomadorQuery.value = t.nome
  form.value.nomeTomador = t.nome
  form.value.cnpjTomador = t.cnpj
  suggestions.value = []
  showDropdown.value = false
}

function clearTomador() {
  selectedTomador.value = null
  tomadorQuery.value = ''
  form.value.nomeTomador = ''
  form.value.cnpjTomador = ''
  suggestions.value = []
  showDropdown.value = false
}

function closeSuggestions() {
  setTimeout(() => { showDropdown.value = false }, 150)
}

// ─── Create modal ─────────────────────────────────────────────────────────────
const createModalOpen = ref(false)

function onTomadorCreated(t: { nome: string; cnpj: string }) {
  pickTomador(t)
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
    <div class="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-gray-800">
      <div class="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-file-text" class="w-6 h-6 text-teal-700 dark:text-teal-400" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ $t('cotation.step1.title') }}</h2>
        <p class="text-sm text-slate-500 dark:text-gray-400">{{ $t('cotation.step1.subtitle') }}</p>
      </div>
    </div>

    <div class="p-6 space-y-5">
      <!-- Search policyholder — autocomplete -->
      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.searchPolicyholder') }}</label>
        <div class="flex gap-2">
          <div class="relative flex-1">
            <div class="relative flex items-center">
              <UIcon
                v-if="!isSearching"
                name="i-lucide-search"
                class="absolute left-3 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none shrink-0"
              />
              <UIcon
                v-else
                name="i-lucide-loader-2"
                class="absolute left-3 w-4 h-4 text-teal-500 pointer-events-none shrink-0 animate-spin"
              />
              <input
                v-model="tomadorQuery"
                type="text"
                :placeholder="$t('cotation.step1.searchPlaceholder')"
                class="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 transition"
                :class="selectedTomador ? 'border-teal-400 dark:border-teal-600' : ''"
                @input="onTomadorInput"
                @focus="showDropdown = suggestions.length > 0"
                @blur="closeSuggestions"
                @keydown.escape="showDropdown = false"
              />
              <button
                v-if="tomadorQuery"
                class="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
                @mousedown.prevent="clearTomador"
              >
                <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Suggestions dropdown -->
            <div
              v-if="showDropdown"
              class="absolute z-50 top-full mt-1.5 left-0 right-0 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg overflow-hidden"
            >
              <template v-if="suggestions.length">
                <button
                  v-for="s in suggestions"
                  :key="s.cnpj"
                  class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors border-b border-slate-100 dark:border-gray-800 last:border-0 cursor-pointer"
                  @mousedown.prevent="pickTomador(s)"
                >
                  <div class="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-building-2" class="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-slate-800 dark:text-white truncate">{{ s.nome }}</p>
                    <p class="text-xs text-slate-400 dark:text-gray-500 font-mono mt-0.5">{{ s.cnpj }}</p>
                  </div>
                  <UIcon name="i-lucide-corner-down-left" class="w-3.5 h-3.5 text-slate-300 dark:text-gray-600 ml-auto shrink-0" />
                </button>
              </template>
              <div
                v-else
                class="flex flex-col items-center gap-2 py-6 text-slate-400 dark:text-gray-500"
              >
                <UIcon name="i-lucide-search-x" class="w-7 h-7 opacity-50" />
                <p class="text-xs">{{ $t('cotation.step1.noResults', { query: tomadorQuery }) }}</p>
              </div>
            </div>
          </div>

          <UButton
            leading-icon="i-lucide-user-plus"
            color="neutral"
            variant="outline"
            class="shrink-0"
            @click="createModalOpen = true"
          >
            {{ $t('cotation.step1.register') }}
          </UButton>
        </div>

        <div v-if="selectedTomador" class="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-400">
          <UIcon name="i-lucide-check-circle-2" class="w-3.5 h-3.5 shrink-0" />
          <span>{{ $t('cotation.step1.policyholderSelected') }}</span>
        </div>
        <div
          v-else-if="tomadorQuery.length > 0 && tomadorQuery.length < 3"
          class="flex items-center gap-2 text-xs text-slate-400 dark:text-gray-500"
        >
          <UIcon name="i-lucide-info" class="w-3.5 h-3.5 shrink-0" />
          <span>{{ $t('cotation.step1.minChars') }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.policyholderName') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.nomeTomador"
            :placeholder="$t('cotation.step1.placeholders.fullName')"
            :class="errors.nomeTomador ? 'ring-1 ring-red-400' : ''"
            @update:model-value="form.nomeTomador = $event as string"
          />
          <p v-if="errors.nomeTomador" class="text-xs text-red-500">{{ errors.nomeTomador }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.policyholderCNPJ') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.cnpjTomador"
            :placeholder="$t('cotation.step1.placeholders.cnpj')"
            :class="errors.cnpjTomador ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('cnpjTomador', maskCNPJ, $event as string)"
          />
          <p v-if="errors.cnpjTomador" class="text-xs text-red-500">{{ errors.cnpjTomador }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.product') }} <span class="text-red-500">*</span></label>
          <USelect
            v-model="form.produto"
            :items="produtoOptions"
            :placeholder="$t('cotation.step1.selectProduct')"
            :color="errors.produto ? 'error' : 'neutral'"
            class="w-full"
          />
          <p v-if="errors.produto" class="text-xs text-red-500">{{ errors.produto }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.modality') }} <span class="text-red-500">*</span></label>
          <USelect
            v-model="form.modalidade"
            :items="modalidadeOptions"
            :placeholder="$t('cotation.step1.selectModality')"
            :disabled="!form.produto"
            :color="errors.modalidade ? 'error' : 'neutral'"
            class="w-full"
          />
          <p v-if="errors.modalidade" class="text-xs text-red-500">{{ errors.modalidade }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.debtIncrease') }}</label>
          <UInput
            :model-value="form.acrescimo"
            :placeholder="$t('cotation.step1.placeholders.acrescimo')"
            @update:model-value="form.acrescimo = maskPercent($event as string)"
          >
            <template #trailing>
              <span class="text-slate-400 dark:text-gray-500 text-sm">%</span>
            </template>
          </UInput>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.totalIS') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.valorTotalIS"
            :placeholder="$t('cotation.step1.placeholders.valorIS')"
            :class="errors.valorTotalIS ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('valorTotalIS', maskCurrency, $event as string)"
          />
          <p v-if="errors.valorTotalIS" class="text-xs text-red-500">{{ errors.valorTotalIS }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.startDate') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.dataInicio"
            :placeholder="$t('cotation.step1.placeholders.date')"
            :class="errors.dataInicio ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('dataInicio', maskDate, $event as string)"
          />
          <p v-if="errors.dataInicio" class="text-xs text-red-500">{{ errors.dataInicio }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.endDate') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.dataFim"
            :placeholder="$t('cotation.step1.placeholders.date')"
            :class="errors.dataFim ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('dataFim', maskDate, $event as string)"
          />
          <p v-if="errors.dataFim" class="text-xs text-red-500">{{ errors.dataFim }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 p-4">
          <p class="text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">{{ $t('cotation.step1.rate') }}</p>
          <div class="flex items-baseline gap-1">
            <span class="text-sm text-slate-500 dark:text-gray-400">%</span>
            <span class="text-xl font-bold text-slate-800 dark:text-white">{{ taxaDisplay ?? '——' }}</span>
          </div>
        </div>
        <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 p-4">
          <p class="text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">{{ $t('cotation.step1.worsening') }}</p>
          <UInput
            :model-value="form.agravo"
            :placeholder="$t('cotation.step1.placeholders.agravamento')"
            variant="none"
            class="bg-transparent border-0 shadow-none p-0 text-slate-800 dark:text-white font-medium"
            @update:model-value="form.agravo = $event as string"
          />
        </div>
      </div>

      <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 p-4 space-y-3">
        <p class="text-sm font-semibold text-slate-700 dark:text-gray-200">{{ $t('cotation.step1.commission') }}</p>
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
          <span>0%</span>
          <span class="text-lg font-bold text-slate-800 dark:text-white">
            {{ form.comissao.toFixed(2).replace('.', ',') }}%
          </span>
          <span>30%</span>
        </div>
        <USlider
          v-model="form.comissao"
          :min="0"
          :max="30"
          :step="0.5"
        />
      </div>
    </div>

    <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-gray-800">
      <UButton
        variant="outline"
        color="neutral"
        leading-icon="i-lucide-arrow-left"
        @click="router.push('/quotes/select-product')"
      >
        {{ $t('cotation.step1.back') }}
      </UButton>
      <div class="flex items-center gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          leading-icon="i-lucide-bookmark"
          @click="saveAsDraft"
        >
          {{ $t('cotation.step1.saveDraft') }}
        </UButton>
        <UButton
          trailing-icon="i-lucide-chevron-right"
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
          @click="nextStep"
        >
          {{ $t('cotation.step1.next') }}
        </UButton>
      </div>
    </div>
  </div>

  <CotationTomadorCreateModal
    v-model:open="createModalOpen"
    @created="onTomadorCreated"
  />
</template>
