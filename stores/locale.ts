import { defineStore } from 'pinia'
import type { Locale } from '~/types'

interface LocaleState {
  currentLocale: Locale
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => ({
    currentLocale: 'en',
  }),

  getters: {
    getLocale: (state) => state.currentLocale,
  },

  actions: {
    setLocale(locale: Locale) {
      this.currentLocale = locale

      // Update i18n locale
      const { $i18n } = useNuxtApp()
      if ($i18n) {
        $i18n.setLocale(locale)
      }

      // Also save to cookie for persistence
      if (process.client) {
        document.cookie = `i18n_redirected=${locale};path=/;max-age=31536000`
      }
    },

    initializeLocale() {
      if (process.client) {
        // Read from i18n cookie
        const cookies = document.cookie.split(';')
        const i18nCookie = cookies.find(c => c.trim().startsWith('i18n_redirected='))

        if (i18nCookie) {
          const savedLocale = i18nCookie.split('=')[1] as Locale
          if (savedLocale && ['en', 'ru', 'uz'].includes(savedLocale)) {
            this.currentLocale = savedLocale
            const { $i18n } = useNuxtApp()
            if ($i18n) {
              $i18n.setLocale(savedLocale)
            }
          }
        }
      }
    },
  },

  persist: true,
})
