<script setup lang="ts">
defineProps<{
  user?: { name: string; initials: string }
}>()

const router = useRouter()
const { t, locale, setLocale, locales } = useI18n()
const { hasUnread } = useNotifications()
const notifOpen = ref(false)
const notifRef = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) {
    notifOpen.value = false
  }
}

watch(notifOpen, (open) => {
  if (open) document.addEventListener('click', onDocClick, { capture: true })
  else document.removeEventListener('click', onDocClick, { capture: true })
})

onUnmounted(() => document.removeEventListener('click', onDocClick, { capture: true }))

function buildNavItems() {
  return [
    {
      label: t('nav.policies'),
      icon: 'i-lucide-shield-check',
      to: '/policies',
    },
    {
      label: t('nav.quotes'),
      icon: 'i-lucide-bookmark',
      children: [
        {
          label: t('nav.newQuote'),
          icon: 'i-lucide-plus-circle',
          description: t('nav.newQuoteDesc'),
          to: '/quotes/select-product',
        },
        {
          label: t('nav.savedQuotes'),
          icon: 'i-lucide-bookmark',
          description: t('nav.savedQuotesDesc'),
          to: '/quotes/saved',
        },
        {
          label: t('nav.history'),
          icon: 'i-lucide-history',
          description: t('nav.historyDesc'),
          to: '/quotes/history',
        },
      ],
    },
    {
      label: t('nav.policyholders'),
      icon: 'i-lucide-users',
      to: '/policyholders',
    },
    {
      label: t('nav.reports'),
      icon: 'i-lucide-bar-chart-2',
      to: '/reports',
    },
    {
      label: t('nav.dashboard'),
      icon: 'i-lucide-layout-dashboard',
      to: '/home',
    },
  ]
}

function buildUserMenuItems() {
  return [
    [{ label: t('nav.myProfile'), icon: 'i-lucide-user', to: '/profile' }],
    [{ label: t('nav.logout'), icon: 'i-lucide-log-out', onSelect: () => router.push('/') }],
  ]
}

const navItems = shallowRef(buildNavItems())
const userMenuItems = shallowRef(buildUserMenuItems())

const langMenuItems = computed(() =>
  (locales.value as { code: string; name: string }[]).map(l => ({
    label: l.name,
    icon: locale.value === l.code ? 'i-lucide-check' : '',
    onSelect: () => setLocale(l.code as 'en' | 'pt'),
  }))
)

watch(locale, () => {
  navItems.value = buildNavItems()
  userMenuItems.value = buildUserMenuItems()
})
</script>

<template>
  <header class="bg-[#0b2540] text-white sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex items-center gap-4 px-6 h-16">

      <!-- Logo -->
      <NuxtLink
        to="/home"
        class="p-3 bg-white text-[#0b2540] font-bold rounded-full flex items-center justify-center text-sm shrink-0 hover:bg-slate-100 transition-colors"
      >
        BrokerVision
      </NuxtLink>

      <!-- Nav -->
      <UNavigationMenu
        :items="navItems"
        orientation="horizontal"
        class="flex-1"
        :ui="{
          root: 'relative flex items-center',
          list: 'flex items-center gap-0.5',
          item: 'min-w-0',
          link: 'group relative w-full flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-white/60 hover:text-white/60 hover:bg-white/8 focus:outline-none focus-visible:outline-none data-active:text-white/60 data-active:bg-white/8',
          linkLeadingIcon: 'shrink-0 size-4',
          linkLabel: 'truncate',
          linkTrailingIcon: 'size-4 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200',
          viewport: 'relative overflow-hidden bg-white dark:bg-gray-900 shadow-lg rounded-xl ring ring-slate-200 dark:ring-gray-700 h-(--reka-navigation-menu-viewport-height) w-full transition-[width,height] duration-300 origin-top-center',
          childList: 'p-2 space-y-0.5 min-w-52',
          childItem: '',
          childLink: 'group relative w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:outline-none data-active:bg-teal-50 data-active:dark:bg-teal-900/20 data-active:text-teal-700 data-active:dark:text-teal-400',
          childLinkIcon: 'size-4 shrink-0 mt-0.5 text-slate-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors',
          childLinkWrapper: 'min-w-0',
          childLinkLabel: 'truncate font-medium',
          childLinkDescription: 'text-xs text-slate-400 dark:text-gray-500 mt-0.5',
        }"
      />

      <!-- CTA outlined pill -->
      <button
        class="flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        @click="router.push('/quotes/select-product')"
      >
        <UIcon name="i-lucide-plus" class="w-4 h-4" />
        {{ $t('nav.startQuote') }}
      </button>

      <!-- Right section -->
      <div class="flex items-center gap-2 shrink-0">
        <UDropdownMenu :items="langMenuItems" :content="{ align: 'end' }">
          <button class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold tracking-wide uppercase cursor-pointer">
            <UIcon name="i-lucide-globe" class="w-4 h-4" />
            {{ locale }}
          </button>
        </UDropdownMenu>

        <UColorModeButton
          size="sm"
          color="neutral"
          variant="ghost"
          class="text-white/60 hover:text-white hover:bg-white/10"
        />

        <!-- Notification bell + dropdown -->
        <div ref="notifRef" class="relative">
          <button
            class="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            @click.stop="notifOpen = !notifOpen"
          >
            <UIcon name="i-lucide-bell" class="w-5 h-5" />
          </button>
          <span
            v-if="hasUnread"
            class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0b2540] pointer-events-none"
          />
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-1 scale-95"
          >
            <div
              v-if="notifOpen"
              class="absolute right-0 top-full mt-3 z-100 origin-top-right"
            >
              <NotificationPanel @close="notifOpen = false" />
            </div>
          </Transition>
        </div>

        <UDropdownMenu :items="userMenuItems" :content="{ align: 'end' }">
          <button class="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity cursor-pointer">
            <div class="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {{ user?.initials ?? 'YA' }}
            </div>
            <span class="text-white/90 whitespace-nowrap font-medium">{{ user?.name ?? 'Yuri Andrade' }}</span>
            <UIcon name="i-lucide-chevron-down" class="text-white/50 w-4 h-4" />
          </button>
        </UDropdownMenu>
      </div>

    </div>
  </header>
</template>
