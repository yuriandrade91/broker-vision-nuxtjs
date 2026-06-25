<script setup lang="ts">
defineProps<{
  metric: {
    id: string
    icon: string
    label: string
    value: string
    subtitle: string
    delta: number
  }
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow">
    <div class="flex items-start justify-between">
      <div class="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
        <UIcon :name="metric.icon" class="w-5 h-5 text-teal-700 dark:text-teal-400" />
      </div>
      <span
        class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        :class="metric.delta >= 0
          ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
          : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'"
      >
        <UIcon :name="metric.delta >= 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" class="w-3 h-3" />
        {{ metric.delta >= 0 ? '+' : '' }}{{ metric.delta }}%
      </span>
    </div>

    <div>
      <p class="text-xs font-semibold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ metric.label }}</p>
      <p class="text-3xl font-bold text-slate-800 dark:text-white mt-1 tracking-tight">{{ metric.value }}</p>
      <p class="text-sm text-slate-500 dark:text-gray-400 mt-1">{{ metric.subtitle }}</p>
    </div>
  </div>
</template>
