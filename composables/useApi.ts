import type { FetchOptions } from 'ofetch'

export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  const apiFetch = <T>(endpoint: string, options: FetchOptions = {}) => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    return $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      ...options,
      headers,
    })
  }

  return {
    apiFetch,
  }
}
