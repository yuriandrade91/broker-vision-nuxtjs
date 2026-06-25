<script setup lang="ts">
import type { AppNotification } from '~/types/notification'

const emit = defineEmits<{ close: [] }>()

const { notifications, unreadCount, hasUnread, markAsRead, markAllAsRead, remove } = useNotifications()
const router = useRouter()

function handleClick(n: AppNotification) {
  markAsRead(n.id)
  if (n.link) {
    router.push(n.link)
    emit('close')
  }
}
</script>

<template>
  <div class="w-96 max-h-[540px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-xl ring-1 ring-slate-200 dark:ring-gray-700 overflow-hidden">

    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-gray-800 shrink-0">
      <div class="flex items-center gap-2.5">
        <h3 class="font-bold text-slate-800 dark:text-white text-sm">{{ $t('notifications.title') }}</h3>
        <span
          v-if="hasUnread"
          class="inline-flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full min-w-[18px] h-[18px] px-1"
        >
          {{ unreadCount }}
        </span>
      </div>
      <button
        v-if="hasUnread"
        class="text-xs text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer"
        @click="markAllAsRead"
      >
        {{ $t('notifications.markAllRead') }}
      </button>
    </div>

    <!-- Lista -->
    <div class="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-gray-800">

      <!-- Vazio -->
      <div v-if="!notifications.length" class="flex flex-col items-center justify-center py-14 gap-3 text-slate-400 dark:text-gray-500">
        <UIcon name="i-lucide-bell-off" class="w-10 h-10 opacity-30" />
        <p class="text-sm font-medium">{{ $t('notifications.empty') }}</p>
        <p class="text-xs">{{ $t('notifications.emptyDesc') }}</p>
      </div>

      <div
        v-for="n in notifications"
        :key="n.id"
        class="group relative flex items-start gap-3.5 px-5 py-3.5 cursor-pointer transition-colors"
        :class="n.read ? 'bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800/60' : 'bg-blue-50/40 dark:bg-blue-900/10 hover:bg-blue-50/60 dark:hover:bg-blue-900/20'"
        @click="handleClick(n)"
      >
        <!-- Dot não lida -->
        <div
          v-if="!n.read"
          class="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
        />

        <!-- Ícone -->
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          :class="n.iconBg"
        >
          <UIcon :name="n.icon" class="w-4.5 h-4.5" :class="n.iconColor" />
        </div>

        <!-- Conteúdo -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-800 dark:text-white leading-snug" :class="{ 'font-medium text-slate-600 dark:text-gray-300': n.read }">
            {{ n.title }}
          </p>
          <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
            {{ n.message }}
          </p>
          <p class="text-[10px] text-slate-400 dark:text-gray-500 mt-1 font-medium">
            {{ n.time === 'justNow' ? $t('notifications.justNow') : `${n.time} atrás` }}
          </p>
        </div>

        <!-- Remover -->
        <button
          class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-400 dark:text-gray-500 shrink-0 cursor-pointer"
          @click.stop="remove(n.id)"
        >
          <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
