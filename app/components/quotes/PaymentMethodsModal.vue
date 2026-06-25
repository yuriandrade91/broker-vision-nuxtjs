<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

const { premioCalculado, comissaoCalculada, form } = useCotationFlow()
const { t, tm, rt } = useI18n()

type MethodId = 'boleto' | 'pix' | 'cartao'

interface PaymentOption {
  id: MethodId
  label: string
  subtitle: string
  icon: string
  iconBg: string
  iconColor: string
  badge?: string
  badgeColor?: string
  features: string[]
  installments?: number[]
}

const OPTIONS = computed<PaymentOption[]>(() => [
  {
    id: 'boleto',
    label: t('paymentModal.methods.boleto.label'),
    subtitle: t('paymentModal.methods.boleto.subtitle'),
    icon: 'i-lucide-scan-barcode',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badge: t('paymentModal.methods.boleto.badge'),
    badgeColor: 'bg-blue-500',
    features: (tm('paymentModal.methods.boleto.features') as unknown[]).map(i => rt(i as any)),
  },
  {
    id: 'pix',
    label: t('paymentModal.methods.pix.label'),
    subtitle: t('paymentModal.methods.pix.subtitle'),
    icon: 'i-simple-icons-pix',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    badge: t('paymentModal.methods.pix.badge'),
    badgeColor: 'bg-teal-500',
    features: (tm('paymentModal.methods.pix.features') as unknown[]).map(i => rt(i as any)),
  },
  {
    id: 'cartao',
    label: t('paymentModal.methods.cartao.label'),
    subtitle: t('paymentModal.methods.cartao.subtitle'),
    icon: 'i-lucide-credit-card',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    features: (tm('paymentModal.methods.cartao.features') as unknown[]).map(i => rt(i as any)),
    installments: [1, 2, 3, 6, 12],
  },
])

// ─── Estado local ─────────────────────────────────────────────────────────────
const selectedId = ref<MethodId>(form.value.metodoPagamento as MethodId || 'boleto')
const selectedInstallments = ref(1)

const selectedOption = computed(() => OPTIONS.value.find(o => o.id === selectedId.value)!)

watch(open, (val) => {
  if (val) {
    selectedId.value = (form.value.metodoPagamento as MethodId) || 'boleto'
    selectedInstallments.value = 1
  }
})

watch(selectedId, () => { selectedInstallments.value = 1 })

// ─── Cálculo financeiro ───────────────────────────────────────────────────────
const IOF_RATE = 0.056
const EMISSAO_RATE = 0.012

const iof = computed(() => premioCalculado.value * IOF_RATE)
const taxaEmissao = computed(() => premioCalculado.value * EMISSAO_RATE)
const totalBruto = computed(() => premioCalculado.value * (1 + IOF_RATE + EMISSAO_RATE))
const valorParcela = computed(() =>
  selectedId.value === 'cartao' && selectedInstallments.value > 1
    ? totalBruto.value / selectedInstallments.value
    : totalBruto.value
)

const hasValue = computed(() => premioCalculado.value > 0)

// ─── Confirmação ──────────────────────────────────────────────────────────────
const toast = useToast()

function confirm() {
  form.value.metodoPagamento = selectedId.value
  const method = selectedOption.value.label
  toast.add({
    title: t('paymentModal.toast.title'),
    description: selectedId.value === 'cartao' && selectedInstallments.value > 1
      ? t('paymentModal.toast.descInstallments', { method, n: selectedInstallments.value })
      : t('paymentModal.toast.desc', { method }),
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="$t('paymentModal.title')"
    :description="$t('paymentModal.description')"
    :ui="{ width: 'max-w-lg' }"
  >
    <template #body>
    <div class="space-y-4 py-1">

      <!-- ── Seleção de método ── -->
      <div class="space-y-2.5">
        <button
          v-for="opt in OPTIONS"
          :key="opt.id"
          type="button"
          class="w-full text-left rounded-xl border-2 p-4 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
          :class="selectedId === opt.id
            ? 'border-[#0b2540] dark:border-teal-500 bg-slate-50 dark:bg-gray-800'
            : 'border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'"
          @click="selectedId = opt.id"
        >
          <div class="flex items-start gap-3">
            <!-- Ícone -->
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              :class="selectedId === opt.id ? opt.iconBg : 'bg-slate-100 dark:bg-gray-800'"
            >
              <UIcon
                :name="opt.icon"
                class="w-5 h-5 transition-colors"
                :class="selectedId === opt.id ? opt.iconColor : 'text-slate-400 dark:text-gray-500'"
              />
            </div>

            <!-- Texto -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="font-semibold text-slate-800 dark:text-white text-sm">{{ opt.label }}</span>
                <span
                  v-if="opt.badge"
                  class="text-[10px] font-bold text-white rounded-full px-2 py-0.5 tracking-wide"
                  :class="opt.badgeColor"
                >
                  {{ opt.badge }}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-gray-400">{{ opt.subtitle }}</p>

              <!-- Features (apenas quando selecionado) -->
              <ul v-if="selectedId === opt.id" class="mt-2.5 space-y-1">
                <li
                  v-for="feature in opt.features"
                  :key="feature"
                  class="flex items-center gap-1.5 text-xs text-slate-600 dark:text-gray-300"
                >
                  <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  {{ feature }}
                </li>
              </ul>

              <!-- Parcelas (cartão selecionado) -->
              <div v-if="selectedId === 'cartao' && opt.id === 'cartao' && hasValue" class="mt-3">
                <p class="text-xs font-medium text-slate-500 dark:text-gray-400 mb-2">{{ $t('paymentModal.installments.label') }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="n in opt.installments"
                    :key="n"
                    type="button"
                    class="text-xs rounded-lg px-3 py-1.5 border font-medium transition-colors focus:outline-none cursor-pointer"
                    :class="selectedInstallments === n
                      ? 'bg-[#0b2540] text-white border-[#0b2540] dark:bg-teal-600 dark:border-teal-600'
                      : 'border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 hover:border-slate-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'"
                    @click.stop="selectedInstallments = n"
                  >
                    {{ n === 1 ? $t('paymentModal.installments.cash') : $t('paymentModal.installments.times', { n, value: formatCurrencyBRL(totalBruto / n) }) }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Radio indicador -->
            <div
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
              :class="selectedId === opt.id
                ? 'border-[#0b2540] dark:border-teal-500'
                : 'border-slate-300 dark:border-gray-600'"
            >
              <div
                v-if="selectedId === opt.id"
                class="w-2 h-2 rounded-full bg-[#0b2540] dark:bg-teal-500"
              />
            </div>
          </div>
        </button>
      </div>

      <!-- ── Composição financeira ── -->
      <div
        v-if="hasValue"
        class="rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="px-4 py-3 border-b border-slate-200 dark:border-gray-700 flex items-center gap-2">
          <UIcon name="i-lucide-receipt" class="w-4 h-4 text-slate-400 dark:text-gray-500" />
          <p class="text-xs font-bold tracking-wider text-slate-500 dark:text-gray-400 uppercase">{{ $t('paymentModal.financial.title') }}</p>
        </div>
        <div class="px-4 py-3 space-y-2.5 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-gray-400">{{ $t('paymentModal.financial.netPremium') }}</span>
            <span class="font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(premioCalculado) }}</span>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center gap-1.5">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('paymentModal.financial.iof') }}</span>
              <span class="text-[10px] bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400 rounded px-1.5 py-0.5 font-mono">5,6%</span>
            </div>
            <span class="font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(iof) }}</span>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center gap-1.5">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('paymentModal.financial.emission') }}</span>
              <span class="text-[10px] bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400 rounded px-1.5 py-0.5 font-mono">1,2%</span>
            </div>
            <span class="font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(taxaEmissao) }}</span>
          </div>

          <div class="border-t border-slate-200 dark:border-gray-700 pt-2.5 space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-slate-700 dark:text-gray-200">{{ $t('paymentModal.financial.totalToPay') }}</span>
              <span class="font-bold text-[#0b2540] dark:text-teal-400 text-base">{{ formatCurrencyBRL(totalBruto) }}</span>
            </div>
            <div
              v-if="selectedId === 'cartao' && selectedInstallments > 1"
              class="flex justify-between items-center text-xs"
            >
              <span class="text-slate-400 dark:text-gray-500">{{ $t('paymentModal.financial.installmentLine', { n: selectedInstallments }) }}</span>
              <span class="font-semibold text-purple-600 dark:text-purple-400">{{ formatCurrencyBRL(valorParcela) }} {{ $t('paymentModal.financial.perMonth') }}</span>
            </div>
          </div>

          <div class="flex justify-between text-xs text-slate-400 dark:text-gray-500 pt-0.5">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5" />
              <span>{{ $t('paymentModal.commission', { rate: form.comissao.toFixed(1) }) }}</span>
            </div>
            <span>{{ formatCurrencyBRL(comissaoCalculada) }}</span>
          </div>
        </div>
      </div>

      <!-- Aviso sem valor calculado -->
      <div
        v-else
        class="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 px-4 py-3 flex items-start gap-2.5"
      >
        <UIcon name="i-lucide-info" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p class="text-xs text-amber-700 dark:text-amber-400">{{ $t('paymentModal.warning') }}</p>
      </div>
    </div>
    </template>

    <template #footer>
      <div class="flex gap-2.5 w-full">
        <UButton variant="outline" color="neutral" class="flex-1" @click="open = false">
          {{ $t('paymentModal.buttons.cancel') }}
        </UButton>
        <UButton
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
          leading-icon="i-lucide-check"
          @click="confirm"
        >
          {{ $t('paymentModal.buttons.confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
