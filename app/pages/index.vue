<script setup lang="ts">
definePageMeta({ layout: false })

const { t } = useI18n()

useHead({
  title: 'Login - BrokerVision',
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
})

const router = useRouter()

const username = ref('')
const password = ref('')
const remember = ref(false)
const submitting = ref(false)

const usernameError = computed(() => {
  if (!username.value) return t('login.errors.usernameRequired')
  if (username.value.length < 3) return t('login.errors.usernameMinLength')
  return ''
})

const passwordError = computed(() => {
  if (!password.value) return t('login.errors.passwordRequired')
  if (password.value.length < 6) return t('login.errors.passwordMinLength')
  return ''
})

const isValid = computed(() => !usernameError.value && !passwordError.value)

function submit() {
  if (!isValid.value) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    router.push('/home')
  }, 300)
}
</script>

<template>
  <div class="min-h-screen bg-[#0b2540] flex items-center justify-center p-6">
    <UCard class="max-w-4xl w-full overflow-hidden bg-transparent">
      <div class="flex flex-col lg:flex-row">
        <div class="w-full lg:w-1/2 p-10 bg-linear-to-b from-sky-700 to-sky-900 text-white flex flex-col">
          <div class="flex items-center gap-3">
            <div class="bg-white text-[#0b2540] font-semibold rounded-full px-3 py-1 text-sm">BrokerVision</div>
            <h2 class="text-2xl font-bold">{{ $t('login.appName') }}</h2>
          </div>
          <p class="mt-6 text-sky-100/90 leading-relaxed">
            {{ $t('login.appSubtitle') }}
          </p>
          <div class="mt-auto text-sm text-sky-100/80">{{ $t('login.copyright', { year: new Date().getFullYear() }) }}</div>
        </div>

        <div class="w-full lg:w-1/2 p-10 bg-white flex items-center">
          <div class="w-full">
            <h1 class="text-2xl font-semibold text-slate-800">{{ $t('login.signIn') }}</h1>
            <p class="text-sm text-slate-500 mt-1">{{ $t('login.appSubtitle') }}</p>

            <form class="mt-6 space-y-4" @submit.prevent="submit">
              <UFormField :label="$t('login.username')">
                <UInput
                  v-model="username"
                  placeholder="seu.usuario"
                  class="mt-1 w-full"
                  :class="usernameError ? 'border-rose-600 ring-1 ring-rose-100' : ''"
                />
                <p v-if="usernameError" class="text-xs text-rose-600 mt-1">{{ usernameError }}</p>
              </UFormField>

              <UFormField :label="$t('login.password')">
                <UInput
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="mt-1 w-full"
                  :class="passwordError ? 'border-rose-600 ring-1 ring-rose-100' : ''"
                />
                <p v-if="passwordError" class="text-xs text-rose-600 mt-1">{{ passwordError }}</p>
              </UFormField>

              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input v-model="remember" type="checkbox" class="h-4 w-4" />
                  <span>{{ $t('login.remember') }}</span>
                </label>
                <NuxtLink to="/forgot" class="text-sm text-sky-600 hover:underline">{{ $t('login.forgotPassword') }}</NuxtLink>
              </div>

              <UButton type="submit" :disabled="!isValid || submitting" class="w-full" color="primary">
                <span v-if="!submitting">{{ $t('login.signIn') }}</span>
                <span v-else>{{ $t('login.submitting') }}</span>
              </UButton>
            </form>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
