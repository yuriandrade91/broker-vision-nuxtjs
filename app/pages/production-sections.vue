<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('productionSections.pageTitle') })

const breadcrumb = computed(() => [
  { label: t('productionSections.breadcrumb.dashboard'), to: '/home' },
  { label: t('productionSections.breadcrumb.title') },
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">
    <UBreadcrumb :items="breadcrumb" />

    <AppPageHero
      icon="i-lucide-layers"
      :category="$t('productionSections.category')"
      :title="$t('productionSections.title')"
      :description="$t('productionSections.description')"
    />

    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700">
      <div class="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-gray-500 gap-3">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center mb-2">
          <UIcon name="i-lucide-construction" class="w-8 h-8 opacity-50" />
        </div>
        <p class="font-semibold text-slate-500 dark:text-gray-400">{{ $t('productionSections.wip.title') }}</p>
        <p class="text-sm">{{ $t('productionSections.wip.subtitle') }}</p>
        <UButton
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white rounded-full mt-3"
          leading-icon="i-lucide-arrow-left"
          @click="navigateTo('/home')"
        >
          {{ $t('productionSections.backToDashboard') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
