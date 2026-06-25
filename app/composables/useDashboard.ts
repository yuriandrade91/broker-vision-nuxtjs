import type { ActionCardItem, MetricItem } from '~/types/dashboard'

export function useDashboard() {
  const { t } = useI18n()

  const actionCards = computed<ActionCardItem[]>(() => [
    {
      id: 'new-quote',
      icon: 'i-lucide-plus',
      iconBg: 'bg-slate-100',
      title: t('actionCards.newQuote.title'),
      description: t('actionCards.newQuote.description'),
      cta: t('actionCards.newQuote.cta'),
      to: '/quotes/select-product',
      variant: 'primary',
    },
    {
      id: 'history',
      icon: 'i-lucide-bar-chart-2',
      iconBg: 'bg-teal-50',
      title: t('actionCards.history.title'),
      description: t('actionCards.history.description'),
      cta: t('actionCards.history.cta'),
      to: '/quotes/history',
      variant: 'outline',
    },
    {
      id: 'saved-quotes',
      icon: 'i-lucide-file-text',
      iconBg: 'bg-teal-50',
      title: t('actionCards.savedQuotes.title'),
      description: t('actionCards.savedQuotes.description'),
      cta: t('actionCards.savedQuotes.cta'),
      to: '/quotes/saved',
      variant: 'outline',
    },
    {
      id: 'policies',
      icon: 'i-lucide-shield-check',
      iconBg: 'bg-teal-50',
      title: t('actionCards.policies.title'),
      description: t('actionCards.policies.description'),
      cta: t('actionCards.policies.cta'),
      to: '/policies',
      variant: 'outline',
    },
  ])

  const metrics = computed<MetricItem[]>(() => [
    {
      id: 'active-quotes',
      icon: 'i-lucide-file-edit',
      label: t('metrics.activeQuotes.label'),
      value: '47',
      subtitle: t('metrics.activeQuotes.subtitle'),
      delta: 12,
    },
    {
      id: 'active-policies',
      icon: 'i-lucide-shield',
      label: t('metrics.activePolicies.label'),
      value: '284',
      subtitle: t('metrics.activePolicies.subtitle'),
      delta: 3,
    },
    {
      id: 'total-premium',
      icon: 'i-lucide-dollar-sign',
      label: t('metrics.totalPremium.label'),
      value: 'R$ 1.847.300',
      subtitle: t('metrics.totalPremium.subtitle'),
      delta: 18,
    },
  ])

  return { actionCards, metrics }
}
