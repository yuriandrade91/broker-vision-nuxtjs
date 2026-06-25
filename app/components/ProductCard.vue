<script setup lang="ts">
defineProps<{
  product: {
    id: string
    icon: string
    title: string
    description: string
    tagsLabel: string
    tags: string[]
    to: string
  }
  active?: boolean
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-xl border transition-shadow hover:shadow-md cursor-pointer flex flex-col overflow-hidden"
    :class="active
      ? 'border-teal-400 dark:border-teal-600 shadow-sm'
      : 'border-slate-200 dark:border-gray-700'"
  >
    <div class="h-1 w-full" :class="active ? 'bg-teal-500' : 'bg-transparent'" />

    <div class="p-6 flex flex-col items-center text-center gap-4 flex-1">
      <div class="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
        <UIcon :name="product.icon" class="w-8 h-8 text-teal-700 dark:text-teal-400" />
      </div>

      <div>
        <h3 class="font-semibold text-slate-800 dark:text-white text-lg">{{ product.title }}</h3>
        <p class="text-sm text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">{{ product.description }}</p>
      </div>

      <p class="text-sm text-slate-400 dark:text-gray-500">
        <span class="font-medium text-slate-500 dark:text-gray-400">{{ product.tagsLabel }}:</span>
        {{ product.tags.join(', ') }}
      </p>
    </div>

    <div class="px-6 pb-6">
      <NuxtLink :to="product.to">
        <UButton
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          :variant="active ? 'solid' : 'outline'"
          class="w-full justify-between"
          :class="active ? 'bg-[#0b2540] hover:bg-[#0d2e50] text-white border-[#0b2540]' : ''"
        >
          Selecionar
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>
