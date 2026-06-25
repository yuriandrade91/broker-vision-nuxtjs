<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })
defineProps<{ title?: string }>()
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="title"
    :ui="{ content: 'max-w-[40vw]' }"
  >
    <template #body>
      <slot name="body" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </USlideover>
</template>
