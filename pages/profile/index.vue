<template>
  <div class="profile-page">
    <div class="mb-6">
      <h1 class="text-2xl font-bold dark:text-white">{{ t('navigation.profile') }}</h1>
      <p class="text-gray-500 dark:text-gray-400">{{ t('profile.subtitle') }}</p>
    </div>

    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col :lg="24" :xl="24" :xxl="8">
          <a-card class="profile-card text-center">
            <div class="mb-4">
              <a-avatar :src="userData?.image" :size="120" class="profile-avatar">
                {{ userData?.firstName?.[0] }}{{ userData?.lastName?.[0] }}
              </a-avatar>
            </div>
            <h2 class="text-xl font-bold dark:text-white mb-1">
              {{ userData?.firstName }} {{ userData?.lastName }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400 mb-2">@{{ userData?.username }}</p>
            <a-tag :color="userData?.gender === 'male' ? 'blue' : 'pink'" class="mb-4">
              {{ userData?.gender === 'male' ? t('users.male') : t('users.female') }}
            </a-tag>

            <a-divider />

            <div class="text-left">
              <div class="flex items-center gap-3 mb-3">
                <MailOutlined class="text-gray-400" />
                <span class="dark:text-gray-300">{{ userData?.email }}</span>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <PhoneOutlined class="text-gray-400" />
                <span class="dark:text-gray-300">{{ userData?.phone }}</span>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <CalendarOutlined class="text-gray-400" />
                <span class="dark:text-gray-300">{{ userData?.birthDate }}</span>
              </div>
              <div class="flex items-center gap-3">
                <EnvironmentOutlined class="text-gray-400" />
                <span class="dark:text-gray-300">
                  {{ userData?.address?.city }}, {{ userData?.address?.country }}
                </span>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :lg="24" :xl="24" :xxl="16">
          <a-card class="mb-6" :title="t('users.personalInfo')">
            <a-descriptions :column="{ xs: 1, sm: 2, md: 3 }" bordered>
              <a-descriptions-item :label="t('users.firstName')">
                <span class="dark:text-gray-300">{{ userData?.firstName }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.lastName')">
                <span class="dark:text-gray-300">{{ userData?.lastName }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.maidenName')">
                <span class="dark:text-gray-300">{{ userData?.maidenName || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.age')">
                <span class="dark:text-gray-300">{{ userData?.age }} yosh</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.bloodGroup')">
                <a-tag color="red">{{ userData?.bloodGroup }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.eyeColor')">
                <span class="dark:text-gray-300">{{ userData?.eyeColor }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.height')">
                <span class="dark:text-gray-300">{{ userData?.height }} cm</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.weight')">
                <span class="dark:text-gray-300">{{ userData?.weight }} kg</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.university')">
                <span class="dark:text-gray-300">{{ userData?.university || '-' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card class="mb-6" :title="t('users.hairInfo')">
            <a-descriptions :column="{ xs: 1, sm: 2 }" bordered>
              <a-descriptions-item :label="t('users.hairColor')">
                <span class="dark:text-gray-300">{{ userData?.hair?.color || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.hairType')">
                <span class="dark:text-gray-300">{{ userData?.hair?.type || '-' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card class="mb-6" :title="t('users.address')">
            <a-descriptions :column="{ xs: 1, sm: 2, md: 3 }" bordered>
              <a-descriptions-item :label="t('users.streetAddress')" :span="3">
                <span class="dark:text-gray-300">{{ userData?.address?.address || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.city')">
                <span class="dark:text-gray-300">{{ userData?.address?.city || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.state')">
                <span class="dark:text-gray-300">{{ userData?.address?.state || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.postalCode')">
                <span class="dark:text-gray-300">{{ userData?.address?.postalCode || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.country')">
                <span class="dark:text-gray-300">{{ userData?.address?.country || '-' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card :title="t('users.companyInfo')">
            <a-descriptions :column="{ xs: 1, sm: 2, md: 3 }" bordered>
              <a-descriptions-item :label="t('users.companyName')">
                <span class="dark:text-gray-300">{{ userData?.company?.name || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.department')">
                <span class="dark:text-gray-300">{{ userData?.company?.department || '-' }}</span>
              </a-descriptions-item>
              <a-descriptions-item :label="t('users.title')">
                <span class="dark:text-gray-300">{{ userData?.company?.title || '-' }}</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import {
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons-vue'
import type { UserData } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const authStore = useAuthStore()
const { apiFetch } = useApi()

const loading = ref(true)
const userData = ref<UserData | null>(null)

const fetchUserData = async () => {
  if (!authStore.user?.id) return

  loading.value = true
  try {
    const response = await apiFetch<UserData>(`/users/${authStore.user.id}`)
    userData.value = response
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.profile-page {
  max-width: 1400px;
  margin: 0 auto;
}

.profile-card {
  border-radius: 12px;
}

.profile-avatar {
  border: 4px solid #6366f1;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}

.dark :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
  background-color: #1f2937;
  color: #9ca3af;
}

.dark :deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
  background-color: #273142;
}

.dark :deep(.ant-descriptions-bordered .ant-descriptions-view) {
  border-color: #374151;
}

.dark :deep(.ant-descriptions-bordered .ant-descriptions-item-label),
.dark :deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
  border-color: #374151;
}
</style>
