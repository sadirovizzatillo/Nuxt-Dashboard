import { defineStore } from 'pinia'
import type { UserData, UsersResponse, UserFilters, PaginationParams } from '~/types'

interface UsersState {
  users: UserData[]
  currentUser: UserData | null
  total: number
  loading: boolean
  error: string | null
  filters: UserFilters
  pagination: PaginationParams
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    currentUser: null,
    total: 0,
    loading: false,
    error: null,
    filters: {},
    pagination: {
      limit: 10,
      skip: 0,
    },
  }),

  getters: {
    getUsers: (state) => state.users,
    getCurrentUser: (state) => state.currentUser,
    getTotalUsers: (state) => state.total,
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const { limit, skip } = this.pagination

        const response = await apiFetch<UsersResponse>(`/users?limit=${limit}&skip=${skip}`)
        this.users = response.users
        this.total = response.total
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch users'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: number) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const response = await apiFetch<UserData>(`/users/${id}`)
        this.currentUser = response
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchUsers(query: string) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const response = await apiFetch<UsersResponse>(`/users/search?q=${query}`)
        this.users = response.users
        this.total = response.total
      } catch (error: any) {
        this.error = error.message || 'Failed to search users'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addUser(user: any) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const response = await apiFetch<UserData>('/users/add', {
          method: 'POST',
          body: user,
        })
        this.users.unshift(response)
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to add user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, user: any) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const response = await apiFetch<UserData>(`/users/${id}`, {
          method: 'PUT',
          body: user,
        })
        
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = response
        }
        
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to update user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        await apiFetch(`/users/${id}`, {
          method: 'DELETE',
        })
        
        this.users = this.users.filter(u => u.id !== id)
      } catch (error: any) {
        this.error = error.message || 'Failed to delete user'
        throw error
      } finally {
        this.loading = false
      }
    },

    setPagination(pagination: PaginationParams) {
      this.pagination = pagination
    },

    setFilters(filters: UserFilters) {
      this.filters = filters
    },
  },
})
