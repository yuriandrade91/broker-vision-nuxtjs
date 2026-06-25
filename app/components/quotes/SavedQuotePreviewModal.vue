<script setup lang="ts">
import {
  STATUS_LABEL,
  STATUS_STYLE,
  STATUS_ICON,
  STATUS_ICON_COLOR,
} from '~/composables/useSavedQuotes'
import type { SavedQuote } from '~/types/savedQuote'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ quote: SavedQuote | null }>()
const emit = defineEmits<{ continue: []; recotar: []; acompanhar: []; pararAcompanhar: [] }>()

const toast = useToast()
const router = useRouter()
const { t } = useI18n()

function handleContinuar() {
  emit('continue')
}

const { isLoading, trigger } = useLoadingDelay(0, true)
watch(open, (val) => { if (val) trigger(500) })

const fd = computed(() => props.quote?.formData ?? {})

// ─── Seções preenchidas ──────────────────────────────────────────────────────
const step1Filled = computed(() => !!fd.value.nomeTomador || !!fd.value.produto)
const step2Filled = computed(() => !!fd.value.seguradoNome)
const step3Filled = computed(() => !!fd.value.riscoObjeto)

const steps = computed(() => [
  { num: 1, label: t('savedPreview.steps.quote'),   filled: step1Filled.value },
  { num: 2, label: t('savedPreview.steps.insured'), filled: step2Filled.value },
  { num: 3, label: t('savedPreview.steps.risk'),    filled: step3Filled.value },
  { num: 4, label: t('savedPreview.steps.payment'), filled: false },
])

// ─── Histórico de status (não-rascunho) ──────────────────────────────────────
const statusSteps = computed(() => {
  const s = props.quote?.status
  if (!s || s === 'rascunho') return []
  const isCancelled = s === 'cancelada'
  const items = [
    { label: t('savedPreview.statusSteps.registered'), done: true,                         isCancel: false },
    { label: t('savedPreview.statusSteps.underReview'), done: true,                        isCancel: false },
    { label: isCancelled ? t('savedPreview.statusSteps.cancelled') : t('savedPreview.statusSteps.issued'),
      done: s === 'emitida' || isCancelled,                                                 isCancel: isCancelled },
  ]
  let latest = 0
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i]?.done) { latest = i; break }
  }
  return items.map((item, i) => ({ ...item, isLatest: item.done && i === latest }))
})

// ─── Título dinâmico ─────────────────────────────────────────────────────────
const drawerTitle = computed(() => {
  switch (props.quote?.status) {
    case 'em-analise': return t('savedPreview.titleReview')
    case 'emitida':    return t('savedPreview.titleIssued')
    case 'cancelada':  return t('savedPreview.titleCancelled')
    default:           return t('savedPreview.titleDraft')
  }
})

// ─── Ações ───────────────────────────────────────────────────────────────────
function handleAcompanhar() {
  emit('acompanhar')
}

function handlePDF() {
  toast.add({
    title: t('savedPreview.toast.pdfTitle'),
    description: t('savedPreview.toast.pdfDesc', { numero: props.quote?.numero }),
    color: 'success',
    icon: 'i-lucide-download',
  })
}

function handleVerApolice() {
  open.value = false
  router.push('/policies')
}

function handleRecotar() {
  emit('recotar')
}
</script>

<template>
  <AppDrawer v-model:open="open" :title="drawerTitle">
    <template #body>
      <!-- Skeleton -->
      <div v-if="isLoading" class="p-6 space-y-5">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-gray-800">
          <USkeleton class="w-12 h-12 rounded-full shrink-0" />
          <div class="space-y-2 flex-1">
            <USkeleton class="h-5 w-40" />
            <USkeleton class="h-3.5 w-28" />
          </div>
          <USkeleton class="h-6 w-20 rounded-full shrink-0" />
        </div>
        <div class="flex gap-2">
          <USkeleton v-for="i in 4" :key="i" class="h-8 flex-1 rounded-lg" />
        </div>
        <USkeleton class="h-32 w-full rounded-xl" />
        <USkeleton class="h-32 w-full rounded-xl" />
        <USkeleton class="h-28 w-full rounded-xl" />
      </div>

      <div v-else-if="quote" class="flex flex-col h-full">

        <!-- ── Header ─────────────────────────────────────────────────────── -->
        <div class="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              :class="STATUS_ICON_COLOR[quote.status]"
            >
              <UIcon :name="STATUS_ICON[quote.status]" class="w-6 h-6" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-slate-800 dark:text-white truncate">{{ quote.tomador }}</p>
              <p class="text-xs font-mono text-slate-400 dark:text-gray-500 mt-0.5">{{ quote.numero }}</p>
            </div>
            <span
              class="text-xs border rounded-full px-2.5 py-1 font-medium shrink-0"
              :class="STATUS_STYLE[quote.status]"
            >
              {{ $t(STATUS_LABEL[quote.status]) }}
            </span>
          </div>

          <!-- Progresso de etapas — apenas rascunhos -->
          <div v-if="quote.status === 'rascunho'" class="grid grid-cols-4 gap-2 mt-4">
            <div
              v-for="step in steps"
              :key="step.num"
              class="rounded-lg p-2 text-center border"
              :class="step.num <= quote.etapa
                ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'
                : 'bg-slate-50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700'"
            >
              <div class="flex items-center justify-center mb-1">
                <UIcon v-if="step.filled" name="i-lucide-check-circle-2" class="w-3.5 h-3.5 text-teal-500" />
                <UIcon v-else-if="step.num <= quote.etapa" name="i-lucide-circle-dashed" class="w-3.5 h-3.5 text-teal-400" />
                <span v-else class="text-xs font-bold text-slate-400 dark:text-gray-500">{{ step.num }}</span>
              </div>
              <p
                class="text-[10px] font-medium leading-tight"
                :class="step.num <= quote.etapa ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-gray-500'"
              >
                {{ step.label }}
              </p>
            </div>
          </div>

          <!-- Timeline de status — cotações enviadas -->
          <div v-else class="mt-4 relative pl-5 space-y-3">
            <div
              v-for="(step, i) in statusSteps"
              :key="i"
              class="flex items-center gap-3 relative"
            >
              <div v-if="i < statusSteps.length - 1" class="absolute left-1.5 top-3 bottom-0 w-px bg-slate-200 dark:bg-gray-700" />
              <div
                class="w-3 h-3 rounded-full shrink-0 relative z-10 transition-all"
                :class="[
                  step.isLatest && !step.isCancel ? 'bg-teal-500 animate-pulse ring-4 ring-teal-200 dark:ring-teal-900/60' : '',
                  step.isLatest && step.isCancel  ? 'bg-red-500 animate-pulse ring-4 ring-red-200 dark:ring-red-900/60' : '',
                  step.done && !step.isLatest     ? 'bg-teal-400 opacity-40' : '',
                  !step.done                       ? 'bg-slate-300 dark:bg-gray-600' : '',
                ]"
              />
              <p
                class="text-sm font-medium transition-all"
                :class="[
                  step.isLatest && !step.isCancel ? 'text-slate-800 dark:text-white font-semibold' : '',
                  step.isLatest && step.isCancel  ? 'text-red-600 dark:text-red-400 font-semibold' : '',
                  step.done && !step.isLatest     ? 'text-slate-400 dark:text-gray-500 opacity-60' : '',
                  !step.done                       ? 'text-slate-400 dark:text-gray-500' : '',
                ]"
              >
                {{ step.label }}
              </p>
            </div>
          </div>
        </div>

        <!-- ── Indicador de acompanhamento ───────────────────────────────── -->
        <div
          v-if="quote.status === 'em-analise' && quote.acompanhando"
          class="mx-6 mt-4 flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg px-3 py-2"
        >
          <UIcon name="i-lucide-bell-ring" class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 animate-pulse" />
          <p class="text-xs font-medium text-teal-700 dark:text-teal-400">{{ $t('savedPreview.tracking') }}</p>
        </div>

        <!-- ── Corpo ──────────────────────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">

          <!-- Etapa 1 — Cotação -->
          <div v-if="step1Filled" class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <span class="text-[10px] font-bold text-teal-600 dark:text-teal-400">1</span>
              </div>
              <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('savedPreview.section.quote') }}</p>
            </div>
            <div v-if="fd.nomeTomador" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.policyholder') }}</span>
              <span class="font-medium text-slate-800 dark:text-white text-right max-w-48 truncate">{{ fd.nomeTomador }}</span>
            </div>
            <div v-if="fd.cnpjTomador" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.cnpj') }}</span>
              <span class="font-mono font-medium text-slate-700 dark:text-gray-200">{{ fd.cnpjTomador }}</span>
            </div>
            <div v-if="fd.produto" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.product') }}</span>
              <span class="font-medium text-slate-800 dark:text-white capitalize">{{ fd.produto }}</span>
            </div>
            <div v-if="fd.modalidade" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.modality') }}</span>
              <span class="font-medium text-slate-800 dark:text-white capitalize">{{ fd.modalidade }}</span>
            </div>
            <div v-if="fd.valorTotalIS" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.valueIS') }}</span>
              <span class="font-semibold text-teal-600 dark:text-teal-400">{{ fd.valorTotalIS }}</span>
            </div>
            <div v-if="fd.dataInicio" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.validity') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200">{{ fd.dataInicio }} → {{ fd.dataFim }}</span>
            </div>
            <div v-if="fd.comissao" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.commission') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200">{{ fd.comissao }}%</span>
            </div>
          </div>

          <!-- Etapa 2 — Segurado -->
          <div v-if="step2Filled" class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <span class="text-[10px] font-bold text-teal-600 dark:text-teal-400">2</span>
              </div>
              <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('savedPreview.section.insured') }}</p>
            </div>
            <div v-if="fd.seguradoNome" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.name') }}</span>
              <span class="font-medium text-slate-800 dark:text-white text-right max-w-48 truncate">{{ fd.seguradoNome }}</span>
            </div>
            <div v-if="fd.seguradoCnpjCpf" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.cnpjCpf') }}</span>
              <span class="font-mono font-medium text-slate-700 dark:text-gray-200">{{ fd.seguradoCnpjCpf }}</span>
            </div>
            <div v-if="fd.seguradoEmail" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.email') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200 truncate max-w-48">{{ fd.seguradoEmail }}</span>
            </div>
            <div v-if="fd.seguradoTelefone" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.phone') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200">{{ fd.seguradoTelefone }}</span>
            </div>
            <div v-if="fd.seguradoCidadeUF" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.city') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200">{{ fd.seguradoCidadeUF }}</span>
            </div>
          </div>

          <!-- Etapa 3 — Risco -->
          <div v-if="step3Filled" class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <span class="text-[10px] font-bold text-teal-600 dark:text-teal-400">3</span>
              </div>
              <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('savedPreview.section.risk') }}</p>
            </div>
            <div v-if="fd.riscoObjeto" class="flex justify-between text-sm gap-4">
              <span class="text-slate-500 dark:text-gray-400 shrink-0">{{ $t('savedPreview.fields.object') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200 text-right line-clamp-2">{{ fd.riscoObjeto }}</span>
            </div>
            <div v-if="fd.riscoNumeroProcesso" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.process') }}</span>
              <span class="font-mono text-xs font-medium text-slate-700 dark:text-gray-200">{{ fd.riscoNumeroProcesso }}</span>
            </div>
            <div v-if="fd.riscoLocal" class="flex justify-between text-sm gap-4">
              <span class="text-slate-500 dark:text-gray-400 shrink-0">{{ $t('savedPreview.fields.local') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200 text-right">{{ fd.riscoLocal }}</span>
            </div>
            <div v-if="fd.riscoInicioVigencia" class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('savedPreview.fields.riskValidity') }}</span>
              <span class="font-medium text-slate-700 dark:text-gray-200">{{ fd.riscoInicioVigencia }} → {{ fd.riscoFimVigencia }}</span>
            </div>
          </div>

          <!-- Vazio (rascunho sem dados) -->
          <div
            v-if="quote.status === 'rascunho' && !step1Filled && !step2Filled && !step3Filled"
            class="py-12 text-center text-slate-400 dark:text-gray-500"
          >
            <UIcon name="i-lucide-file-question" class="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p class="text-sm">{{ $t('savedPreview.empty') }}</p>
            <p class="text-xs mt-1">{{ $t('savedPreview.emptyHint') }}</p>
          </div>

          <p class="text-xs text-slate-400 dark:text-gray-500 text-center pt-2">
            {{ $t('savedPreview.lastUpdate') }} {{ quote.updatedAt }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div v-if="isLoading" class="flex gap-3 w-full">
        <USkeleton class="h-9 flex-1 rounded-lg" />
        <USkeleton class="h-9 w-24 rounded-lg" />
      </div>

      <div v-else-if="quote" class="flex gap-3 w-full">
        <!-- Rascunho -->
        <template v-if="quote.status === 'rascunho'">
          <UButton
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
            leading-icon="i-lucide-pencil"
            @click="handleContinuar"
          >
            {{ $t('savedPreview.buttons.continue') }}
          </UButton>
          <UButton variant="outline" color="neutral" @click="open = false">
            {{ $t('savedPreview.buttons.close') }}
          </UButton>
        </template>

        <!-- Em análise -->
        <template v-else-if="quote.status === 'em-analise'">
          <UButton
            v-if="!quote.acompanhando"
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
            leading-icon="i-lucide-bell"
            @click="handleAcompanhar"
          >
            {{ $t('savedPreview.buttons.track') }}
          </UButton>
          <UButton
            v-else
            variant="outline"
            color="neutral"
            leading-icon="i-lucide-bell-off"
            class="flex-1"
            @click="emit('pararAcompanhar')"
          >
            {{ $t('savedPreview.buttons.stopTracking') }}
          </UButton>
          <UButton variant="outline" color="neutral" @click="open = false">
            {{ $t('savedPreview.buttons.close') }}
          </UButton>
        </template>

        <!-- Emitida -->
        <template v-else-if="quote.status === 'emitida'">
          <UButton
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
            leading-icon="i-lucide-shield-check"
            @click="handleVerApolice"
          >
            {{ $t('savedPreview.buttons.viewPolicy') }}
          </UButton>
          <UButton
            variant="outline"
            color="neutral"
            leading-icon="i-lucide-download"
            @click="handlePDF"
          >
            {{ $t('savedPreview.buttons.pdf') }}
          </UButton>
          <UButton variant="ghost" color="neutral" icon="i-lucide-x" @click="open = false" />
        </template>

        <!-- Cancelada -->
        <template v-else-if="quote.status === 'cancelada'">
          <UButton
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
            leading-icon="i-lucide-refresh-cw"
            @click="handleRecotar"
          >
            {{ $t('savedPreview.buttons.reQuote') }}
          </UButton>
          <UButton variant="outline" color="neutral" @click="open = false">
            {{ $t('savedPreview.buttons.close') }}
          </UButton>
        </template>
      </div>
    </template>
  </AppDrawer>
</template>
