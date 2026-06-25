<script setup lang="ts">
import type { Tomador } from '~/types/cotation'

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<{ tomador: Tomador | null }>()

const toast = useToast()
const { t } = useI18n()
const { update, getInitials } = usePolicyholders()
const { policies } = usePolicies()
const { groups, STATUS_LABEL, STATUS_STYLE } = useHistorico()

// ─── Dados relacionados ───────────────────────────────────────────────────────
const tomadorPolicies = computed(() =>
  policies.value.filter(p =>
    props.tomador && p.tomador.toLowerCase().includes((props.tomador.nome.split(' ')[0] ?? '').toLowerCase())
  )
)

const tomadorCotacoes = computed(() =>
  groups.value.flatMap(g => g.items).filter(i =>
    props.tomador && i.tomador.toLowerCase().includes((props.tomador.nome.split(' ')[0] ?? '').toLowerCase())
  )
)

const vigentes = computed(() => tomadorPolicies.value.filter(p => p.status === 'vigente').length)
const premioTotal = computed(() => tomadorPolicies.value.reduce((s, p) => s + p.premio, 0))
const conversao = computed(() => {
  if (!props.tomador || !props.tomador.cotacoes) return 0
  return Math.round((props.tomador.apolices / props.tomador.cotacoes) * 100)
})

// ─── Modo edição ──────────────────────────────────────────────────────────────
const isEditing = ref(false)
const editForm = ref<Partial<Tomador>>({})
const errors = ref<Record<string, string>>({})

function startEdit() {
  if (!props.tomador) return
  editForm.value = { ...props.tomador }
  errors.value = {}
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  editForm.value = {}
  errors.value = {}
}

function validateEdit(): boolean {
  const e: Record<string, string> = {}
  if (!editForm.value.nome?.trim()) e.nome = t('tomadorDetail.errors.nameRequired')
  if (!editForm.value.email?.trim()) e.email = t('tomadorDetail.errors.emailRequired')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.value.email)) e.email = t('tomadorDetail.errors.emailInvalid')
  if (!editForm.value.telefone?.trim()) e.telefone = t('tomadorDetail.errors.phoneRequired')
  errors.value = e
  return Object.keys(e).length === 0
}

function saveEdit() {
  if (!props.tomador || !validateEdit()) return
  update(props.tomador.id, editForm.value)
  toast.add({
    title: t('tomadorDetail.toast.updatedTitle'),
    description: t('tomadorDetail.toast.updatedDesc'),
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
  isEditing.value = false
}

// Resetar edição ao fechar o modal + simular loading ao abrir
const { isLoading: modalLoading, trigger: triggerModal } = useLoadingDelay(0, true)
watch(open, (val) => {
  if (val) triggerModal(600)
  else cancelEdit()
})

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tabs = computed(() => [
  { label: t('tomadorDetail.tabs.info'),     slot: 'info',     icon: 'i-lucide-user' },
  { label: t('tomadorDetail.tabs.quotes'),   slot: 'cotacoes', icon: 'i-lucide-file-text' },
  { label: t('tomadorDetail.tabs.policies'), slot: 'apolices', icon: 'i-lucide-shield-check' },
])

const policyStatusLabel = computed(() => ({
  vigente:   t('tomadorDetail.policyStatus.vigente'),
  vencida:   t('tomadorDetail.policyStatus.vencida'),
  cancelada: t('tomadorDetail.policyStatus.cancelada'),
}))

function applyMask(field: keyof Tomador, fn: (v: string) => string, val: string) {
  (editForm.value[field] as string) = fn(val)
}
</script>

<template>
  <AppDrawer
    v-model:open="open"
    :title="isEditing ? $t('tomadorDetail.titleEdit') : $t('tomadorDetail.titleView')"
  >
    <template #body>
    <!-- Skeleton ao abrir -->
    <div v-if="modalLoading" class="p-6 space-y-5">
      <div class="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-gray-800">
        <USkeleton class="w-14 h-14 rounded-full shrink-0" />
        <div class="flex-1 space-y-2">
          <USkeleton class="h-5 w-48" />
          <USkeleton class="h-3.5 w-36" />
          <USkeleton class="h-3 w-44" />
        </div>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <USkeleton v-for="i in 4" :key="i" class="h-14 rounded-lg" />
      </div>
      <USkeleton class="h-9 w-full rounded-lg" />
      <div class="space-y-3">
        <USkeleton class="h-16 w-full rounded-xl" />
        <USkeleton class="h-16 w-full rounded-xl" />
        <USkeleton class="h-16 w-full rounded-xl" />
      </div>
    </div>

    <div v-else-if="tomador" class="flex flex-col h-full">

      <!-- ── Header do perfil ── -->
      <div class="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-gray-800">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-[#0b2540] flex items-center justify-center shrink-0 shadow-sm">
            <span class="text-white text-lg font-bold tracking-wide">{{ getInitials(tomador.nome) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-lg font-bold text-slate-800 dark:text-white leading-tight truncate">{{ tomador.nome }}</p>
            <p class="text-sm font-mono text-slate-500 dark:text-gray-400 mt-0.5">{{ tomador.cnpj }}</p>
            <p v-if="tomador.responsavel" class="text-xs text-slate-400 dark:text-gray-500 mt-1">
              {{ tomador.responsavel }}
              <span v-if="tomador.cargo"> · {{ tomador.cargo }}</span>
            </p>
          </div>
        </div>

        <!-- Stats rápidos -->
        <div class="grid grid-cols-4 gap-2 mt-4">
          <div class="bg-slate-50 dark:bg-gray-800/60 rounded-lg p-2.5 text-center">
            <p class="text-lg font-bold text-teal-600 dark:text-teal-400">{{ tomador.cotacoes }}</p>
            <p class="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-tight">{{ $t('tomadorDetail.stats.quotes') }}</p>
          </div>
          <div class="bg-slate-50 dark:bg-gray-800/60 rounded-lg p-2.5 text-center">
            <p class="text-lg font-bold text-slate-800 dark:text-white">{{ vigentes }}</p>
            <p class="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-tight">{{ $t('tomadorDetail.stats.active') }}</p>
          </div>
          <div class="bg-slate-50 dark:bg-gray-800/60 rounded-lg p-2.5 text-center">
            <p class="text-lg font-bold text-indigo-600 dark:text-indigo-400">{{ conversao }}%</p>
            <p class="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-tight">{{ $t('tomadorDetail.stats.conversion') }}</p>
          </div>
          <div class="bg-slate-50 dark:bg-gray-800/60 rounded-lg p-2.5 text-center">
            <p class="text-lg font-bold text-slate-800 dark:text-white">
              {{ premioTotal > 0 ? `R$ ${(premioTotal / 1000).toFixed(0)}k` : '—' }}
            </p>
            <p class="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 leading-tight">{{ $t('tomadorDetail.stats.premium') }}</p>
          </div>
        </div>
      </div>

      <!-- ── Conteúdo principal ── -->
      <div class="flex-1 overflow-y-auto">

        <!-- MODO EDIÇÃO -->
        <div v-if="isEditing" class="p-6 space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
                {{ $t('tomadorDetail.editFields.razaoSocial') }} <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="editForm.nome"
                :placeholder="$t('tomadorModal.fields.namePlaceholder')"
                :class="errors.nome ? 'ring-1 ring-red-400' : ''"
              />
              <p v-if="errors.nome" class="text-xs text-red-500">{{ errors.nome }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">CNPJ</label>
              <UInput
                :model-value="editForm.cnpj"
                placeholder="00.000.000/0000-00"
                disabled
                class="opacity-60"
                @update:model-value="applyMask('cnpj', maskCNPJ, $event as string)"
              />
              <p class="text-xs text-slate-400 dark:text-gray-500">{{ $t('tomadorDetail.editFields.cnpjHint') }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
                {{ $t('tomadorDetail.editFields.phone') }} <span class="text-red-500">*</span>
              </label>
              <UInput
                :model-value="editForm.telefone"
                placeholder="(00) 00000-0000"
                :class="errors.telefone ? 'ring-1 ring-red-400' : ''"
                @update:model-value="applyMask('telefone', maskPhone, $event as string)"
              />
              <p v-if="errors.telefone" class="text-xs text-red-500">{{ errors.telefone }}</p>
            </div>

            <div class="col-span-2 space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">
                E-mail <span class="text-red-500">*</span>
              </label>
              <UInput
                v-model="editForm.email"
                type="email"
                placeholder="contato@empresa.com.br"
                :class="errors.email ? 'ring-1 ring-red-400' : ''"
              />
              <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.responsible') }}</label>
              <UInput v-model="editForm.responsavel" :placeholder="$t('tomadorModal.fields.responsiblePlaceholder')" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.position') }}</label>
              <UInput v-model="editForm.cargo" :placeholder="$t('tomadorModal.fields.positionPlaceholder')" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.zip') }}</label>
              <UInput
                :model-value="editForm.cep"
                placeholder="00000-000"
                @update:model-value="applyMask('cep', maskCEP, $event as string)"
              />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.website') }}</label>
              <UInput v-model="editForm.site" placeholder="www.empresa.com.br" />
            </div>

            <div class="col-span-2 space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.address') }}</label>
              <UInput v-model="editForm.endereco" :placeholder="$t('tomadorDetail.editFields.address')" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.city') }}</label>
              <UInput v-model="editForm.cidade" :placeholder="$t('tomadorDetail.editFields.city')" />
            </div>

            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.state') }}</label>
              <UInput v-model="editForm.uf" placeholder="SP" maxlength="2" class="uppercase" />
            </div>

            <div class="col-span-2 space-y-1.5">
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('tomadorDetail.editFields.notes') }}</label>
              <textarea
                v-model="editForm.observacoes"
                rows="3"
                :placeholder="$t('tomadorDetail.editFields.notesPlaceholder')"
                class="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 resize-none"
              />
            </div>
          </div>
        </div>

        <!-- MODO VISUALIZAÇÃO (com tabs) -->
        <div v-else class="p-6">
          <UTabs :items="tabs">
            <template #info>
              <div class="space-y-4 pt-4">
                <!-- Contato -->
                <div class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-0 divide-y divide-slate-200 dark:divide-gray-700">
                  <div class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div class="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                      <UIcon name="i-lucide-mail" class="w-4 h-4 text-slate-400 dark:text-gray-500" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-gray-500 uppercase">E-mail</p>
                      <p class="text-sm font-medium text-slate-800 dark:text-white truncate">{{ tomador.email }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div class="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                      <UIcon name="i-lucide-phone" class="w-4 h-4 text-slate-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-gray-500 uppercase">{{ $t('tomadorDetail.editFields.phone') }}</p>
                      <p class="text-sm font-medium text-slate-800 dark:text-white">{{ tomador.telefone }}</p>
                    </div>
                  </div>
                  <div v-if="tomador.site" class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div class="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                      <UIcon name="i-lucide-globe" class="w-4 h-4 text-slate-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-gray-500 uppercase">{{ $t('tomadorDetail.editFields.website') }}</p>
                      <p class="text-sm font-medium text-teal-600 dark:text-teal-400">{{ tomador.site }}</p>
                    </div>
                  </div>
                </div>

                <!-- Endereço -->
                <div v-if="tomador.endereco || tomador.cidade" class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-1">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-slate-400 dark:text-gray-500" />
                    <p class="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-gray-500 uppercase">{{ $t('tomadorDetail.editFields.address') }}</p>
                  </div>
                  <p v-if="tomador.endereco" class="text-sm font-medium text-slate-800 dark:text-white">{{ tomador.endereco }}</p>
                  <p v-if="tomador.cidade" class="text-sm text-slate-500 dark:text-gray-400">
                    {{ tomador.cidade }}{{ tomador.uf ? ` — ${tomador.uf}` : '' }}
                    <span v-if="tomador.cep" class="ml-2 font-mono text-xs">{{ tomador.cep }}</span>
                  </p>
                </div>

                <!-- Responsável -->
                <div v-if="tomador.responsavel" class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-user-check" class="w-4 h-4 text-slate-400 dark:text-gray-500" />
                    <p class="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-gray-500 uppercase">{{ $t('tomadorDetail.editFields.responsible') }}</p>
                  </div>
                  <p class="text-sm font-medium text-slate-800 dark:text-white">{{ tomador.responsavel }}</p>
                  <p v-if="tomador.cargo" class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ tomador.cargo }}</p>
                </div>

                <!-- Observações -->
                <div v-if="tomador.observacoes" class="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon name="i-lucide-sticky-note" class="w-4 h-4 text-amber-500" />
                    <p class="text-[10px] font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">{{ $t('tomadorDetail.editFields.notes') }}</p>
                  </div>
                  <p class="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">{{ tomador.observacoes }}</p>
                </div>
              </div>
            </template>

            <template #cotacoes>
              <div class="space-y-2 pt-4">
                <ClientOnly>
                  <PolicyholdersQuotesStatusChart :cotacoes="tomadorCotacoes" />
                </ClientOnly>

                <div
                  v-for="cot in tomadorCotacoes"
                  :key="cot.id"
                  class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-3"
                >
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-sm font-medium text-slate-700 dark:text-gray-200">{{ cot.numero }}</span>
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
                        :class="STATUS_STYLE[cot.status]"
                      >
                        {{ $t(STATUS_LABEL[cot.status]) }}
                      </span>
                    </div>
                    <span class="font-semibold text-sm text-slate-700 dark:text-gray-200">{{ formatCurrencyBRL(cot.valor) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <p v-if="cot.produto" class="text-xs text-slate-500 dark:text-gray-400">{{ cot.produto }} · {{ cot.modalidade }}</p>
                    <p class="text-xs text-slate-400 dark:text-gray-500 ml-auto">{{ cot.data }}</p>
                  </div>
                </div>
                <div v-if="!tomadorCotacoes.length" class="text-center py-10">
                  <UIcon name="i-lucide-file-search" class="w-8 h-8 mx-auto text-slate-300 dark:text-gray-600 mb-2" />
                  <p class="text-sm text-slate-400 dark:text-gray-500">{{ $t('tomadorDetail.empty.quotes') }}</p>
                </div>
              </div>
            </template>

            <template #apolices>
              <div class="space-y-2 pt-4">
                <div
                  v-for="apolice in tomadorPolicies"
                  :key="apolice.numero"
                  class="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-3 space-y-2"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-sm font-medium text-slate-700 dark:text-gray-200">{{ apolice.numero }}</span>
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
                      :class="{
                        'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800': apolice.status === 'vigente',
                        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800': apolice.status === 'vencida',
                        'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800': apolice.status === 'cancelada',
                      }"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full mr-1.5"
                        :class="{
                          'bg-teal-500': apolice.status === 'vigente',
                          'bg-amber-500': apolice.status === 'vencida',
                          'bg-red-500': apolice.status === 'cancelada',
                        }"
                      />
                      {{ policyStatusLabel[apolice.status] }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-gray-400">{{ apolice.produto }} · {{ apolice.modalidade }}</p>
                  <div class="flex justify-between items-center">
                    <p class="text-xs text-slate-400 dark:text-gray-500">{{ apolice.dataInicio }} → {{ apolice.dataFim }}</p>
                    <p class="text-sm font-semibold text-slate-700 dark:text-gray-200">{{ formatCurrencyBRL(apolice.premio) }}</p>
                  </div>
                </div>
                <div v-if="!tomadorPolicies.length" class="text-center py-10">
                  <UIcon name="i-lucide-shield-off" class="w-8 h-8 mx-auto text-slate-300 dark:text-gray-600 mb-2" />
                  <p class="text-sm text-slate-400 dark:text-gray-500">{{ $t('tomadorDetail.empty.policies') }}</p>
                </div>
              </div>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
    </template>

    <template #footer>
      <div v-if="modalLoading" class="flex gap-3 w-full">
        <USkeleton class="h-9 flex-1 rounded-lg" />
        <USkeleton class="h-9 w-24 rounded-lg" />
      </div>
      <div v-else-if="tomador" class="flex gap-3 w-full">
        <!-- Footer modo edição -->
        <template v-if="isEditing">
          <UButton variant="outline" color="neutral" class="flex-1" @click="cancelEdit">
            {{ $t('tomadorDetail.buttons.cancel') }}
          </UButton>
          <UButton
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
            leading-icon="i-lucide-check"
            @click="saveEdit"
          >
            {{ $t('tomadorDetail.buttons.save') }}
          </UButton>
        </template>

        <!-- Footer modo visualização -->
        <template v-else>
          <UButton
            color="neutral"
            class="bg-[#0b2540] hover:bg-[#0d2e50] text-white flex-1"
            leading-icon="i-lucide-plus"
            to="/quotes/select-product"
          >
            {{ $t('tomadorDetail.buttons.newQuote') }}
          </UButton>
          <UButton variant="outline" color="neutral" leading-icon="i-lucide-pencil" @click="startEdit">
            {{ $t('tomadorDetail.buttons.edit') }}
          </UButton>
        </template>
      </div>
    </template>
  </AppDrawer>
</template>
