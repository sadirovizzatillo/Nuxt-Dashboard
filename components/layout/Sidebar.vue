<template>
  <!-- Mobile Drawer -->
  <a-drawer
    v-model:open="mobileMenuOpen"
    placement="left"
    :closable="false"
    :width="250"
    class="mobile-drawer md:hidden"
    :body-style="{ padding: 0 }"
    :header-style="{ display: 'none' }"
  >
    <div
      class="sidebar-content h-full"
      :class="themeStore.isDark ? 'bg-[#273142]' : 'bg-white'"
    >
      <div class="logo-container p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
          DashStack
        </h1>
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :theme="themeStore.isDark ? 'dark' : 'light'"
        class="border-none mt-4"
      >
        <a-menu-item key="dashboard" @click="handleNavigation('/')">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>{{ t('navigation.dashboard') }}</span>
        </a-menu-item>

        <a-menu-item key="products" @click="handleNavigation('/products')">
          <template #icon>
            <AppstoreOutlined />
          </template>
          <span>{{ t('navigation.products') }}</span>
        </a-menu-item>

        <a-menu-item key="users" @click="handleNavigation('/users')">
          <template #icon>
            <UserOutlined />
          </template>
          <span>{{ t('navigation.users') }}</span>
        </a-menu-item>

        <a-menu-item key="logout" @click="handleLogout" class="mt-auto">
          <template #icon>
            <LogoutOutlined />
          </template>
          <span>{{ t('auth.logout') }}</span>
        </a-menu-item>
      </a-menu>
    </div>
  </a-drawer>

  <!-- Desktop Sidebar -->
  <a-layout-sider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    :width="250"
    :collapsed-width="80"
    class="sidebar !bg-white dark:!bg-[#273142] hidden md:block"
    :style="{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
    }"
  >
    <div class="logo-container p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
      <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400" v-if="!collapsed">
        DashStack
      </h1>
      <span class="text-xl font-bold text-blue-600 dark:text-blue-400" v-else>DS</span>
    </div>

    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :theme="themeStore.isDark ? 'dark' : 'light'"
      class="border-none mt-4"
    >
      <a-menu-item key="dashboard" @click="navigateTo('/')">
        <template #icon>
          <DashboardOutlined />
        </template>
        <span>{{ t('navigation.dashboard') }}</span>
      </a-menu-item>

      <a-menu-item key="products" @click="navigateTo('/products')">
        <template #icon>
          <AppstoreOutlined />
        </template>
        <span>{{ t('navigation.products') }}</span>
      </a-menu-item>

      <a-menu-item key="users" @click="navigateTo('/users')">
        <template #icon>
          <UserOutlined />
        </template>
        <span>{{ t('navigation.users') }}</span>
      </a-menu-item>

      <a-menu-item key="logout" @click="handleLogout" class="mt-auto">
        <template #icon>
          <LogoutOutlined />
        </template>
        <span>{{ t('auth.logout') }}</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const route = useRoute()

const { t } = useI18n()

const collapsed = computed({
  get: () => themeStore.sidebarCollapsed,
  set: (value) => {
    if (value !== themeStore.sidebarCollapsed) {
      themeStore.toggleSidebar()
    }
  },
})

const mobileMenuOpen = computed({
  get: () => themeStore.mobileMenuOpen,
  set: (value) => {
    if (value) {
      themeStore.toggleMobileMenu()
    } else {
      themeStore.closeMobileMenu()
    }
  },
})

const selectedKeys = computed(() => {
  const path = route.path
  if (path === '/') return ['dashboard']
  if (path.startsWith('/products')) return ['products']
  if (path.startsWith('/users')) return ['users']
  return []
})

const handleNavigation = (path: string) => {
  navigateTo(path)
  themeStore.closeMobileMenu()
}

const handleLogout = () => {
  themeStore.closeMobileMenu()
  authStore.logout()
}
</script>

<style scoped>
.sidebar {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.logo-container {
  height: 64px;
}

:deep(.ant-menu) {
  background: transparent !important;
}

:deep(.ant-menu-item) {
  margin: 4px 8px;
  border-radius: 8px;
}

:deep(.ant-menu-item-selected) {
  background-color: #e6f0ff !important;
}

:global(.dark) :deep(.ant-menu-item-selected) {
  background-color: rgba(59, 130, 246, 0.2) !important;
}
</style>
