<script setup lang="ts">
const { currentStep, completedSteps, goToStep, STEPS } = useCotationFlow()

function circleClass(n: number) {
  if (completedSteps.value.includes(n as 1 | 2 | 3 | 4)) {
    return 'bg-teal-500 text-white'
  }
  if (n === currentStep.value) {
    return 'bg-[#0b2540] text-white'
  }
  return 'bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-gray-700 text-slate-400 dark:text-gray-500'
}
</script>

<template>
  <nav class="flex flex-col">
    <div
      v-for="(step, i) in STEPS"
      :key="step.number"
      class="flex items-start gap-3"
    >
      <div class="flex flex-col items-center shrink-0">
        <button
          type="button"
          class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          :class="circleClass(step.number)"
          @click="goToStep(step.number)"
        >
          <UIcon
            v-if="completedSteps.includes(step.number as 1|2|3|4)"
            name="i-lucide-check"
            class="w-4 h-4"
          />
          <span v-else>{{ step.number }}</span>
        </button>
        <div v-if="i < STEPS.length - 1" class="w-px flex-1 min-h-8 bg-slate-200 dark:bg-gray-700 my-1" />
      </div>

      <div class="pt-1.5 pb-6">
        <p
          class="text-sm font-medium"
          :class="step.number === currentStep ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-gray-400'"
        >
          {{ $t(step.title) }}
        </p>
        <p class="text-xs text-slate-400 dark:text-gray-500">{{ $t(step.subtitle) }}</p>
      </div>
    </div>
  </nav>
</template>
