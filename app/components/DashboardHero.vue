<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  date: string
}>()
</script>

<template>
  <div class="rounded-2xl bg-linear-to-r from-teal-50 via-white to-white dark:from-teal-900/20 dark:via-gray-900 dark:to-gray-900 border border-teal-100/60 dark:border-teal-800/40 p-8 flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-slate-800 dark:text-white">{{ title }}</h1>
      <p class="mt-2 text-slate-500 dark:text-gray-400 text-sm">{{ subtitle }}</p>
    </div>
    <div class="text-right shrink-0 ml-8">
      <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('dashboard.today') }}</p>
      <p class="text-2xl font-bold text-slate-700 dark:text-gray-200 mt-1">{{ date }}</p>
    </div>
  </div>
</template>
