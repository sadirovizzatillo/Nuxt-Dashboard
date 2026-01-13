import { defineStore } from 'pinia'
import type { Theme } from '~/types'

interface ThemeState {
  theme: Theme
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    theme: 'light',
    sidebarCollapsed: false,
    mobileMenuOpen: false,
  }),

  getters: {
    isDark: (state) => state.theme === 'dark',
    isSidebarCollapsed: (state) => state.sidebarCollapsed,
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.applyTheme()
    },

    setTheme(theme: Theme) {
      this.theme = theme
      this.applyTheme()
    },

    applyTheme() {
      if (process.client) {
        const html = document.documentElement
        if (this.theme === 'dark') {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
        localStorage.setItem('theme', this.theme)
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      if (process.client) {
        localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
      }
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false
    },

    initializeTheme() {
      if (process.client) {
        const savedTheme = localStorage.getItem('theme') as Theme
        const savedSidebarState = localStorage.getItem('sidebarCollapsed')
        const isTabletOrMobile = window.innerWidth < 1024

        if (savedTheme) {
          this.theme = savedTheme
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          this.theme = prefersDark ? 'dark' : 'light'
        }

        // On tablet/mobile, always keep sidebar collapsed (use drawer instead)
        if (isTabletOrMobile) {
          this.sidebarCollapsed = true
          this.mobileMenuOpen = false
        } else if (savedSidebarState !== null) {
          this.sidebarCollapsed = savedSidebarState === 'true'
        }

        this.applyTheme()
      }
    },
  },

  persist: true,
})
