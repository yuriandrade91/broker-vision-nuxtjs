<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: computed(() => `${t('cotation.step1.title')} - BrokerVision`) })

const route = useRoute()
const { currentStep, currentStepDef, form, reset } = useCotationFlow()

onMounted(() => {
  const product = route.query.product as string | undefined
  if (product) {
    reset()
    form.value.produto = product
  }
})

const breadcrumbs = computed(() => [
  { label: t('selectProduct.breadcrumb.dashboard'), to: '/home' },
  { label: t('selectProduct.breadcrumb.selection'), to: '/quotes/select-product' },
  { label: t(currentStepDef.value.title) },
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-5">
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
      <template v-for="(crumb, i) in breadcrumbs" :key="i">
        <NuxtLink
          v-if="crumb.to"
          :to="crumb.to"
          class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="text-slate-800 dark:text-white font-medium">{{ crumb.label }}</span>
        <span v-if="i < breadcrumbs.length - 1" class="text-slate-300 dark:text-gray-600">/</span>
      </template>
    </nav>

    <div class="grid grid-cols-[220px_1fr_280px] gap-6 items-start">
      <div class="sticky top-6">
        <CotationStepper />
      </div>

      <div>
        <CotationFormStep1 v-if="currentStep === 1" />
        <CotationFormStep2 v-else-if="currentStep === 2" />
        <CotationFormStep3 v-else-if="currentStep === 3" />
        <CotationFormStep4 v-else-if="currentStep === 4" />
      </div>

      <div class="sticky top-6">
        <CotationSummary />
      </div>
    </div>
  </div>
</template>
