<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { t, locale, setLocale, locales } = useI18n()
const toast = useToast()
const colorMode = useColorMode()

useHead({ title: computed(() => t('profile.pageTitle')) })

const breadcrumb = computed(() => [
  { label: t('profile.breadcrumb.dashboard'), to: '/home' },
  { label: t('profile.breadcrumb.title') },
])

// ─── Mock user data ───────────────────────────────────────────────────────────
const user = reactive({
  name: 'Yuri Andrade',
  email: 'yuri@BrokerVision.com.br',
  phone: '(11) 99876-5432',
  crb: 'CRB/SP 100.234',
  bio: 'Corretor de seguros com mais de 8 anos de experiência em seguros garantia e empresariais. Especializado em grandes contas corporativas.',
  address: 'Av. Paulista, 1578 — Sala 1204',
  city: 'São Paulo',
  state: 'SP',
  zip: '01310-100',
  memberSince: 'Março 2018',
  initials: 'YA',
})

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tabs = computed(() => [
  { label: t('profile.tabs.personal'),     slot: 'personal',     icon: 'i-lucide-user' },
  { label: t('profile.tabs.security'),     slot: 'security',     icon: 'i-lucide-lock' },
  { label: t('profile.tabs.preferences'),  slot: 'preferences',  icon: 'i-lucide-settings' },
])

// ─── Personal form ────────────────────────────────────────────────────────────
const personalForm = reactive({ ...user })

function savePersonal() {
  Object.assign(user, personalForm)
  toast.add({
    title: t('profile.personal.toast.title'),
    description: t('profile.personal.toast.desc'),
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
}

// ─── Security form ────────────────────────────────────────────────────────────
const securityForm = reactive({
  current: '',
  newPass: '',
  confirm: '',
})

const passwordStrength = computed(() => {
  const p = securityForm.newPass
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const passwordLabel = computed(() => {
  if (!securityForm.newPass) return ''
  if (passwordStrength.value <= 1) return t('profile.security.passwordWeak')
  if (passwordStrength.value <= 2) return t('profile.security.passwordMedium')
  return t('profile.security.passwordStrong')
})

const passwordColor = computed(() => {
  if (passwordStrength.value <= 1) return 'bg-red-500'
  if (passwordStrength.value <= 2) return 'bg-amber-400'
  return 'bg-teal-500'
})

const twoFactorEnabled = ref(false)

function savePassword() {
  securityForm.current = ''
  securityForm.newPass = ''
  securityForm.confirm = ''
  toast.add({
    title: t('profile.security.toast.title'),
    description: t('profile.security.toast.desc'),
    color: 'success',
    icon: 'i-lucide-shield-check',
  })
}

// ─── Preferences ──────────────────────────────────────────────────────────────
const notifPrefs = reactive({
  quotes: true,
  policies: true,
  reports: false,
  system: true,
})

const langItems = computed(() =>
  (locales.value as { code: string; name: string }[]).map(l => ({
    label: l.name,
    value: l.code,
  }))
)

const selectedLang = computed({
  get: () => locale.value,
  set: (val) => setLocale(val as 'en' | 'pt'),
})

const themeOptions = computed(() => [
  { value: 'light', label: t('profile.preferences.themeLight'), icon: 'i-lucide-sun' },
  { value: 'dark',  label: t('profile.preferences.themeDark'),  icon: 'i-lucide-moon' },
  { value: 'system',label: t('profile.preferences.themeSystem'),icon: 'i-lucide-monitor' },
])

function savePreferences() {
  toast.add({
    title: t('profile.preferences.toast.title'),
    description: t('profile.preferences.toast.desc'),
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-6 space-y-6">
    <UBreadcrumb :items="breadcrumb" />

    <!-- ── Cover Card ── -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden">
      <!-- Banner -->
      <div class="h-28 bg-linear-to-r from-[#0b2540] via-[#0d3060] to-teal-700 relative">
        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
      </div>

      <!-- Info bar -->
      <div class="px-8 pb-6">
        <div class="flex items-end justify-between gap-4 -mt-10">
          <!-- Avatar with camera overlay -->
          <div class="relative group cursor-pointer shrink-0">
            <div class="w-20 h-20 rounded-2xl bg-teal-400 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-gray-900 shadow-lg">
              {{ user.initials }}
            </div>
            <div class="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <UIcon name="i-lucide-camera" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">{{ user.name }}</h2>
            <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ user.email }}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-full px-2.5 py-1">
                <UIcon name="i-lucide-briefcase" class="w-3 h-3" />
                {{ $t('profile.role') }}
              </span>
              <span class="text-xs text-slate-400 dark:text-gray-500">{{ user.crb }}</span>
              <span class="text-xs text-slate-400 dark:text-gray-500">{{ $t('profile.memberSince') }} {{ user.memberSince }}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="hidden sm:flex gap-6 bg-slate-50 dark:bg-gray-800/60 rounded-xl px-6 py-3 shrink-0">
            <div class="text-center">
              <p class="text-xl font-bold text-slate-800 dark:text-white">27</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.quotes') }}</p>
            </div>
            <div class="w-px bg-slate-200 dark:bg-gray-700" />
            <div class="text-center">
              <p class="text-xl font-bold text-teal-600 dark:text-teal-400">16</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.policies') }}</p>
            </div>
            <div class="w-px bg-slate-200 dark:bg-gray-700" />
            <div class="text-center">
              <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400">59%</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.conversion') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700">
      <UTabs :items="tabs" class="p-6">

        <!-- ── Dados Pessoais ── -->
        <template #personal>
          <div class="mt-6 space-y-8">

            <!-- Dados básicos -->
            <div>
              <div class="mb-5">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('profile.personal.sectionTitle') }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.personal.sectionDesc') }}</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.name') }}</label>
                  <UInput v-model="personalForm.name" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.crb') }}</label>
                  <UInput v-model="personalForm.crb" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.email') }}</label>
                  <UInput v-model="personalForm.email" type="email" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.phone') }}</label>
                  <UInput v-model="personalForm.phone" />
                </div>
                <div class="col-span-2 space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.bio') }}</label>
                  <textarea
                    v-model="personalForm.bio"
                    rows="3"
                    :placeholder="$t('profile.personal.bioPlaceholder')"
                    class="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-slate-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <USeparator />

            <!-- Endereço -->
            <div>
              <div class="mb-5">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('profile.personal.sectionAddress') }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.personal.sectionAddressDesc') }}</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="col-span-2 space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.address') }}</label>
                  <UInput v-model="personalForm.address" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.zip') }}</label>
                  <UInput v-model="personalForm.zip" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.city') }}</label>
                  <UInput v-model="personalForm.city" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.personal.state') }}</label>
                  <UInput v-model="personalForm.state" maxlength="2" class="uppercase" />
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <UButton
                color="neutral"
                class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
                leading-icon="i-lucide-check"
                @click="savePersonal"
              >
                {{ $t('profile.personal.save') }}
              </UButton>
            </div>
          </div>
        </template>

        <!-- ── Segurança ── -->
        <template #security>
          <div class="mt-6 space-y-8">

            <!-- Alterar senha -->
            <div>
              <div class="mb-5">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('profile.security.sectionTitle') }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.security.sectionDesc') }}</p>
              </div>
              <div class="max-w-sm space-y-4">
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.security.currentPassword') }}</label>
                  <UInput v-model="securityForm.current" type="password" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.security.newPassword') }}</label>
                  <UInput v-model="securityForm.newPass" type="password" />
                  <!-- Barra de força -->
                  <div v-if="securityForm.newPass" class="flex items-center gap-3 mt-1.5">
                    <div class="flex gap-1 flex-1">
                      <div
                        v-for="i in 4"
                        :key="i"
                        class="h-1.5 flex-1 rounded-full transition-all"
                        :class="i <= passwordStrength ? passwordColor : 'bg-slate-200 dark:bg-gray-700'"
                      />
                    </div>
                    <span class="text-xs font-medium text-slate-500 dark:text-gray-400 shrink-0">{{ passwordLabel }}</span>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t('profile.security.confirmPassword') }}</label>
                  <UInput v-model="securityForm.confirm" type="password" />
                </div>
                <UButton
                  color="neutral"
                  class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
                  leading-icon="i-lucide-lock"
                  @click="savePassword"
                >
                  {{ $t('profile.security.savePassword') }}
                </UButton>
              </div>
            </div>

            <USeparator />

            <!-- 2FA -->
            <div>
              <div class="flex items-center justify-between gap-4 max-w-sm">
                <div>
                  <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ $t('profile.security.twoFactor') }}</p>
                  <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.security.twoFactorDesc') }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    class="text-xs font-medium"
                    :class="twoFactorEnabled ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-gray-500'"
                  >
                    {{ twoFactorEnabled ? $t('profile.security.twoFactorEnabled') : $t('profile.security.twoFactorDisabled') }}
                  </span>
                  <UToggle v-model="twoFactorEnabled" color="success" />
                </div>
              </div>
            </div>

            <USeparator />

            <!-- Sessões -->
            <div>
              <div class="mb-4">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('profile.security.sectionSessions') }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.security.sectionSessionsDesc') }}</p>
              </div>

              <div class="space-y-2 max-w-sm">
                <div
                  v-for="(session, i) in [
                    { device: 'Chrome / macOS', ip: '189.20.xxx.xxx', current: true },
                    { device: 'Safari / iPhone', ip: '200.44.xxx.xxx', current: false },
                  ]"
                  :key="i"
                  class="flex items-center justify-between gap-3 bg-slate-50 dark:bg-gray-800/60 rounded-xl px-4 py-3"
                >
                  <div class="flex items-center gap-3">
                    <UIcon
                      :name="session.current ? 'i-lucide-monitor' : 'i-lucide-smartphone'"
                      class="w-5 h-5 text-slate-400 dark:text-gray-500"
                    />
                    <div>
                      <p class="text-sm font-medium text-slate-700 dark:text-gray-200">{{ session.device }}</p>
                      <p class="text-xs text-slate-400 dark:text-gray-500">{{ session.ip }}</p>
                    </div>
                  </div>
                  <span
                    v-if="session.current"
                    class="text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-full px-2 py-0.5"
                  >
                    {{ $t('profile.security.thisDevice') }}
                  </span>
                  <button
                    v-else
                    class="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors cursor-pointer"
                  >
                    <UIcon name="i-lucide-log-out" class="w-4 h-4" />
                  </button>
                </div>

                <UButton variant="outline" color="error" size="sm" leading-icon="i-lucide-log-out" class="mt-2">
                  {{ $t('profile.security.revokeAll') }}
                </UButton>
              </div>
            </div>
          </div>
        </template>

        <!-- ── Preferências ── -->
        <template #preferences>
          <div class="mt-6 space-y-8">

            <!-- Idioma -->
            <div>
              <div class="mb-4">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('profile.preferences.sectionLanguage') }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.preferences.sectionLanguageDesc') }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  v-for="l in langItems"
                  :key="l.value"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer"
                  :class="selectedLang === l.value
                    ? 'border-[#0b2540] dark:border-teal-500 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-white'
                    : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:border-slate-300 dark:hover:border-gray-600'"
                  @click="setLocale(l.value as 'en' | 'pt')"
                >
                  <UIcon
                    v-if="selectedLang === l.value"
                    name="i-lucide-check-circle-2"
                    class="w-4 h-4 text-teal-600 dark:text-teal-400"
                  />
                  <UIcon v-else name="i-lucide-globe" class="w-4 h-4" />
                  {{ l.label }}
                </button>
              </div>
            </div>

            <USeparator />

            <!-- Tema -->
            <div>
              <div class="mb-4">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('profile.preferences.sectionTheme') }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.preferences.sectionThemeDesc') }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  v-for="opt in themeOptions"
                  :key="opt.value"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer"
                  :class="colorMode.preference === opt.value
                    ? 'border-[#0b2540] dark:border-teal-500 bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-white'
                    : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:border-slate-300 dark:hover:border-gray-600'"
                  @click="colorMode.preference = opt.value"
                >
                  <UIcon :name="opt.icon" class="w-4 h-4" />
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <USeparator />

            <!-- Notificações -->
            <div>
              <div class="mb-4">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ $t('profile.preferences.sectionNotifications') }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{{ $t('profile.preferences.sectionNotificationsDesc') }}</p>
              </div>
              <div class="space-y-3 max-w-md">
                <div
                  v-for="pref in [
                    { key: 'quotes',  labelKey: 'notifQuotes',  descKey: 'notifQuotesDesc',   model: 'quotes'  },
                    { key: 'policies',labelKey: 'notifPolicies',descKey: 'notifPoliciesDesc',  model: 'policies'},
                    { key: 'reports', labelKey: 'notifReports', descKey: 'notifReportsDesc',   model: 'reports' },
                    { key: 'system',  labelKey: 'notifSystem',  descKey: 'notifSystemDesc',    model: 'system'  },
                  ]"
                  :key="pref.key"
                  class="flex items-center justify-between gap-4 bg-slate-50 dark:bg-gray-800/60 rounded-xl px-4 py-3"
                >
                  <div>
                    <p class="text-sm font-medium text-slate-700 dark:text-gray-200">{{ $t(`profile.preferences.${pref.labelKey}`) }}</p>
                    <p class="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{{ $t(`profile.preferences.${pref.descKey}`) }}</p>
                  </div>
                  <UToggle v-model="notifPrefs[pref.model as keyof typeof notifPrefs]" color="success" />
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <UButton
                color="neutral"
                class="bg-[#0b2540] hover:bg-[#0d2e50] text-white"
                leading-icon="i-lucide-check"
                @click="savePreferences"
              >
                {{ $t('profile.preferences.save') }}
              </UButton>
            </div>
          </div>
        </template>

      </UTabs>
    </div>
  </div>
</template>
