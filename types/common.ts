export interface PaginationParams {
  limit: number
  skip: number
}

export interface SortParams {
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface StatCard {
  title: string
  value: number | string
  change: number
  changeType: 'up' | 'down'
  icon: string
  color: string
}

export interface MenuItem {
  key: string
  label: string
  icon: string
  path: string
  children?: MenuItem[]
}

export type Theme = 'light' | 'dark'
export type Locale = 'en' | 'ru' | 'uz'
