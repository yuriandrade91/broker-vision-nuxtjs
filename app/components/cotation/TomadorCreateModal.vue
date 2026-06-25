<script setup lang="ts">
const emit = defineEmits<{
  created: [tomador: { nome: string; cnpj: string }]
}>()

const open = defineModel<boolean>('open', { default: false })

const { create } = usePolicyholders()
const toast = useToast()
const { t } = useI18n()

const form = reactive({
  nome: '',
  cnpj: '',
  email: '',
  telefone: '',
  responsavel: '',
  cargo: '',
})

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  Object.keys(errors).forEach(k => { delete (errors as Record<string, string>)[k] })
  if (!form.nome.trim()) errors.nome = t('tomadorModal.fields.nameRequired')
  if (!isValidCNPJ(form.cnpj)) errors.cnpj = t('tomadorModal.fields.cnpjRequired')
  if (!form.email.trim()) errors.email = t('tomadorModal.fields.emailRequired')
  else if (!isValidEmail(form.email)) errors.email = t('tomadorModal.fields.emailInvalid')
  return Object.keys(errors).length === 0
}

function submit() {
  if (!validate()) return
  create({
    nome: form.nome.trim(),
    cnpj: form.cnpj,
    email: form.email.trim(),
    telefone: form.telefone || '',
    responsavel: form.responsavel.trim() || undefined,
    cargo: form.cargo.trim() || undefined,
  })
  toast.add({
    title: t('tomadorModal.toast.title'),
    description: t('tomadorModal.toast.desc', { name: form.nome.trim() }),
    color: 'success',
    icon: 'i-lucide-building-2',
  })
  emit('created', { nome: form.nome.trim(), cnpj: form.cnpj })
  open.value = false
  Object.assign(form, { nome: '', cnpj: '', email: '', telefone: '', responsavel: '', cargo: '' })
}

function cancel() {
  open.value = false
  Object.assign(form, { nome: '', cnpj: '', email: '', telefone: '', responsavel: '', cargo: '' })
  Object.keys(errors).forEach(k => { delete (errors as Record<string, string>)[k] })
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'max-w-lg' }" @close="cancel">
    <template #content>
      <div class="flex flex-col">
        <!-- Header -->
        <div class="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-gray-800">
          <div class="w-11 h-11 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-user-plus" class="w-5 h-5 text-teal-700 dark:text-teal-400" />
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-bold text-slate-800 dark:text-white">{{ $t('tomadorModal.title') }}</h2>
            <p class="text-sm text-slate-500 dark:text-gray-400">{{ $t('tomadorModal.description') }}</p>
          </div>
          <UButton icon="i-lucide-x" size="sm" variant="ghost" color="neutral" @click="cancel" />
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
          <!-- Nome -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
              {{ $t('tomadorModal.fields.name') }} <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.nome"
              :placeholder="$t('tomadorModal.fields.namePlaceholder')"
              :color="errors.nome ? 'error' : 'neutral'"
            />
            <p v-if="errors.nome" class="text-xs text-red-500">{{ errors.nome }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- CNPJ -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
                {{ $t('tomadorModal.fields.cnpj') }} <span class="text-red-500">*</span>
              </label>
              <UInput
                :model-value="form.cnpj"
                :placeholder="$t('tomadorModal.fields.cnpjPlaceholder')"
                :color="errors.cnpj ? 'error' : 'neutral'"
                @update:model-value="form.cnpj = maskCNPJ($event as string)"
              />
              <p v-if="errors.cnpj" class="text-xs text-red-500">{{ errors.cnpj }}</p>
            </div>

            <!-- Telefone -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorModal.fields.phone') }}</label>
              <UInput
                :model-value="form.telefone"
                :placeholder="$t('tomadorModal.fields.phonePlaceholder')"
                @update:model-value="form.telefone = maskPhone($event as string)"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
              {{ $t('tomadorModal.fields.email') }} <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="contato@empresa.com.br"
              :color="errors.email ? 'error' : 'neutral'"
            />
            <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Responsável -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorModal.fields.responsible') }}</label>
              <UInput
                v-model="form.responsavel"
                :placeholder="$t('tomadorModal.fields.responsiblePlaceholder')"
              />
            </div>

            <!-- Cargo -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorModal.fields.position') }}</label>
              <UInput
                v-model="form.cargo"
                :placeholder="$t('tomadorModal.fields.positionPlaceholder')"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-gray-800">
          <UButton variant="outline" color="neutral" @click="cancel">{{ $t('tomadorModal.buttons.cancel') }}</UButton>
          <UButton
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
            leading-icon="i-lucide-check"
            @click="submit"
          >
            {{ $t('tomadorModal.buttons.submit') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
