<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold dark:text-white">{{ t('products.title') }}</h1>
      <a-space>
        <a-button
          v-if="productsStore.hasSelection"
          danger
          @click="showBulkDeleteConfirm"
        >
          <template #icon>
            <DeleteOutlined />
          </template>
          {{ t('products.bulkDelete') }} ({{ productsStore.selectionCount }})
        </a-button>
        <a-button type="primary" @click="showAddModal = true">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ t('products.addProduct') }}
        </a-button>
      </a-space>
    </div>

    <!-- Filters -->
    <a-card class="mb-4">
      <a-row :gutter="[16, 16]">
        <!-- Search -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-input-search
            v-model:value="searchQuery"
            :placeholder="t('common.search')"
            @search="handleSearch"
            allow-clear
          />
        </a-col>

        <!-- Category Filter -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-select
            v-model:value="filters.category"
            :placeholder="t('products.category')"
            style="width: 100%"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="">{{ t('products.allCategories') }}</a-select-option>
            <a-select-option
              v-for="category in categories"
              :key="category.slug"
              :value="category.slug"
            >
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-col>

        <!-- Price Range -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-input-group compact>
            <a-input-number
              v-model:value="filters.minPrice"
              :placeholder="t('products.minPrice')"
              :min="0"
              style="width: 50%"
              @change="handleFilterChange"
            />
            <a-input-number
              v-model:value="filters.maxPrice"
              :placeholder="t('products.maxPrice')"
              :min="0"
              style="width: 50%"
              @change="handleFilterChange"
            />
          </a-input-group>
        </a-col>

        <!-- Stock Status Filter -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-select
            v-model:value="filters.stockStatus"
            :placeholder="t('products.stockStatus')"
            style="width: 100%"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="in_stock">{{ t('products.inStock') }}</a-select-option>
            <a-select-option value="low_stock">{{ t('products.lowStock') }}</a-select-option>
            <a-select-option value="out_of_stock">{{ t('products.outOfStock') }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <!-- Filter Actions -->
      <a-row class="mt-4">
        <a-col :span="24">
          <a-space>
            <a-button @click="handleResetFilters">
              <template #icon>
                <ReloadOutlined />
              </template>
              {{ t('common.reset') }}
            </a-button>
            <a-button @click="handleExport">
              <template #icon>
                <ExportOutlined />
              </template>
              {{ t('common.export') }}
            </a-button>
          </a-space>
        </a-col>
<!--        <a-rate :value="4"></a-rate>-->
      </a-row>
    </a-card>

    <!-- Products Table -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="productsStore.products"
        :loading="productsStore.loading"
        :pagination="pagination"
        :row-selection="rowSelection"
        :row-key="(record: any) => record.id"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'thumbnail'">
            <a-avatar :src="record.thumbnail" :size="50" shape="square" />
          </template>

          <template v-else-if="column.key === 'title'">
            <a-tooltip :title="record.description">
              <span class="font-medium dark:text-white">{{ record.title }}</span>
            </a-tooltip>
          </template>

          <template v-else-if="column.key === 'price'">
            <span class="font-medium dark:text-white">${{ record.price.toFixed(2) }}</span>
          </template>

          <template v-else-if="column.key === 'rating'">
<!--            <ClientOnly>-->
            {{record.rating}}
            <!--              <a-rate :value="Number(record.rating)" allow-half />-->
<!--            </ClientOnly>-->
          </template>

          <template v-else-if="column.key === 'stock'">
            <a-tag :color="getStockColor(record.stock)">
              {{ record.stock }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <EyeOutlined />
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined />
              </a-button>
              <a-popconfirm
                :title="t('messages.deleteConfirm')"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">
                  <DeleteOutlined />
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add/Edit Product Modal -->
    <ProductsFormModal
      v-model:visible="showAddModal"
      :product="selectedProduct"
      @success="handleSuccess"
    />

    <!-- View Product Drawer -->
    <ProductsViewDrawer
      v-model:visible="showViewDrawer"
      :product="selectedProduct"
    />

    <!-- Bulk Delete Confirmation Modal -->
    <a-modal
      v-model:open="showBulkDeleteModal"
      :title="t('products.bulkDeleteConfirm')"
      @ok="handleBulkDelete"
      @cancel="showBulkDeleteModal = false"
      :ok-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      :ok-button-props="{ danger: true }"
      :confirm-loading="productsStore.loading"
    >
      <p>{{ t('products.bulkDeleteMessage', { count: productsStore.selectionCount }) }}</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'

definePageMeta({
  middleware: 'auth',
})

const productsStore = useProductsStore()
const { t } = useI18n()

const searchQuery = ref('')
const showAddModal = ref(false)
const showBulkDeleteModal = ref(false)
const showViewDrawer = ref(false)
const selectedProduct = ref(null)
const categories = ref<Array<{ slug: string; name: string }>>([])

// Local filter state
const filters = reactive({
  category: undefined as string | undefined,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  stockStatus: undefined as string | undefined,
})

// Columns with sorting
const columns = computed(() => [
  { title: t('common.image'), key: 'thumbnail', width: 80 },
  {
    title: t('products.productName'),
    dataIndex: 'title',
    key: 'title',
    width: 200,
    sorter: true,
    sortOrder: productsStore.sort.field === 'title' ? productsStore.sort.order : null,
  },
  {
    title: t('products.category'),
    dataIndex: 'category',
    key: 'category',
    sorter: true,
    sortOrder: productsStore.sort.field === 'category' ? productsStore.sort.order : null,
  },
  {
    title: t('products.price'),
    dataIndex: 'price',
    key: 'price',
    align: 'right' as const,
    width: 120,
    sorter: true,
    sortOrder: productsStore.sort.field === 'price' ? productsStore.sort.order : null,
  },
  {
    title: t('products.rating'),
    dataIndex: 'rating',
    key: 'rating',
    width: 150,
    sorter: true,
    sortOrder: productsStore.sort.field === 'rating' ? productsStore.sort.order : null,
  },
  {
    title: t('products.stock'),
    dataIndex: 'stock',
    key: 'stock',
    align: 'center' as const,
    width: 100,
    sorter: true,
    sortOrder: productsStore.sort.field === 'stock' ? productsStore.sort.order : null,
  },
  { title: t('common.actions'), key: 'action', fixed: 'right' as const, width: 150 },
])

// Row selection config
const rowSelection = computed(() => ({
  selectedRowKeys: productsStore.selectedIds,
  onChange: (selectedRowKeys: number[]) => {
    productsStore.setSelectedIds(selectedRowKeys)
  },
}))

// Pagination config
const pagination = computed(() => ({
  current: Math.floor(productsStore.pagination.skip / productsStore.pagination.limit) + 1,
  pageSize: productsStore.pagination.limit,
  total: productsStore.total,
  showSizeChanger: true,
  showTotal: (total: number) => `${t('common.total')} ${total}`,
}))

// Get stock color based on quantity
const getStockColor = (stock: number) => {
  if (stock > 50) return 'green'
  if (stock > 0) return 'orange'
  return 'red'
}

// Handle table changes (pagination, sorting)
const handleTableChange: TableProps['onChange'] = (pag, _filters, sorter: any) => {
  // Handle pagination
  if (pag.current && pag.pageSize) {
    productsStore.setPagination({
      limit: pag.pageSize,
      skip: (pag.current - 1) * pag.pageSize,
    })
  }

  // Handle sorting
  if (sorter.field) {
    productsStore.setSort({
      field: sorter.field as any,
      order: sorter.order || null,
    })
  } else {
    productsStore.setSort({ field: null, order: null })
  }
}

// Search handler
const handleSearch = async (value: string) => {
  productsStore.setFilters({ search: value || undefined })
  await productsStore.fetchProducts()
}

// Filter change handler with debounce
let filterTimeout: ReturnType<typeof setTimeout> | null = null
const handleFilterChange = () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(async () => {
    productsStore.setFilters({
      category: filters.category || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      stockStatus: filters.stockStatus as any,
    })
    await productsStore.fetchProducts()
  }, 300)
}

// Reset filters
const handleResetFilters = async () => {
  filters.category = undefined
  filters.minPrice = undefined
  filters.maxPrice = undefined
  filters.stockStatus = undefined
  searchQuery.value = ''
  productsStore.resetFilters()
  await productsStore.fetchProducts()
}

// View product
const handleView = (product: any) => {
  selectedProduct.value = product
  showViewDrawer.value = true
}

// Edit product
const handleEdit = (product: any) => {
  selectedProduct.value = product
  showAddModal.value = true
}

// Delete single product
const handleDelete = async (id: number) => {
  try {
    await productsStore.deleteProduct(id)
    message.success(t('messages.deleteSuccess'))
  } catch (error) {
    message.error(t('messages.error'))
  }
}

// Show bulk delete confirmation
const showBulkDeleteConfirm = () => {
  showBulkDeleteModal.value = true
}

// Bulk delete handler
const handleBulkDelete = async () => {
  try {
    const count = await productsStore.bulkDeleteProducts(productsStore.selectedIds)
    showBulkDeleteModal.value = false
    message.success(t('products.bulkDeleteSuccess', { count }))
  } catch (error) {
    message.error(t('messages.error'))
  }
}

// Success handler
const handleSuccess = () => {
  showAddModal.value = false
  selectedProduct.value = null
  // Don't refetch - store already updates local state
}

// Export handler
const handleExport = async () => {
  const productsToExport = productsStore.selectedIds.length > 0
    ? productsStore.products.filter(p => productsStore.selectedIds.includes(p.id))
    : productsStore.products

  if (productsToExport.length === 0) {
    message.warning(t('messages.noDataToExport'))
    return
  }

  const XLSX = await import('xlsx')

  const data = productsToExport.map(p => ({
    ID: p.id,
    [t('products.productName')]: p.title,
    [t('products.category')]: p.category,
    [t('products.price')]: p.price,
    [t('products.rating')]: p.rating,
    [t('products.stock')]: p.stock,
    [t('products.brand')]: p.brand || '',
    SKU: p.sku,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Products')
  XLSX.writeFile(wb, `products-${new Date().toISOString().split('T')[0]}.xlsx`)

  message.success(t('messages.exportSuccess'))
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<Array<{ slug: string; name: string }>>(
      `${config.public.apiBase}/products/categories`
    )
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Initial data fetch
onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    fetchCategories(),
  ])
})

// Cleanup on unmount
onUnmounted(() => {
  productsStore.clearSelection()
})
</script>
