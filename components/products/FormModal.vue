<template>
    <a-modal
        v-model:open="modalVisible"
        :title="isEdit ? t('products.editProduct') : t('products.addProduct')"
        width="800px"
        @cancel="handleCancel"
    >
      <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item name="title" :label="t('products.productName')">
              <a-input v-model:value="formState.title" :placeholder="t('products.productName') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="category" :label="t('products.category')">
              <a-input v-model:value="formState.category" :placeholder="t('products.category') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="description" :label="t('products.description')">
              <a-textarea v-model:value="formState.description" :rows="3" :placeholder="t('products.description') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="price" :label="t('products.price')">
              <a-input-number
                  v-model:value="formState.price"
                  :min="0"
                  style="width: 100%"
                  :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :placeholder="t('products.price') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="stock" :label="t('products.stock')">
              <a-input-number
                  v-model:value="formState.stock"
                  :min="0"
                  style="width: 100%"
                  :placeholder="t('products.stock') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="discountPercentage" :label="t('products.discount')">
              <a-input-number
                  v-model:value="formState.discountPercentage"
                  :min="0"
                  :max="100"
                  style="width: 100%"
                  :formatter="value => `${value}%`"
                  :placeholder="t('products.discount') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="brand" :label="t('products.brand')">
              <a-input v-model:value="formState.brand" :placeholder="t('products.brand') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="sku" :label="t('products.sku')">
              <a-input v-model:value="formState.sku" :placeholder="t('products.sku') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="weight" :label="t('products.weight')">
              <a-input-number
                  v-model:value="formState.weight"
                  :min="0"
                  style="width: 100%"
                  addon-after="kg"
                  :placeholder="t('products.weight') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="rating" :label="t('products.rating')">
              <a-input-number
                  v-model:value="formState.rating"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  style="width: 100%"
                  :placeholder="t('products.rating') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="minimumOrderQuantity" :label="t('products.minOrderQty')">
              <a-input-number
                  v-model:value="formState.minimumOrderQuantity"
                  :min="1"
                  style="width: 100%"
                  :placeholder="t('products.minOrderQty') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('products.width')">
              <a-input-number
                  v-model:value="formState.dimensions.width"
                  :min="0"
                  style="width: 100%"
                  addon-after="cm"
                  :placeholder="t('products.width') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('products.height')">
              <a-input-number
                  v-model:value="formState.dimensions.height"
                  :min="0"
                  style="width: 100%"
                  addon-after="cm"
                  :placeholder="t('products.height') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('products.depth')">
              <a-input-number
                  v-model:value="formState.dimensions.depth"
                  :min="0"
                  style="width: 100%"
                  addon-after="cm"
                  :placeholder="t('products.depth') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="thumbnail" :label="t('products.thumbnail')">
              <a-input v-model:value="formState.thumbnail" :placeholder="t('products.thumbnail') + ' URL kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="availabilityStatus" :label="t('products.availabilityStatus')">
              <a-select v-model:value="formState.availabilityStatus" :placeholder="t('products.availabilityStatus') + ' tanlang'">
                <a-select-option value="In Stock">{{ t('products.inStock') }}</a-select-option>
                <a-select-option value="Low Stock">{{ t('products.lowStock') }}</a-select-option>
                <a-select-option value="Out of Stock">{{ t('products.outOfStock') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="images" :label="t('products.images')">
              <a-select
                  v-model:value="formState.images"
                  mode="tags"
                  :placeholder="t('products.images') + ' URL kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="tags" :label="t('products.tags')">
              <a-select
                  v-model:value="formState.tags"
                  mode="tags"
                  :placeholder="t('products.tags') + ' kiriting'"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="warrantyInformation" :label="t('products.warrantyInformation')">
              <a-input v-model:value="formState.warrantyInformation" :placeholder="t('products.warrantyInformation') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="shippingInformation" :label="t('products.shippingInformation')">
              <a-input v-model:value="formState.shippingInformation" :placeholder="t('products.shippingInformation') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item name="returnPolicy" :label="t('products.returnPolicy')">
              <a-textarea v-model:value="formState.returnPolicy" :rows="2" :placeholder="t('products.returnPolicy') + ' kiriting'" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template #footer>
        <a-button @click="handleCancel">{{ t('common.cancel') }}</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">
          {{ t('common.save') }}
        </a-button>
      </template>
    </a-modal>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const props = defineProps<{
  visible: boolean
  product: any
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

const productsStore = useProductsStore()
const { t } = useI18n()

const formRef = ref()
const loading = ref(false)

const isEdit = computed(() => !!props.product)

const modalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const formState = reactive({
  title: '',
  description: '',
  category: '',
  price: 0,
  discountPercentage: 0,
  stock: 0,
  brand: '',
  sku: '',
  rating: 4.5,
  weight: 0,
  dimensions: {
    width: 0,
    height: 0,
    depth: 0,
  },
  warrantyInformation: '',
  shippingInformation: '',
  availabilityStatus: 'In Stock',
  returnPolicy: '',
  minimumOrderQuantity: 1,
  images: [],
  thumbnail: '',
  tags: [],
})

const rules = {
  title: [{ required: true, message: t('validation.required') }],
  description: [{ required: true, message: t('validation.required') }],
  category: [{ required: true, message: t('validation.required') }],
  price: [{ required: true, message: t('validation.required') }],
  stock: [{ required: true, message: t('validation.required') }],
}

const resetForm = () => {
  Object.assign(formState, {
    title: '',
    description: '',
    category: '',
    price: 0,
    discountPercentage: 0,
    stock: 0,
    brand: '',
    sku: '',
    rating: 4.5,
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
    },
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: 'In Stock',
    returnPolicy: '',
    minimumOrderQuantity: 1,
    images: [],
    thumbnail: '',
    tags: [],
  })
}

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    Object.assign(formState, newProduct)
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await productsStore.updateProduct(props.product.id, formState)
      message.success(t('messages.updateSuccess'))
    } else {
      await productsStore.addProduct(formState)
      message.success(t('messages.createSuccess'))
    }

    emit('success')
  } catch (error: any) {
    message.error(error.message || t('messages.error'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}
</script>
