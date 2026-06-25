<script setup lang="ts">
const { t } = useI18n()
const {
  currentStep,
  numeroCotacao,
  premioCalculado,
  comissaoCalculada,
  totalAPagar,
  form,
  produtoLabel,
  modalidadeLabel,
} = useCotationFlow()

const isLastStep = computed(() => currentStep.value === 4)

const premioFormatted = computed(() =>
  premioCalculado.value > 0 ? formatCurrencyBRL(premioCalculado.value) : 'R$ —'
)
const comissaoFormatted = computed(() =>
  comissaoCalculada.value > 0 ? formatCurrencyBRL(comissaoCalculada.value) : 'R$ —'
)
const totalFormatted = computed(() =>
  totalAPagar.value > 0 ? formatCurrencyBRL(totalAPagar.value) : 'R$ —'
)

const METODO_LABEL = computed<Record<string, { label: string; icon: string }>>(() => ({
  boleto: { label: t('cotation.payment.boleto.label'), icon: 'i-lucide-scan-barcode' },
  pix: { label: t('cotation.payment.pix.label'), icon: 'i-simple-icons-pix' },
  cartao: { label: t('cotation.payment.cartao.label'), icon: 'i-lucide-credit-card' },
}))

const metodoAtual = computed(() => form.value.metodoPagamento ? METODO_LABEL.value[form.value.metodoPagamento] : null)

const paymentModalOpen = ref(false)
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
    <div class="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-gray-800">
      <div class="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
        <UIcon name="i-lucide-file-text" class="w-5 h-5 text-teal-700 dark:text-teal-400" />
      </div>
      <h3 class="font-semibold text-slate-800 dark:text-white">{{ isLastStep ? $t('cotation.summary.summaryTitle') : $t('cotation.summary.title') }}</h3>
    </div>

    <div class="p-5 space-y-4">
      <div class="rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 p-3">
        <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-1">{{ $t('cotation.summary.quoteNumber') }}</p>
        <p class="font-bold text-slate-700 dark:text-gray-200 font-mono">{{ numeroCotacao }}</p>
      </div>

      <template v-if="isLastStep">
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('cotation.summary.policyholder') }}</span>
            <span class="font-semibold text-slate-700 dark:text-gray-200 text-right max-w-36 truncate">{{ form.nomeTomador || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('cotation.summary.product') }}</span>
            <span class="font-semibold text-slate-700 dark:text-gray-200">{{ produtoLabel || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('cotation.summary.modality') }}</span>
            <span class="font-semibold text-slate-700 dark:text-gray-200">{{ modalidadeLabel || '—' }}</span>
          </div>
        </div>

        <div class="border-t border-slate-100 dark:border-gray-800 pt-3 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('cotation.summary.premium') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ premioFormatted }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('cotation.summary.commission', { percent: form.comissao.toFixed(1) }) }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ comissaoFormatted }}</span>
          </div>
          <div class="flex justify-between font-semibold">
            <span class="text-slate-600 dark:text-gray-300">{{ $t('cotation.summary.total') }}</span>
            <span class="text-[#0b2540] dark:text-teal-400">{{ totalFormatted }}</span>
          </div>
        </div>

        <!-- Selected payment method or button to choose -->
        <button
          class="w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors hover:border-teal-400 dark:hover:border-teal-600 cursor-pointer"
          :class="metodoAtual
            ? 'border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/10'
            : 'border-slate-200 dark:border-gray-700'"
          @click="paymentModalOpen = true"
        >
          <div class="flex items-center gap-2">
            <UIcon
              :name="metodoAtual?.icon ?? 'i-lucide-credit-card'"
              class="w-4 h-4"
              :class="metodoAtual ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-gray-500'"
            />
            <span :class="metodoAtual ? 'text-teal-700 dark:text-teal-400 font-medium' : 'text-slate-400 dark:text-gray-500'">
              {{ metodoAtual?.label ?? $t('cotation.summary.selectPayment') }}
            </span>
          </div>
          <UIcon name="i-lucide-pencil" class="w-3.5 h-3.5 text-slate-400 dark:text-gray-500" />
        </button>
      </template>

      <template v-else>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('cotation.summary.premium') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ premioFormatted }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('cotation.summary.commission', { percent: form.comissao.toFixed(1) }) }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ comissaoFormatted }}</span>
          </div>
        </div>

        <button
          class="flex items-center gap-1.5 text-sm text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          @click="paymentModalOpen = true"
        >
          <UIcon name="i-lucide-wallet" class="w-4 h-4" />
          {{ $t('cotation.summary.viewPaymentMethods') }}
        </button>
      </template>
    </div>

    <QuotesPaymentMethodsModal v-model:open="paymentModalOpen" />
  </div>
</template>
