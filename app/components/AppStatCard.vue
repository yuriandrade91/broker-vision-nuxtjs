<script setup lang="ts">
const props = defineProps<{
  icon: string
  label: string
  value: string | number
  subtitle?: string
  color?: 'teal' | 'slate' | 'amber' | 'indigo' | 'red'
}>()

const color = computed(() => props.color ?? 'slate')

const iconBg = computed(() => ({
  teal: 'bg-teal-50 dark:bg-teal-900/30',
  slate: 'bg-slate-100 dark:bg-gray-800',
  amber: 'bg-amber-50 dark:bg-amber-900/20',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
  red: 'bg-red-50 dark:bg-red-900/20',
}[color.value]))

const iconColor = computed(() => ({
  teal: 'text-teal-700 dark:text-teal-400',
  slate: 'text-slate-600 dark:text-gray-300',
  amber: 'text-amber-600 dark:text-amber-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  red: 'text-red-600 dark:text-red-400',
}[color.value]))

const valueColor = computed(() => ({
  teal: 'text-teal-600 dark:text-teal-400',
  slate: 'text-slate-800 dark:text-white',
  amber: 'text-amber-600 dark:text-amber-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
  red: 'text-red-600 dark:text-red-400',
}[color.value]))
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-5 hover:shadow-sm transition-shadow">
    <div class="w-10 h-10 rounded-full flex items-center justify-center mb-4" :class="iconBg">
      <UIcon :name="icon" class="w-5 h-5" :class="iconColor" />
    </div>
    <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ label }}</p>
    <p class="text-3xl font-bold tracking-tight mt-1" :class="valueColor">{{ value }}</p>
    <p v-if="subtitle" class="text-sm text-slate-500 dark:text-gray-400 mt-1">{{ subtitle }}</p>
  </div>
</template>
