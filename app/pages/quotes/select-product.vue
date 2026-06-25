<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('selectProduct.pageTitle') })

const { search, filteredProducts } = useProducts()

const breadcrumb = computed(() => [
  { label: t('selectProduct.breadcrumb.dashboard'), to: '/home' },
  { label: t('selectProduct.breadcrumb.selection'), to: '/quotes/select-product' },
  { label: t('selectProduct.breadcrumb.quote') },
])

const selectedId = ref<string | null>(null)
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-6 space-y-6">
    <UBreadcrumb :items="breadcrumb" />

    <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
          <UIcon name="i-lucide-package" class="w-6 h-6 text-teal-700 dark:text-teal-400" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-slate-800 dark:text-white">{{ $t('selectProduct.title') }}</h1>
          <p class="text-sm text-slate-500 dark:text-gray-400">{{ $t('selectProduct.description') }}</p>
        </div>
      </div>

      <div class="border-t border-slate-100 dark:border-gray-800 pt-6 space-y-3">
        <p class="text-sm text-slate-600 dark:text-gray-300">{{ $t('selectProduct.selectOption') }}</p>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1.5">{{ $t('selectProduct.searchLabel') }}</label>
          <div class="flex gap-2">
            <UInput
              v-model="search"
              :placeholder="$t('selectProduct.searchPlaceholder')"
              class="flex-1"
            />
            <UButton
              leading-icon="i-lucide-search"
              color="neutral"
              class="bg-[#0b2540] hover:bg-[#0d2e50] text-white border-[#0b2540] shrink-0"
            >
              {{ $t('selectProduct.searchBtn') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProducts.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :active="selectedId === product.id"
        @click="selectedId = product.id"
      />
    </div>

    <div v-else class="text-center py-12 text-slate-400 dark:text-gray-500">
      <UIcon name="i-lucide-search-x" class="w-10 h-10 mx-auto mb-2 opacity-40" />
      <p>{{ $t('selectProduct.empty', { search }) }}</p>
    </div>
  </div>
</template>
