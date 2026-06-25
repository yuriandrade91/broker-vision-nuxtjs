import type { AppNotification } from '~/types/notification'

const _notifications = ref<AppNotification[]>([
  {
    id: 1,
    type: 'cotacao',
    title: 'Cotação em análise',
    message: 'CT-00490 — Logística Omega está sendo analisada pela seguradora.',
    time: '2 min',
    read: false,
    icon: 'i-lucide-loader-circle',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    link: '/quotes/history',
  },
  {
    id: 2,
    type: 'apolice',
    title: 'Apólice emitida',
    message: 'CT-00478 — Construtora Alfa LTDA teve apólice APL-2025-0011 emitida.',
    time: '15 min',
    read: false,
    icon: 'i-lucide-shield-check',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    link: '/policies',
  },
  {
    id: 3,
    type: 'renovacao',
    title: 'Renovação próxima',
    message: 'APL-2025-0022 — Construtora Alfa LTDA vence em 13 dias. Renove agora.',
    time: '1h',
    read: false,
    icon: 'i-lucide-refresh-cw',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    link: '/policies',
  },
  {
    id: 4,
    type: 'cotacao',
    title: 'Cotação cancelada',
    message: 'CT-00462 — RH Group Consultoria teve cotação cancelada pela seguradora.',
    time: '3h',
    read: true,
    icon: 'i-lucide-file-x',
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500 dark:text-red-400',
    link: '/quotes/history',
  },
  {
    id: 5,
    type: 'sistema',
    title: 'Nova funcionalidade',
    message: 'O módulo de Seções de Produção está disponível. Explore agora.',
    time: '1d',
    read: true,
    icon: 'i-lucide-sparkles',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    link: '/production-sections',
  },
  {
    id: 6,
    type: 'renovacao',
    title: 'Renovação solicitada',
    message: 'APL-2024-0044 — Agroindústria Horizonte renovação em andamento.',
    time: '2d',
    read: true,
    icon: 'i-lucide-clock',
    iconBg: 'bg-slate-100 dark:bg-gray-800',
    iconColor: 'text-slate-500 dark:text-gray-400',
    link: '/policies',
  },
])

export function useNotifications() {
  const notifications = _notifications

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const hasUnread = computed(() => unreadCount.value > 0)

  function markAsRead(id: number) {
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  }

  function markAllAsRead() {
    notifications.value.forEach(n => { n.read = true })
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function add(notification: Omit<AppNotification, 'id' | 'read'>) {
    notifications.value.unshift({
      ...notification,
      id: Date.now(),
      read: false,
    })
  }

  return { notifications, unreadCount, hasUnread, markAsRead, markAllAsRead, remove, add }
}
