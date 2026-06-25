<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })
defineProps<{
  title: string
  description?: string
  confirmLabel?: string
  confirmColor?: 'error' | 'warning' | 'success' | 'neutral'
  cancelLabel?: string
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
const { t } = useI18n()

function onConfirm() {
  open.value = false
  emit('confirm')
}

function onCancel() {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <UModal v-model:open="open" :title="title" :description="description">
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton color="neutral" variant="outline" @click="onCancel">
          {{ cancelLabel ?? $t('common.cancel') }}
        </UButton>
        <UButton :color="confirmColor ?? 'error'" @click="onConfirm">
          {{ confirmLabel ?? $t('common.confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
