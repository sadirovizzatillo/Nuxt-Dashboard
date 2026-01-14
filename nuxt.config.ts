export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',
  css: ['~/assets/css/main.css'],
  modules: ['@ant-design-vue/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@pinia/nuxt'],
  ant: { extractStyle: true },
  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'uz', file: 'uz.json', name: "O'zbekcha" },
      { code: 'ru', file: 'ru.json', name: 'Русский' }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    }
  },
    build: {
        transpile: ['chart.js', 'vue-chartjs']
    },
    runtimeConfig: {
        public: {
            apiBase: 'https://dummyjson.com'
        }
    },
})
