<script setup lang="ts">
const toast = useToast()
const { t } = useI18n()
const { form, errors, nextStep, prevStep, autoFillCEP, getDraftData, valorIS, produtoLabel } = useCotationFlow()
const { saveDraft } = useSavedQuotes()

function applyMask(field: keyof typeof form.value, fn: (v: string) => string, val: string) {
  (form.value[field] as string) = fn(val)
}

function onCepChange(val: string) {
  form.value.seguradoCep = maskCEP(val)
  autoFillCEP(val)
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
    title: t('cotation.step2.toast.draftSaved'),
    description: t('cotation.step2.toast.draftSavedDesc', { number: data.numero }),
    color: 'success',
    icon: 'i-lucide-bookmark',
  })
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
    <div class="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-gray-800">
      <div class="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-user" class="w-6 h-6 text-teal-700 dark:text-teal-400" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ $t('cotation.step2.title') }}</h2>
        <p class="text-sm text-slate-500 dark:text-gray-400">{{ $t('cotation.step2.subtitle') }}</p>
      </div>
    </div>

    <div class="p-6 space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step2.companyName') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.seguradoNome"
            :placeholder="$t('cotation.step2.placeholders.insuredName')"
            :class="errors.seguradoNome ? 'ring-1 ring-red-400' : ''"
            @update:model-value="form.seguradoNome = $event as string"
          />
          <p v-if="errors.seguradoNome" class="text-xs text-red-500">{{ errors.seguradoNome }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step2.cnpjCpf') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.seguradoCnpjCpf"
            :placeholder="$t('cotation.step2.placeholders.cnpjCpf')"
            :class="errors.seguradoCnpjCpf ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('seguradoCnpjCpf', maskCNPJorCPF, $event as string)"
          />
          <p v-if="errors.seguradoCnpjCpf" class="text-xs text-red-500">{{ errors.seguradoCnpjCpf }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step2.contactEmail') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.seguradoEmail"
            type="email"
            :placeholder="$t('cotation.step2.placeholders.email')"
            :class="errors.seguradoEmail ? 'ring-1 ring-red-400' : ''"
            @update:model-value="form.seguradoEmail = $event as string"
          />
          <p v-if="errors.seguradoEmail" class="text-xs text-red-500">{{ errors.seguradoEmail }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step2.phone') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.seguradoTelefone"
            :placeholder="$t('cotation.step2.placeholders.phone')"
            :class="errors.seguradoTelefone ? 'ring-1 ring-red-400' : ''"
            @update:model-value="applyMask('seguradoTelefone', maskPhone, $event as string)"
          />
          <p v-if="errors.seguradoTelefone" class="text-xs text-red-500">{{ errors.seguradoTelefone }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step2.zipCode') }} <span class="text-red-500">*</span></label>
          <UInput
            :model-value="form.seguradoCep"
            :placeholder="$t('cotation.step2.placeholders.zipCode')"
            :class="errors.seguradoCep ? 'ring-1 ring-red-400' : ''"
            @update:model-value="onCepChange($event as string)"
          />
          <p v-if="errors.seguradoCep" class="text-xs text-red-500">{{ errors.seguradoCep }}</p>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step2.cityState') }}</label>
          <UInput
            :model-value="form.seguradoCidadeUF"
            :placeholder="$t('cotation.step2.placeholders.cityState')"
            @update:model-value="form.seguradoCidadeUF = $event as string"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('cotation.step2.fullAddress') }} <span class="text-red-500">*</span></label>
        <UInput
          :model-value="form.seguradoEndereco"
          :placeholder="$t('cotation.step2.placeholders.address')"
          :class="errors.seguradoEndereco ? 'ring-1 ring-red-400' : ''"
          @update:model-value="form.seguradoEndereco = $event as string"
        />
        <p v-if="errors.seguradoEndereco" class="text-xs text-red-500">{{ errors.seguradoEndereco }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-gray-800">
      <UButton variant="outline" color="neutral" leading-icon="i-lucide-chevron-left" @click="prevStep">
        {{ $t('cotation.step2.back') }}
      </UButton>
      <div class="flex items-center gap-2">
        <UButton variant="ghost" color="neutral" leading-icon="i-lucide-bookmark" @click="saveAsDraft">
          {{ $t('cotation.step2.saveDraft') }}
        </UButton>
        <UButton
          trailing-icon="i-lucide-chevron-right"
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
          @click="nextStep"
        >
          {{ $t('cotation.step2.next') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
