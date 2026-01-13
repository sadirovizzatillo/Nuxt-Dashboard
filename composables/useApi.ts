import type { FetchOptions } from 'ofetch'

let isRefreshing = false
let refreshPromise: Promise<any> | null = null

export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')
  const refreshToken = useCookie<string | null>('auth_refresh_token')
  const userCookie = useCookie<any>('auth_user')

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      return false
    }

    // If already refreshing, wait for the existing promise
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise
        return true
      } catch {
        return false
      }
    }

    isRefreshing = true
    refreshPromise = $fetch<any>(`${config.public.apiBase}/auth/refresh`, {
      method: 'POST',
      body: {
        refreshToken: refreshToken.value,
        expiresInMins: 60, // 1 hour
      },
    })

    try {
      const response = await refreshPromise
      token.value = response.accessToken
      refreshToken.value = response.refreshToken
      return true
    } catch (error) {
      // Refresh failed, clear auth data
      token.value = null
      refreshToken.value = null
      userCookie.value = null
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  }

  const apiFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    try {
      return await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers,
      })
    } catch (error: any) {
      // Check if it's a 401 Unauthorized error
      if (error?.response?.status === 401 && refreshToken.value && !endpoint.includes('/auth/refresh')) {
        // Try to refresh the token
        const refreshed = await refreshAccessToken()

        if (refreshed) {
          // Retry the original request with new token
          const newHeaders: Record<string, string> = {
            ...(options.headers as Record<string, string> || {}),
            Authorization: `Bearer ${token.value}`,
          }

          return await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
            ...options,
            headers: newHeaders,
          })
        } else {
          // Refresh failed, redirect to login
          if (import.meta.client) {
            navigateTo('/login')
          }
        }
      }

      throw error
    }
  }

  return {
    apiFetch,
    refreshAccessToken,
  }
}
