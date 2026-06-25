<script setup lang="ts">
import type { Apolice } from '~/types/cotation'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ policy: Apolice | null }>()
const emit = defineEmits<{ renovar: [numero: string] }>()

const toast = useToast()
const { t } = useI18n()

const STATUS_MAP = computed(() => ({
  vigente:  { label: t('policyDetail.statusLabels.vigente'),  dot: 'bg-teal-500',  badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800' },
  vencida:  { label: t('policyDetail.statusLabels.vencida'),  dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  cancelada:{ label: t('policyDetail.statusLabels.cancelada'),dot: 'bg-red-500',   badge: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
}))

const { isLoading, trigger } = useLoadingDelay(0, true)
watch(open, (val) => { if (val) trigger(500) })

const statusInfo = computed(() =>
  props.policy ? STATUS_MAP.value[props.policy.status] : null
)

function handleRenovar() {
  if (!props.policy) return
  if (props.policy.renovadaEm) {
    toast.add({
      title: t('policyDetail.toast.alreadyRenewedTitle'),
      description: t('policyDetail.toast.alreadyRenewedDesc', { date: props.policy.renovadaEm }),
      color: 'warning',
      icon: 'i-lucide-alert-triangle',
    })
    return
  }
  emit('renovar', props.policy.numero)
  toast.add({
    title: t('policyDetail.toast.renewedTitle'),
    description: t('policyDetail.toast.renewedDesc', { numero: props.policy.numero }),
    color: 'success',
    icon: 'i-lucide-refresh-cw',
  })
}

function handlePDF() {
  if (!props.policy) return
  toast.add({
    title: t('policyDetail.toast.pdfTitle'),
    description: t('policyDetail.toast.pdfDesc', { numero: props.policy.numero }),
    color: 'success',
    icon: 'i-lucide-download',
  })
}
</script>

<template>
  <AppDrawer v-model:open="open" :title="$t('policyDetail.title')">
    <template #body>
      <!-- Skeleton -->
      <div v-if="isLoading" class="p-6 space-y-5">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <USkeleton class="w-12 h-12 rounded-xl shrink-0" />
            <div class="space-y-2">
              <USkeleton class="h-3 w-28" />
              <USkeleton class="h-5 w-56" />
            </div>
          </div>
          <USkeleton class="h-6 w-20 rounded-full shrink-0" />
        </div>
        <USkeleton class="h-28 w-full rounded-xl" />
        <USkeleton class="h-28 w-full rounded-xl" />
        <USkeleton class="h-32 w-full rounded-xl" />
      </div>

      <div v-else-if="policy" class="flex flex-col h-full">

        <!-- ── Header ── -->
        <div class="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-gray-800">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p class="font-mono text-xs text-slate-500 dark:text-gray-400 tracking-wide">{{ policy.numero }}</p>
                <p class="text-lg font-bold text-slate-800 dark:text-white leading-snug">{{ policy.tomador }}</p>
              </div>
            </div>
            <span
              v-if="statusInfo"
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border shrink-0"
              :class="statusInfo.badge"
            >
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="statusInfo.dot" />
              {{ statusInfo.label }}
            </span>
          </div>
        </div>

        <!-- ── Corpo ── -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">

          <!-- Produto -->
          <div class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5">
            <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('policyDetail.sections.product') }}</p>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('policyDetail.sections.branch') }}</span>
              <span class="font-semibold text-slate-800 dark:text-white">{{ policy.produto }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-gray-400">{{ $t('policyDetail.sections.modality') }}</span>
              <span class="font-semibold text-slate-800 dark:text-white">{{ policy.modalidade }}</span>
            </div>
          </div>

          <!-- Vigência -->
          <div class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-3">
            <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('policyDetail.sections.validity') }}</p>
            <div class="flex items-center gap-2 text-sm">
              <div class="flex-1 text-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-2.5">
                <p class="text-xs text-slate-400 dark:text-gray-500 mb-0.5">{{ $t('policyDetail.sections.start') }}</p>
                <p class="font-semibold text-slate-800 dark:text-white">{{ policy.dataInicio }}</p>
              </div>
              <UIcon name="i-lucide-arrow-right" class="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
              <div class="flex-1 text-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-2.5">
                <p class="text-xs text-slate-400 dark:text-gray-500 mb-0.5">{{ $t('policyDetail.sections.end') }}</p>
                <p class="font-semibold text-slate-800 dark:text-white">{{ policy.dataFim }}</p>
              </div>
            </div>
          </div>

          <!-- Financeiro -->
          <div class="bg-slate-50 dark:bg-gray-800/60 rounded-xl overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200 dark:border-gray-700 flex items-center gap-2">
              <UIcon name="i-lucide-receipt" class="w-4 h-4 text-slate-400 dark:text-gray-500" />
              <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('policyDetail.sections.financial') }}</p>
            </div>
            <div class="px-4 py-3 space-y-2.5 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-500 dark:text-gray-400">{{ $t('policyDetail.sections.netPremium') }}</span>
                <span class="font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(policy.premio) }}</span>
              </div>
              <div class="flex justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="text-slate-500 dark:text-gray-400">{{ $t('policyDetail.sections.iof') }}</span>
                  <span class="text-[10px] bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400 rounded px-1.5 py-0.5 font-mono">5,6%</span>
                </div>
                <span class="font-semibold text-slate-800 dark:text-white">{{ formatCurrencyBRL(policy.premio * 0.056) }}</span>
              </div>
              <div class="border-t border-slate-200 dark:border-gray-700 pt-2.5 flex justify-between items-center">
                <span class="font-semibold text-slate-700 dark:text-gray-200">{{ $t('policyDetail.sections.totalToPay') }}</span>
                <span class="font-bold text-teal-600 dark:text-teal-400 text-base">{{ formatCurrencyBRL(policy.premio * 1.056) }}</span>
              </div>
            </div>
          </div>

          <!-- Alerta de renovação já realizada -->
          <div
            v-if="policy.renovadaEm"
            class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <UIcon name="i-lucide-file-check-2" class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <p class="text-[10px] font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">{{ $t('policyDetail.renewal.badge') }}</p>
            </div>
            <p class="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              {{ $t('policyDetail.renewal.doneMessage', { date: policy.renovadaEm }) }}
            </p>
          </div>

          <!-- Alerta vencida/cancelada -->
          <div
            v-if="policy.status === 'vencida' && !policy.renovadaEm"
            class="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3"
          >
            <UIcon name="i-lucide-alert-triangle" class="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p class="text-sm text-amber-700 dark:text-amber-400">{{ $t('policyDetail.renewal.expiredAlert') }}</p>
          </div>
          <div
            v-else-if="policy.status === 'cancelada'"
            class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3"
          >
            <UIcon name="i-lucide-x-circle" class="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
            <p class="text-sm text-red-600 dark:text-red-400">{{ $t('policyDetail.renewal.cancelledAlert') }}</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div v-if="isLoading" class="flex gap-3 w-full">
        <USkeleton class="h-9 flex-1 rounded-lg" />
        <USkeleton class="h-9 flex-1 rounded-lg" />
      </div>
      <div v-else-if="policy" class="flex gap-3 w-full">
        <template v-if="policy.status === 'vigente' || policy.status === 'vencida'">
          <UButton
            v-if="!policy.renovadaEm"
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
            leading-icon="i-lucide-refresh-cw"
            @click="handleRenovar"
          >
            {{ $t('policyDetail.buttons.renew') }}
          </UButton>
          <UButton
            v-else
            disabled
            color="neutral"
            variant="outline"
            leading-icon="i-lucide-check-circle-2"
            class="flex-1 cursor-not-allowed opacity-60"
          >
            {{ $t('policyDetail.buttons.renewalInProgress') }}
          </UButton>
        </template>
        <UButton
          variant="outline"
          color="neutral"
          leading-icon="i-lucide-download"
          :class="policy.status === 'cancelada' ? 'flex-1' : ''"
          @click="handlePDF"
        >
          {{ $t('policyDetail.buttons.downloadPDF') }}
        </UButton>
        <UButton
          v-if="policy.status === 'cancelada'"
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          @click="open = false"
        />
      </div>
    </template>
  </AppDrawer>
</template>
