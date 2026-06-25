<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
} from 'chart.js'
import { Chart } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Tooltip,
  Legend,
  Filler,
)

import type { MonthlyData } from '~/composables/useReports'

const props = defineProps<{ data: MonthlyData[] }>()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
const textColor = computed(() => isDark.value ? '#9ca3af' : '#64748b')
const gridColor = computed(() => isDark.value ? 'rgba(75, 85, 99, 0.4)' : 'rgba(226, 232, 240, 0.8)')
const tooltipBg = computed(() => isDark.value ? '#111827' : '#ffffff')
const tooltipTitle = computed(() => isDark.value ? '#f9fafb' : '#0f172a')
const tooltipBody = computed(() => isDark.value ? '#9ca3af' : '#64748b')
const tooltipBorder = computed(() => isDark.value ? '#374151' : '#e2e8f0')

const chartData = computed(() => ({
  labels: props.data.map(d => d.mes),
  datasets: [
    {
      type: 'bar' as const,
      label: 'Cotações',
      data: props.data.map(d => d.cotacoes),
      backgroundColor: isDark.value ? 'rgba(99, 179, 237, 0.25)' : 'rgba(99, 179, 237, 0.3)',
      borderColor: '#63b3ed',
      borderWidth: 1.5,
      borderRadius: 5,
      borderSkipped: false,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'bar' as const,
      label: 'Emitidas',
      data: props.data.map(d => d.emitidas),
      backgroundColor: isDark.value ? 'rgba(45, 212, 191, 0.4)' : 'rgba(20, 184, 166, 0.5)',
      borderColor: '#14b8a6',
      borderWidth: 1.5,
      borderRadius: 5,
      borderSkipped: false,
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'line' as const,
      label: 'Prêmio (R$)',
      data: props.data.map(d => d.premio),
      borderColor: '#818cf8',
      backgroundColor: isDark.value ? 'rgba(129, 140, 248, 0.08)' : 'rgba(129, 140, 248, 0.12)',
      borderWidth: 2.5,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#818cf8',
      pointBorderColor: isDark.value ? '#111827' : '#ffffff',
      pointBorderWidth: 2,
      tension: 0.4,
      fill: true,
      yAxisID: 'y1',
      order: 0,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        color: textColor.value,
        usePointStyle: true,
        pointStyleWidth: 10,
        padding: 20,
        font: { size: 12, family: 'inherit' },
      },
    },
    tooltip: {
      backgroundColor: tooltipBg.value,
      titleColor: tooltipTitle.value,
      bodyColor: tooltipBody.value,
      borderColor: tooltipBorder.value,
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label(ctx: TooltipItem<'bar' | 'line'>) {
          if (ctx.dataset.yAxisID === 'y1') {
            return `  ${ctx.dataset.label}: R$ ${(ctx.raw as number).toLocaleString('pt-BR')}`
          }
          return `  ${ctx.dataset.label}: ${ctx.raw}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { color: gridColor.value, drawTicks: false },
      ticks: {
        color: textColor.value,
        font: { size: 12, family: 'inherit' },
        padding: 8,
      },
      border: { display: false },
    },
    y: {
      type: 'linear' as const,
      position: 'left' as const,
      grid: { color: gridColor.value },
      ticks: {
        color: textColor.value,
        font: { size: 11, family: 'inherit' },
        padding: 8,
        stepSize: 5,
      },
      border: { display: false },
      title: {
        display: true,
        text: 'Cotações',
        color: textColor.value,
        font: { size: 11, family: 'inherit' },
        padding: { bottom: 8 },
      },
    },
    y1: {
      type: 'linear' as const,
      position: 'right' as const,
      grid: { display: false },
      ticks: {
        color: textColor.value,
        font: { size: 11, family: 'inherit' },
        padding: 8,
        callback: (value: unknown) => `R$ ${((value as number) / 1000).toFixed(0)}k`,
      },
      border: { display: false },
      title: {
        display: true,
        text: 'Prêmio (R$)',
        color: textColor.value,
        font: { size: 11, family: 'inherit' },
        padding: { bottom: 8 },
      },
    },
  },
}))
</script>

<template>
  <Chart type="bar" :data="chartData" :options="(chartOptions as any)" />
</template>
