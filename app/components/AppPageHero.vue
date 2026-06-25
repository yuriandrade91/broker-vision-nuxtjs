<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 px-7 py-5 flex items-center justify-between gap-6">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
        <UIcon :name="icon" class="w-7 h-7 text-teal-700 dark:text-teal-400" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-slate-800 dark:text-white leading-tight">{{ title }}</h1>
        <p v-if="description" class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ description }}</p>
      </div>
    </div>
    <div class="shrink-0">
      <slot />
    </div>
  </div>
</template>
