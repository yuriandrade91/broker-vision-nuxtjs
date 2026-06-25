<script setup lang="ts">
const router = useRouter()
const toast = useToast()
const { t } = useI18n()
const {
  form, errors,
  prevStep, validateCurrentStep,
  PAYMENT_METHODS,
  totalAPagar, premioCalculado, comissaoCalculada,
  reset,
} = useCotationFlow()

const totalFormatted = computed(() => formatCurrencyBRL(totalAPagar.value))

async function confirmar() {
  if (!validateCurrentStep()) return
  await new Promise(r => setTimeout(r, 600))
  toast.add({
    title: t('cotation.step4.toast.issued'),
    description: t('cotation.step4.toast.issuedDesc'),
    color: 'success',
  })
  reset()
  router.push('/quotes/history')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
    <div class="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-gray-800">
      <div class="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-credit-card" class="w-6 h-6 text-teal-700 dark:text-teal-400" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ $t('cotation.step4.title') }}</h2>
        <p class="text-sm text-slate-500 dark:text-gray-400">{{ $t('cotation.step4.subtitle') }}</p>
      </div>
    </div>

    <div class="p-6 space-y-5">
      <div>
        <p class="text-sm font-medium text-slate-700 dark:text-gray-200 mb-3">{{ $t('cotation.step4.paymentMethod') }} <span class="text-red-500">*</span></p>
        <p v-if="errors.metodoPagamento" class="text-xs text-red-500 mb-2">{{ errors.metodoPagamento }}</p>
        <div class="space-y-3">
          <label
            v-for="method in PAYMENT_METHODS"
            :key="method.id"
            class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors"
            :class="form.metodoPagamento === method.id
              ? 'border-[#0b2540] dark:border-teal-600 bg-slate-50 dark:bg-gray-800'
              : 'border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600'"
          >
            <input
              v-model="form.metodoPagamento"
              type="radio"
              :value="method.id"
              class="w-4 h-4 accent-[#0b2540]"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="font-medium text-slate-800 dark:text-white text-sm">{{ method.label }}</span>
                <span
                  v-if="method.recommended"
                  class="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-full px-2 py-0.5 font-medium"
                >
                  {{ $t('cotation.step4.recommended') }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ method.description }}</p>
            </div>
          </label>
        </div>
      </div>

      <div class="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 p-5">
        <p class="text-xs font-bold tracking-widest text-slate-500 dark:text-gray-400 uppercase mb-1">{{ $t('cotation.step4.total') }}</p>
        <p class="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{{ totalFormatted }}</p>
        <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">{{ $t('cotation.step4.totalSubtitle') }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-gray-800">
      <UButton variant="outline" color="neutral" leading-icon="i-lucide-chevron-left" @click="prevStep">
        {{ $t('cotation.step4.back') }}
      </UButton>
      <UButton
        color="neutral"
        class="bg-[#0b2540] hover:bg-[#0d2e50] text-white px-6"
        @click="confirmar"
      >
        {{ $t('cotation.step4.confirm') }}
      </UButton>
    </div>
  </div>
</template>
