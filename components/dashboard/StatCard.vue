<template>
    <a-card class="stat-card hover:shadow-lg transition-all duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-1">
            {{ t(stat.title) }}
          </p>
          <h3 class="text-2xl font-bold dark:text-gray-400 mb-2">
            {{ formatValue(stat.value) }}
          </h3>
          <div class="flex items-center text-sm">
          <span
              :class="[
              'flex items-center gap-1',
              stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'
            ]"
          >
            <ArrowUpOutlined v-if="stat.changeType === 'up'" />
            <ArrowDownOutlined v-else />
            {{ Math.abs(stat.change) }}%
          </span>
            <span class="text-gray-500 dark:text-gray-400 ml-2">
            {{ t('common.fromYesterday') }}
          </span>
          </div>
        </div>
        <div
            class="icon-container rounded-full p-4"
            :style="{ backgroundColor: `${stat.color}20` }"
        >
          <component
              :is="getIcon(stat.icon)"
              :style="{ fontSize: '32px', color: stat.color }"
          />
        </div>
      </div>
    </a-card>
</template>

<script setup lang="ts">
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  FileTextOutlined,
} from '@ant-design/icons-vue'
import type { StatCard } from '~/types'

const { t } = useI18n()

const props = defineProps<{
  stat: StatCard
}>()

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    UserOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    FileTextOutlined,
  }
  return icons[iconName] || UserOutlined
}

const formatValue = (value: number | string) => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return value
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  border: none;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
