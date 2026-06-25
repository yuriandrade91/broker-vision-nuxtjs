<script setup lang="ts">
const toast = useToast()
const { t } = useI18n()
const { form, errors, nextStep, prevStep, getDraftData, valorIS, produtoLabel } = useCotationFlow()
const { saveDraft } = useSavedQuotes()

function applyMask(field: keyof typeof form.value, fn: (v: string) => string, val: string) {
  (form.value[field] as string) = fn(val)
}

function saveAsDraft() {
  const data = getDraftData()
  saveDraft({
    numero: data.numero,
    tomador: form.value.nomeTomador || t('cotation.step1.searchPolicyholder'),
    cnpj: form.value.cnpjTomador || undefined,
    produto: produtoLabel.value || t('cotation.step1.selectProduct'),
    valor: valorIS.value,
    etapa: data.etapa,
    status: 'rascunho',
    updatedAt: new Date().toLocaleDateString('en-US'),
    formData: data.formData,
  })
  toast.add({
    title: t('cotation.step3.toast.draftSaved'),
    description: t('cotation.step3.toast.draftSavedDesc', { number: data.numero }),
    color: 'success',
    icon: 'i-lucide-bookmark',
  })
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
    <div class="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-gray-800">
      <div class="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-shield" class="w-6 h-6 text-teal-700 dark:text-teal-400" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ $t('cotation.step3.title') }}</h2>
        <p class="text-sm text-slate-500 dark:text-gray-400">{{ $t('cotation.step3.subtitle') }}</p>
      </div>
    </div>

    <div class="p-6 space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step3.contractObject') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.riscoObjeto"
            :placeholder="$t('cotation.step3.placeholders.contractObject')"
            :class="errors.riscoObjeto ? 'ring-1 ring-red-400' : ''"
            @update:model-value="form.riscoObjeto = $event as string"
          />
          <p v-if="errors.riscoObjeto" class="text-xs text-red-500">{{ errors.riscoObjeto }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step3.processNumber') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.riscoNumeroProcesso"
            :placeholder="$t('cotation.step3.placeholders.processNumber')"
            :class="errors.riscoNumeroProcesso ? 'ring-1 ring-red-400' : ''"
            @update:model-value="form.riscoNumeroProcesso = $event as string"
          />
          <p v-if="errors.riscoNumeroProcesso" class="text-xs text-red-500">{{ errors.riscoNumeroProcesso }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step3.insuredValue') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.riscoValorSegurado"
            :placeholder="$t('cotation.step3.placeholders.insuredValue')"
            :class="errors.riscoValorSegurado ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('riscoValorSegurado', maskCurrency, $event as string)"
          />
          <p v-if="errors.riscoValorSegurado" class="text-xs text-red-500">{{ errors.riscoValorSegurado }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step3.riskLocation') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.riscoLocal"
            :placeholder="$t('cotation.step3.placeholders.riskLocation')"
            :class="errors.riscoLocal ? 'ring-1 ring-red-400' : ''"
            @update:model-value="form.riscoLocal = $event as string"
          />
          <p v-if="errors.riscoLocal" class="text-xs text-red-500">{{ errors.riscoLocal }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step3.startDate') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.riscoInicioVigencia"
            :placeholder="$t('cotation.step3.placeholders.date')"
            :class="errors.riscoInicioVigencia ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('riscoInicioVigencia', maskDate, $event as string)"
          />
          <p v-if="errors.riscoInicioVigencia" class="text-xs text-red-500">{{ errors.riscoInicioVigencia }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step3.endDate') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.riscoFimVigencia"
            :placeholder="$t('cotation.step3.placeholders.date')"
            :class="errors.riscoFimVigencia ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('riscoFimVigencia', maskDate, $event as string)"
          />
          <p v-if="errors.riscoFimVigencia" class="text-xs text-red-500">{{ errors.riscoFimVigencia }}</p>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step3.additionalNotes') }}</label>
        <textarea
          :value="form.riscoObservacoes"
          rows="4"
          :placeholder="$t('cotation.step3.placeholders.notes')"
          class="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 resize-y"
          @input="form.riscoObservacoes = ($event.target as HTMLTextAreaElement).value"
        />
      </div>
    </div>

    <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-gray-800">
      <UButton variant="outline" color="neutral" leading-icon="i-lucide-chevron-left" @click="prevStep">
        {{ $t('cotation.step3.back') }}
      </UButton>
      <div class="flex items-center gap-2">
        <UButton variant="ghost" color="neutral" leading-icon="i-lucide-bookmark" @click="saveAsDraft">
          {{ $t('cotation.step3.saveDraft') }}
        </UButton>
        <UButton
          trailing-icon="i-lucide-chevron-right"
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
          @click="nextStep"
        >
          {{ $t('cotation.step3.next') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
