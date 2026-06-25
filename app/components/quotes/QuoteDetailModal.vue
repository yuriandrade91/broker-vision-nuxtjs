<script setup lang="ts">
import type { CotacaoHistoricoItem } from '~/types/cotation'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ quote: CotacaoHistoricoItem | null }>()

const { t } = useI18n()
const toast = useToast()

const { isLoading, trigger } = useLoadingDelay(0, true)
watch(open, (val) => { if (val) trigger(500) })

const STATUS_BADGE: Record<string, string> = {
  'emitida':    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
  'em-analise': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  'registrada': 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  'cancelada':  'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
}

const STATUS_LABEL = computed(() => ({
  'emitida':    t('history.status.emitida'),
  'em-analise': t('history.status.em-analise'),
  'registrada': t('history.status.registrada'),
  'cancelada':  t('history.status.cancelada'),
}))

const statusSteps = computed(() => {
  const s = props.quote?.status
  if (!s) return []

  const isCancelled = s === 'cancelada'

  const steps = [
    { label: t('quoteDetail.steps.registered'), done: true,                        isCancel: false },
    { label: t('quoteDetail.steps.underReview'), done: s !== 'registrada',          isCancel: false },
    { label: isCancelled ? t('quoteDetail.steps.cancelled') : t('quoteDetail.steps.issued'),
      done: s === 'emitida' || isCancelled,                                          isCancel: isCancelled },
  ]

  let latestDone = 0
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i]?.done) { latestDone = i; break }
  }

  return steps.map((step, i) => ({ ...step, isLatest: step.done && i === latestDone }))
})
</script>

<template>
  <AppDrawer v-model:open="open" :title="$t('quoteDetail.title')">
    <template #body>
    <!-- Skeleton ao abrir -->
    <div v-if="isLoading" class="p-6 space-y-6">
      <div class="flex items-start justify-between">
        <div class="space-y-2">
          <USkeleton class="h-3.5 w-28" />
          <USkeleton class="h-6 w-52" />
          <USkeleton class="h-3.5 w-36" />
        </div>
        <USkeleton class="h-7 w-24 rounded-full shrink-0" />
      </div>
      <div class="space-y-3">
        <USkeleton class="h-28 w-full rounded-xl" />
        <USkeleton class="h-32 w-full rounded-xl" />
        <USkeleton class="h-28 w-full rounded-xl" />
      </div>
    </div>

    <div v-else-if="quote" class="p-6 space-y-6">
      <div class="flex items-start justify-between">
        <div>
          <p class="font-mono text-sm text-slate-500 dark:text-gray-400">{{ quote.numero }}</p>
          <p class="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{{ quote.tomador }}</p>
          <p v-if="quote.cnpj" class="text-sm font-mono text-slate-500 dark:text-gray-400">{{ quote.cnpj }}</p>
        </div>
        <span
          class="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border shrink-0"
          :class="STATUS_BADGE[quote.status]"
        >
          {{ STATUS_LABEL[quote.status] }}
        </span>
      </div>

      <div class="space-y-3">
        <div class="bg-slate-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('quoteDetail.sections.product') }}</p>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('quoteDetail.sections.branch') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ quote.produto ?? '—' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('quoteDetail.sections.modality') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ quote.modalidade ?? '—' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('quoteDetail.sections.date') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ quote.data }}</span>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
          <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('quoteDetail.sections.financial') }}</p>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('quoteDetail.sections.valueIS') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(quote.valor) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('quoteDetail.sections.premium') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ quote.premio ? formatCurrencyBRL(quote.premio) : '—' }}</span>
          </div>
          <template v-if="quote.premio">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('quoteDetail.sections.iof') }}</span>
              <span class="font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(quote.premio * 0.056) }}</span>
            </div>
            <div class="border-t border-slate-200 dark:border-gray-700 pt-3 flex justify-between text-sm">
              <span class="font-semibold text-slate-700 dark:text-gray-200">{{ $t('quoteDetail.sections.totalToPay') }}</span>
              <span class="font-bold text-teal-600 dark:text-teal-400 text-base">{{ formatCurrencyBRL(quote.premio * 1.056) }}</span>
            </div>
          </template>
        </div>

        <div class="bg-slate-50 dark:bg-gray-800 rounded-xl p-4 space-y-4">
          <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('quoteDetail.sections.statusHistory') }}</p>
          <div class="relative pl-5 space-y-4">
            <div
              v-for="(step, i) in statusSteps"
              :key="i"
              class="flex items-start gap-3 relative"
            >
              <div v-if="i < statusSteps.length - 1" class="absolute left-1.5 top-3 bottom-0 w-px bg-slate-200 dark:bg-gray-700" />
              <div
                class="w-3 h-3 rounded-full mt-0.5 shrink-0 relative z-10 transition-all"
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
      </div>
    </div>
    </template>

    <template #footer>
      <div v-if="isLoading" class="flex gap-3 w-full">
        <USkeleton class="h-9 flex-1 rounded-lg" />
        <USkeleton class="h-9 w-20 rounded-lg" />
      </div>
      <div v-else-if="quote" class="flex gap-3 w-full">
        <UButton
          v-if="quote.status === 'emitida'"
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
          leading-icon="i-lucide-shield-check"
        >
          {{ $t('quoteDetail.buttons.viewPolicy') }}
        </UButton>
        <UButton
          v-else-if="quote.status !== 'cancelada'"
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
          leading-icon="i-lucide-refresh-cw"
        >
          {{ $t('quoteDetail.buttons.reQuote') }}
        </UButton>
        <UButton
          variant="outline"
          color="neutral"
          leading-icon="i-lucide-download"
          @click="toast.add({ title: t('quoteDetail.toast.pdfTitle'), description: t('quoteDetail.toast.pdfDesc', { numero: props.quote?.numero }), color: 'success', icon: 'i-lucide-download' })"
        >
          {{ $t('quoteDetail.buttons.pdf') }}
        </UButton>
      </div>
    </template>
  </AppDrawer>
</template>
