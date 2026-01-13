import { defineStore } from 'pinia'
import type { LoginCredentials, User, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const { apiFetch } = useApi()

  // Use cookies for SSR compatibility
  const tokenCookie = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })
  const refreshTokenCookie = useCookie<string | null>('auth_refresh_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
  })
  const userCookie = useCookie<User | null>('auth_user', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  // Reactive state
  const user = ref<User | null>(userCookie.value)
  const token = ref<string | null>(tokenCookie.value)
  const refreshToken = ref<string | null>(refreshTokenCookie.value)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const getUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value)
  const getToken = computed(() => token.value)

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null

    try {
      const response = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      const userData: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      }

      // Set reactive state
      user.value = userData
      token.value = response.accessToken
      refreshToken.value = response.refreshToken

      // Persist to cookies
      userCookie.value = userData
      tokenCookie.value = response.accessToken
      refreshTokenCookie.value = response.refreshToken

      return response
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return

    try {
      const response = await apiFetch<User>('/auth/me')

      user.value = response
      userCookie.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch user'
      throw err
    }
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) return

    try {
      const response = await apiFetch<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: {
          refreshToken: refreshToken.value,
        },
      })

      token.value = response.accessToken
      refreshToken.value = response.refreshToken
      tokenCookie.value = response.accessToken
      refreshTokenCookie.value = response.refreshToken

      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to refresh token'
      logout()
      throw err
    }
  }

  function logout() {
    // Clear reactive state
    user.value = null
    token.value = null
    refreshToken.value = null
    error.value = null

    // Clear cookies
    userCookie.value = null
    tokenCookie.value = null
    refreshTokenCookie.value = null

    navigateTo('/login')
  }

  // Initialize from cookies (for hydration)
  function initializeAuth() {
    if (tokenCookie.value && userCookie.value) {
      token.value = tokenCookie.value
      refreshToken.value = refreshTokenCookie.value
      user.value = userCookie.value
    }
  }

  return {
    // State
    user,
    token,
    refreshToken,
    loading,
    error,
    // Getters
    isAuthenticated,
    getUser,
    isLoggedIn,
    getToken,
    // Actions
    login,
    fetchUser,
    refreshAccessToken,
    logout,
    initializeAuth,
  }
})
