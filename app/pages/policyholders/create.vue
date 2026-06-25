<script setup lang="ts">
import type { Tomador } from '~/types/cotation'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()

useHead({ title: t('createPolicyholder.pageTitle') })

const router = useRouter()
const toast = useToast()
const { create } = usePolicyholders()

const breadcrumb = computed(() => [
  { label: t('createPolicyholder.breadcrumb.dashboard'), to: '/home' },
  { label: t('createPolicyholder.breadcrumb.policyholders'), to: '/policyholders' },
  { label: t('createPolicyholder.breadcrumb.create') },
])

const form = reactive<Omit<Tomador, 'id' | 'cotacoes' | 'apolices'>>({
  nome: '',
  cnpj: '',
  email: '',
  telefone: '',
  responsavel: '',
  cargo: '',
  site: '',
  cep: '',
  endereco: '',
  cidade: '',
  uf: '',
  observacoes: '',
})

const errors = ref<Record<string, string>>({})
const saving = ref(false)

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.nome.trim()) e.nome = t('createPolicyholder.errors.companyNameRequired')
  if (!form.cnpj.trim()) e.cnpj = t('createPolicyholder.errors.cnpjRequired')
  else if (form.cnpj.replace(/\D/g, '').length !== 14) e.cnpj = t('createPolicyholder.errors.cnpjInvalid')
  if (!form.email.trim()) e.email = t('createPolicyholder.errors.emailRequired')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('createPolicyholder.errors.emailInvalid')
  if (!form.telefone.trim()) e.telefone = t('createPolicyholder.errors.phoneRequired')
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  saving.value = true
  await new Promise(r => setTimeout(r, 600))
  create({ ...form })
  toast.add({
    title: t('createPolicyholder.toast.title'),
    description: t('createPolicyholder.toast.description', { name: form.nome }),
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
  router.push('/policyholders')
}

function applyField(field: keyof typeof form, fn: (v: string) => string, val: string) {
  (form as Record<string, string>)[field] = fn(val)
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-6 space-y-6">

    <UBreadcrumb :items="breadcrumb" />

    <AppPageHero
      icon="i-lucide-user-plus"
      :category="$t('createPolicyholder.category')"
      :title="$t('createPolicyholder.title')"
      :description="$t('createPolicyholder.description')"
    />

    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 divide-y divide-slate-100 dark:divide-gray-800">

      <!-- Identification -->
      <div class="px-6 py-5 space-y-4">
        <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('createPolicyholder.sections.identification') }}</p>

        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
              {{ $t('createPolicyholder.fields.companyName') }} <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.nome"
              :placeholder="$t('createPolicyholder.placeholders.companyName')"
              :class="errors.nome ? 'ring-1 ring-red-400' : ''"
            />
            <p v-if="errors.nome" class="text-xs text-red-500">{{ errors.nome }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
              {{ $t('createPolicyholder.fields.cnpj') }} <span class="text-red-500">*</span>
            </label>
            <UInput
              :model-value="form.cnpj"
              :placeholder="$t('createPolicyholder.placeholders.cnpj')"
              :class="errors.cnpj ? 'ring-1 ring-red-400' : ''"
              @update:model-value="applyField('cnpj', maskCNPJ, $event as string)"
            />
            <p v-if="errors.cnpj" class="text-xs text-red-500">{{ errors.cnpj }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('createPolicyholder.fields.website') }}</label>
            <UInput v-model="form.site" :placeholder="$t('createPolicyholder.placeholders.website')" />
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="px-6 py-5 space-y-4">
        <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('createPolicyholder.sections.contact') }}</p>

        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
              {{ $t('createPolicyholder.fields.email') }} <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.email"
              type="email"
              :placeholder="$t('createPolicyholder.placeholders.email')"
              :class="errors.email ? 'ring-1 ring-red-400' : ''"
            />
            <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
              {{ $t('createPolicyholder.fields.phone') }} <span class="text-red-500">*</span>
            </label>
            <UInput
              :model-value="form.telefone"
              :placeholder="$t('createPolicyholder.placeholders.phone')"
              :class="errors.telefone ? 'ring-1 ring-red-400' : ''"
              @update:model-value="applyField('telefone', maskPhone, $event as string)"
            />
            <p v-if="errors.telefone" class="text-xs text-red-500">{{ errors.telefone }}</p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('createPolicyholder.fields.contactPerson') }}</label>
            <UInput v-model="form.responsavel" :placeholder="$t('createPolicyholder.placeholders.contactPerson')" />
          </div>

          <div class="col-span-2 space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('createPolicyholder.fields.position') }}</label>
            <UInput v-model="form.cargo" :placeholder="$t('createPolicyholder.placeholders.position')" />
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="px-6 py-5 space-y-4">
        <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('createPolicyholder.sections.address') }}</p>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('createPolicyholder.fields.zipCode') }}</label>
            <UInput
              :model-value="form.cep"
              :placeholder="$t('createPolicyholder.placeholders.zipCode')"
              @update:model-value="applyField('cep', maskCEP, $event as string)"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('createPolicyholder.fields.state') }}</label>
            <UInput v-model="form.uf" :placeholder="$t('createPolicyholder.placeholders.state')" maxlength="2" class="uppercase" />
          </div>

          <div class="col-span-2 space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('createPolicyholder.fields.address') }}</label>
            <UInput v-model="form.endereco" :placeholder="$t('createPolicyholder.placeholders.address')" />
          </div>

          <div class="col-span-2 space-y-1.5">
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('createPolicyholder.fields.city') }}</label>
            <UInput v-model="form.cidade" :placeholder="$t('createPolicyholder.placeholders.city')" />
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="px-6 py-5 space-y-3">
        <p class="text-xs font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase">{{ $t('createPolicyholder.sections.notes') }}</p>
        <textarea
          v-model="form.observacoes"
          rows="3"
          :placeholder="$t('createPolicyholder.placeholders.notes')"
          class="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 resize-none placeholder:text-slate-400 dark:placeholder:text-gray-500"
        />
      </div>
    </div>

    <!-- Footer actions -->
    <div class="flex items-center justify-between">
      <UButton variant="ghost" color="neutral" leading-icon="i-lucide-arrow-left" to="/policyholders">
        {{ $t('createPolicyholder.back') }}
      </UButton>

      <div class="flex gap-3">
        <UButton variant="outline" color="neutral" to="/policyholders">
          {{ $t('createPolicyholder.cancel') }}
        </UButton>
        <UButton
          color="neutral"
          class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
          leading-icon="i-lucide-check"
          :loading="saving"
          @click="submit"
        >
          {{ $t('createPolicyholder.submit') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
