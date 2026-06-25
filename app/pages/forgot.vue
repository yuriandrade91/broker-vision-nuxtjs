<script setup lang="ts">
definePageMeta({ layout: false })

const { t } = useI18n()

useHead({ title: t('forgot.pageTitle') })

const router = useRouter()
const email = ref('')
const submitted = ref(false)
const submitting = ref(false)

const emailError = computed(() => {
  if (!email.value) return t('forgot.errors.emailRequired')
  if (!isValidEmail(email.value)) return t('forgot.errors.emailInvalid')
  return ''
})

const isValid = computed(() => !emailError.value)

function submit() {
  if (!isValid.value) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    submitted.value = true
  }, 500)
}
</script>

<template>
  <div class="min-h-screen bg-[#0b2540] flex items-center justify-center p-6">
    <UCard class="max-w-md w-full bg-white dark:bg-gray-900">
      <div class="p-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 mb-6">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          {{ $t('forgot.backToLogin') }}
        </NuxtLink>

        <div v-if="!submitted">
          <h1 class="text-2xl font-semibold text-slate-800 dark:text-white">{{ $t('forgot.title') }}</h1>
          <p class="text-sm text-slate-500 dark:text-gray-400 mt-1">
            {{ $t('forgot.subtitle') }}
          </p>

          <form class="mt-6 space-y-4" @submit.prevent="submit">
            <UFormField :label="$t('forgot.email')">
              <UInput
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="mt-1 w-full"
                :class="emailError ? 'border-rose-600 ring-1 ring-rose-100' : ''"
              />
              <p v-if="emailError" class="text-xs text-rose-600 mt-1">{{ emailError }}</p>
            </UFormField>

            <UButton type="submit" :disabled="!isValid || submitting" class="w-full" color="primary">
              <span v-if="!submitting">{{ $t('forgot.send') }}</span>
              <span v-else>{{ $t('forgot.sending') }}</span>
            </UButton>
          </form>
        </div>

        <div v-else class="text-center py-6">
          <div class="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-mail-check" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <h2 class="text-xl font-semibold text-slate-800 dark:text-white">{{ $t('forgot.emailSent') }}</h2>
          <p class="text-sm text-slate-500 dark:text-gray-400 mt-2">
            {{ $t('forgot.checkInbox', { email }) }}
          </p>
          <UButton class="mt-6 w-full" color="neutral" variant="outline" @click="router.push('/')">
            {{ $t('forgot.backToLoginBtn') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
