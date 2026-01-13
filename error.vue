<template>
  <div class="error-container">
    <a-card class="error-card w-full max-w-lg text-center">
      <div class="error-icon mb-6">
        <component :is="errorIcon" class="text-6xl" :class="errorIconClass" />
      </div>

      <h1 class="text-6xl font-bold mb-4" :class="errorTextClass">
        {{ error?.statusCode || 500 }}
      </h1>

      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ errorTitle }}
      </h2>

      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ errorDescription }}
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a-button type="primary" size="large" @click="handleGoHome">
          <template #icon>
            <HomeOutlined />
          </template>
          {{ t('errors.goHome') }}
        </a-button>

        <a-button size="large" @click="handleGoBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          {{ t('errors.goBack') }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  HomeOutlined,
  ArrowLeftOutlined,
  StopOutlined,
  FileSearchOutlined,
  WarningOutlined
} from '@ant-design/icons-vue'

const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const { t } = useI18n()

const errorIcon = computed(() => {
  switch (props.error?.statusCode) {
    case 403:
      return StopOutlined
    case 404:
      return FileSearchOutlined
    default:
      return WarningOutlined
  }
})

const errorIconClass = computed(() => {
  switch (props.error?.statusCode) {
    case 403:
      return 'text-red-500'
    case 404:
      return 'text-yellow-500'
    default:
      return 'text-orange-500'
  }
})

const errorTextClass = computed(() => {
  switch (props.error?.statusCode) {
    case 403:
      return 'text-red-500'
    case 404:
      return 'text-yellow-500'
    default:
      return 'text-orange-500'
  }
})

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 403:
      return t('errors.403.title')
    case 404:
      return t('errors.404.title')
    case 500:
      return t('errors.500.title')
    default:
      return t('errors.default.title')
  }
})

const errorDescription = computed(() => {
  switch (props.error?.statusCode) {
    case 403:
      return t('errors.403.description')
    case 404:
      return t('errors.404.description')
    case 500:
      return t('errors.500.description')
    default:
      return t('errors.default.description')
  }
})

const handleGoHome = () => {
  clearError({ redirect: '/' })
}

const handleGoBack = () => {
  const router = useRouter()
  router.back()
}
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
}

:deep(.ant-card-body) {
  padding: 48px;
}

.error-icon {
  display: flex;
  justify-content: center;
}
</style>
