import { defineStore } from 'pinia'
import type { StatCard } from '~/types'

interface DashboardState {
  stats: {
    totalUsers: number
    totalProducts: number
    totalPosts: number
    totalOrders: number
  }
  loading: boolean
  error: string | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalPosts: 0,
      totalOrders: 0,
    },
    loading: false,
    error: null,
  }),

  getters: {
    getStats: (state) => state.stats,
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchStatistics() {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()

        // Fetch all statistics in parallel
        const [usersRes, productsRes, postsRes] = await Promise.all([
          apiFetch<any>('/users?limit=0'),
          apiFetch<any>('/products?limit=0'),
          apiFetch<any>('/posts?limit=0'),
        ])

        this.stats = {
          totalUsers: usersRes.total || 0,
          totalProducts: productsRes.total || 0,
          totalPosts: postsRes.total || 0,
          totalOrders: 10293, // Mock data as API doesn't provide this
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch statistics'
        throw error
      } finally {
        this.loading = false
      }
    },

    getStatCards(): StatCard[] {
      return [
        {
          title: 'dashboard.totalUsers',
          value: this.stats.totalUsers,
          change: 8.5,
          changeType: 'up',
          icon: 'UserOutlined',
          color: '#4F46E5',
        },
        {
          title: 'dashboard.totalOrders',
          value: this.stats.totalOrders,
          change: 1.3,
          changeType: 'up',
          icon: 'ShoppingOutlined',
          color: '#F59E0B',
        },
        {
          title: 'dashboard.totalProducts',
          value: this.stats.totalProducts,
          change: 4.3,
          changeType: 'down',
          icon: 'AppstoreOutlined',
          color: '#10B981',
        },
        {
          title: 'dashboard.totalPosts',
          value: this.stats.totalPosts,
          change: 1.8,
          changeType: 'up',
          icon: 'FileTextOutlined',
          color: '#EF4444',
        },
      ]
    },
  },
})
