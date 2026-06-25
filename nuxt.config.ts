// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' }
    ],
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix'
  },

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
