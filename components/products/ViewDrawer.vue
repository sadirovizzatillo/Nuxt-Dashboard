<template>
  <a-drawer
    v-model:open="drawerVisible"
    :title="t('products.productDetails')"
    placement="right"
    width="600"
  >
    <div v-if="product" class="product-details">
      <!-- Product Header -->
      <div class="text-center mb-6">
        <a-image
          :src="product.thumbnail"
          :width="200"
          class="rounded-lg mb-4"
          :fallback="'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgesATbbEXJ0BYQY='"
        />
        <h2 class="text-xl font-bold dark:text-white">{{ product.title }}</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ product.category }}</p>
        <div class="mt-2">
          <a-rate :value="Number(product.rating)" disabled allow-half />
          <span class="ml-2 text-gray-500">({{ product.rating }})</span>
        </div>
      </div>

      <!-- Price Section -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 text-center">
        <div class="text-3xl font-bold text-green-600">${{ product.price?.toFixed(2) }}</div>
        <div v-if="product.discountPercentage > 0" class="text-red-500">
          -{{ product.discountPercentage }}% {{ t('products.discount') }}
        </div>
      </div>

      <!-- Description -->
      <a-descriptions bordered :column="1" size="small" class="mb-4">
        <a-descriptions-item :label="t('products.description')">
          {{ product.description }}
        </a-descriptions-item>
      </a-descriptions>

      <!-- Basic Info -->
      <a-divider>{{ t('products.basicInfo') }}</a-divider>
      <a-descriptions bordered :column="2" size="small">
        <a-descriptions-item :label="t('products.brand')">
          {{ product.brand || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.sku')">
          {{ product.sku }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.stock')">
          <a-tag :color="getStockColor(product.stock)">
            {{ product.stock }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.availabilityStatus')">
          <a-tag :color="getAvailabilityColor(product.availabilityStatus)">
            {{ product.availabilityStatus }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.minOrderQty')">
          {{ product.minimumOrderQuantity }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.weight')">
          {{ product.weight }} kg
        </a-descriptions-item>
      </a-descriptions>

      <!-- Dimensions -->
      <a-divider>{{ t('products.dimensions') }}</a-divider>
      <a-descriptions bordered :column="3" size="small">
        <a-descriptions-item :label="t('products.width')">
          {{ product.dimensions?.width }} cm
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.height')">
          {{ product.dimensions?.height }} cm
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.depth')">
          {{ product.dimensions?.depth }} cm
        </a-descriptions-item>
      </a-descriptions>

      <!-- Shipping & Warranty -->
      <a-divider>{{ t('products.shippingAndWarranty') }}</a-divider>
      <a-descriptions bordered :column="1" size="small">
        <a-descriptions-item :label="t('products.warrantyInformation')">
          {{ product.warrantyInformation }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.shippingInformation')">
          {{ product.shippingInformation }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('products.returnPolicy')">
          {{ product.returnPolicy }}
        </a-descriptions-item>
      </a-descriptions>

      <!-- Tags -->
      <a-divider>{{ t('products.tags') }}</a-divider>
      <div class="mb-4">
        <a-tag v-for="tag in product.tags" :key="tag" color="blue" class="mb-1">
          {{ tag }}
        </a-tag>
        <span v-if="!product.tags?.length" class="text-gray-400">-</span>
      </div>

      <!-- Images Gallery -->
      <a-divider>{{ t('products.images') }}</a-divider>
      <a-image-preview-group>
        <a-space wrap>
          <a-image
            v-for="(image, index) in product.images"
            :key="index"
            :src="image"
            :width="100"
            class="rounded"
          />
        </a-space>
      </a-image-preview-group>
      <div v-if="!product.images?.length" class="text-gray-400">-</div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  product: any
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const { t } = useI18n()

const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const getStockColor = (stock: number) => {
  if (stock > 50) return 'green'
  if (stock > 0) return 'orange'
  return 'red'
}

const getAvailabilityColor = (status: string) => {
  switch (status) {
    case 'In Stock':
      return 'green'
    case 'Low Stock':
      return 'orange'
    case 'Out of Stock':
      return 'red'
    default:
      return 'default'
  }
}
</script>

<style scoped>
.product-details :deep(.ant-descriptions-item-label) {
  font-weight: 600;
}
</style>
