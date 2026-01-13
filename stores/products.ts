import { defineStore } from 'pinia'
import type { Product, ProductsResponse, ProductFilters, PaginationParams } from '~/types'

export interface SortParams {
  field: 'title' | 'category' | 'price' | 'stock' | 'rating' | null
  order: 'ascend' | 'descend' | null
}

interface ProductsState {
  products: Product[]
  allProducts: Product[] // For client-side filtering
  currentProduct: Product | null
  total: number
  loading: boolean
  error: string | null
  filters: ProductFilters
  pagination: PaginationParams
  sort: SortParams
  selectedIds: number[]
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    allProducts: [],
    currentProduct: null,
    total: 0,
    loading: false,
    error: null,
    filters: {
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      stockStatus: undefined,
      search: undefined,
    },
    pagination: {
      limit: 10,
      skip: 0,
    },
    sort: {
      field: null,
      order: null,
    },
    selectedIds: [],
  }),

  getters: {
    getProducts: (state) => state.products,
    getCurrentProduct: (state) => state.currentProduct,
    getTotalProducts: (state) => state.total,
    isLoading: (state) => state.loading,
    getSelectedIds: (state) => state.selectedIds,
    hasSelection: (state) => state.selectedIds.length > 0,
    selectionCount: (state) => state.selectedIds.length,
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const { category, search } = this.filters

        let response: ProductsResponse

        // Use category endpoint if category is selected
        if (category) {
          response = await apiFetch<ProductsResponse>(`/products/category/${category}`)
        } else if (search) {
          response = await apiFetch<ProductsResponse>(`/products/search?q=${search}`)
        } else {
          // Fetch all products for client-side filtering/sorting
          response = await apiFetch<ProductsResponse>('/products?limit=0')
        }

        // Store all products for filtering
        this.allProducts = response.products

        // Apply client-side filters
        this.applyFiltersAndSort()
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch products'
        throw error
      } finally {
        this.loading = false
      }
    },

    applyFiltersAndSort() {
      let filtered = [...this.allProducts]

      // Apply price range filter
      if (this.filters.minPrice !== undefined && this.filters.minPrice !== null) {
        filtered = filtered.filter(p => p.price >= this.filters.minPrice!)
      }
      if (this.filters.maxPrice !== undefined && this.filters.maxPrice !== null) {
        filtered = filtered.filter(p => p.price <= this.filters.maxPrice!)
      }

      // Apply stock status filter
      if (this.filters.stockStatus) {
        switch (this.filters.stockStatus) {
          case 'in_stock':
            filtered = filtered.filter(p => p.stock > 50)
            break
          case 'low_stock':
            filtered = filtered.filter(p => p.stock > 0 && p.stock <= 50)
            break
          case 'out_of_stock':
            filtered = filtered.filter(p => p.stock === 0)
            break
        }
      }

      // Apply sorting
      if (this.sort.field && this.sort.order) {
        const multiplier = this.sort.order === 'ascend' ? 1 : -1
        filtered.sort((a, b) => {
          const aVal = a[this.sort.field!]
          const bVal = b[this.sort.field!]

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * multiplier
          }
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * multiplier
          }
          return 0
        })
      }

      // Store total before pagination
      this.total = filtered.length

      // Apply pagination
      const { limit, skip } = this.pagination
      if (limit > 0) {
        this.products = filtered.slice(skip, skip + limit)
      } else {
        this.products = filtered
      }
    },

    async fetchProductById(id: number) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const response = await apiFetch<Product>(`/products/${id}`)
        this.currentProduct = response
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch product'
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchProducts(query: string) {
      this.filters.search = query
      this.pagination.skip = 0
      await this.fetchProducts()
    },

    async addProduct(product: any) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const response = await apiFetch<Product>('/products/add', {
          method: 'POST',
          body: product,
        })
        this.allProducts.unshift(response)
        this.applyFiltersAndSort()
        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to add product'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number, product: any) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        const response = await apiFetch<Product>(`/products/${id}`, {
          method: 'PUT',
          body: product,
        })

        const index = this.allProducts.findIndex(p => p.id === id)
        if (index !== -1) {
          this.allProducts[index] = response
        }
        this.applyFiltersAndSort()

        return response
      } catch (error: any) {
        this.error = error.message || 'Failed to update product'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: number) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()
        await apiFetch(`/products/${id}`, {
          method: 'DELETE',
        })

        this.allProducts = this.allProducts.filter(p => p.id !== id)
        this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id)
        this.applyFiltersAndSort()
      } catch (error: any) {
        this.error = error.message || 'Failed to delete product'
        throw error
      } finally {
        this.loading = false
      }
    },

    async bulkDeleteProducts(ids: number[]) {
      this.loading = true
      this.error = null

      try {
        const { apiFetch } = useApi()

        // Delete all products in parallel
        await Promise.all(
          ids.map(id =>
            apiFetch(`/products/${id}`, {
              method: 'DELETE',
            })
          )
        )

        // Remove from local state
        this.allProducts = this.allProducts.filter(p => !ids.includes(p.id))
        this.selectedIds = []
        this.applyFiltersAndSort()

        return ids.length
      } catch (error: any) {
        this.error = error.message || 'Failed to delete products'
        throw error
      } finally {
        this.loading = false
      }
    },

    setPagination(pagination: PaginationParams) {
      this.pagination = pagination
      this.applyFiltersAndSort()
    },

    setFilters(filters: Partial<ProductFilters>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.skip = 0 // Reset to first page when filtering
    },

    setSort(sort: SortParams) {
      this.sort = sort
      this.applyFiltersAndSort()
    },

    setSelectedIds(ids: number[]) {
      this.selectedIds = ids
    },

    toggleSelection(id: number) {
      const index = this.selectedIds.indexOf(id)
      if (index === -1) {
        this.selectedIds.push(id)
      } else {
        this.selectedIds.splice(index, 1)
      }
    },

    selectAll() {
      this.selectedIds = this.products.map(p => p.id)
    },

    clearSelection() {
      this.selectedIds = []
    },

    resetFilters() {
      this.filters = {
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        stockStatus: undefined,
        search: undefined,
      }
      this.sort = {
        field: null,
        order: null,
      }
      this.pagination.skip = 0
    },
  },
})
