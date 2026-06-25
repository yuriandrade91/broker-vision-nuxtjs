<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, type TooltipItem } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import type { CotacaoHistoricoItem } from '~/types/cotation'

ChartJS.register(ArcElement, Tooltip)

const props = defineProps<{ cotacoes: CotacaoHistoricoItem[] }>()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const counts = computed(() => ({
  emitida:    props.cotacoes.filter(c => c.status === 'emitida').length,
  emAnalise:  props.cotacoes.filter(c => c.status === 'em-analise').length,
  registrada: props.cotacoes.filter(c => c.status === 'registrada').length,
  cancelada:  props.cotacoes.filter(c => c.status === 'cancelada').length,
}))

const hasData = computed(() => props.cotacoes.length > 0)

const chartData = computed(() => ({
  labels: ['Emitida', 'Em análise', 'Registrada', 'Cancelada'],
  datasets: [{
    data: [counts.value.emitida, counts.value.emAnalise, counts.value.registrada, counts.value.cancelada],
    backgroundColor: ['#14b8a6', '#60a5fa', '#94a3b8', '#f87171'],
    borderColor: isDark.value ? '#111827' : '#ffffff',
    borderWidth: 3,
    hoverBorderWidth: 3,
  }],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
      titleColor: isDark.value ? '#f9fafb' : '#0f172a',
      bodyColor: isDark.value ? '#9ca3af' : '#64748b',
      borderColor: isDark.value ? '#374151' : '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label(ctx: TooltipItem<'doughnut'>) {
          return `  ${ctx.label}: ${ctx.raw}`
        },
      },
    },
  },
}))

const legends = [
  { label: 'Emitida',    color: 'bg-teal-500',  key: 'emitida' as const },
  { label: 'Em análise', color: 'bg-blue-400',   key: 'emAnalise' as const },
  { label: 'Registrada', color: 'bg-slate-400',  key: 'registrada' as const },
  { label: 'Cancelada',  color: 'bg-red-400',    key: 'cancelada' as const },
]
</script>

<template>
  <div v-if="hasData" class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4">
    <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-3">
      Distribuição por status
    </p>
    <div class="flex items-center gap-5">
      <!-- Donut -->
      <div class="h-24 w-24 shrink-0">
        <Doughnut :data="chartData" :options="(chartOptions as any)" />
      </div>

      <!-- Legenda -->
      <div class="flex-1 grid grid-cols-2 gap-y-2 gap-x-3">
        <div
          v-for="leg in legends"
          :key="leg.key"
          class="flex items-center gap-2"
        >
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="leg.color" />
          <span class="text-xs text-slate-600 dark:text-gray-300 leading-tight">
            {{ leg.label }}
            <span class="font-bold text-slate-800 dark:text-white ml-0.5">{{ counts[leg.key] }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
