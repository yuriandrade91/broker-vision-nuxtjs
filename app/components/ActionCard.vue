<script setup lang="ts">
defineProps<{
  card: {
    id: string
    icon: string
    iconBg: string
    title: string
    description: string
    cta: string
    to: string
    variant: 'primary' | 'outline'
  }
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-6 flex flex-col gap-4 h-full hover:shadow-sm transition-shadow">
    <div
      class="w-11 h-11 rounded-full flex items-center justify-center"
      :class="card.iconBg"
    >
      <UIcon
        :name="card.icon"
        class="w-5 h-5"
        :class="card.variant === 'primary' ? 'text-slate-600 dark:text-gray-300' : 'text-teal-700 dark:text-teal-400'"
      />
    </div>

    <div class="flex-1">
      <h3 class="font-semibold text-slate-800 dark:text-white">{{ card.title }}</h3>
      <p class="text-sm text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">{{ card.description }}</p>
    </div>

    <NuxtLink :to="card.to">
      <UButton
        trailing-icon="i-lucide-arrow-up-right"
        color="neutral"
        :variant="card.variant === 'primary' ? 'solid' : 'outline'"
        class="w-full justify-between text-sm"
        :class="card.variant === 'primary' ? 'bg-[#0b2540] hover:bg-[#0d2e50] text-white border-[#0b2540]' : ''"
      >
        {{ card.cta }}
      </UButton>
    </NuxtLink>
  </div>
</template>
