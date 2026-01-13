<template>
    <a-layout-header
        class="header transition-theme flex items-center justify-between px-3 sm:px-4 md:px-6 shadow-sm"
        :style="{
          backgroundColor: themeStore.isDark ? '#273142' : '#ffffff',
          borderBottomColor: themeStore.isDark ? '#273142' : '#f0f0f0'
        }"
    >
      <div class="flex items-center gap-2 md:gap-4">
        <!-- Mobile Burger Menu (visible on mobile only) -->
        <a-button
            type="text"
            @click="themeStore.toggleMobileMenu()"
            class="trigger text-gray-600 dark:text-gray-300 md:hidden"
        >
          <MenuOutlined />
        </a-button>

        <!-- Desktop Sidebar Toggle (visible on md and up) -->
        <a-button
            type="text"
            @click="themeStore.toggleSidebar()"
            class="trigger text-gray-600 dark:text-gray-300 hidden md:flex"
        >
          <MenuFoldOutlined v-if="!themeStore.sidebarCollapsed" />
          <MenuUnfoldOutlined v-else />
        </a-button>

        <!-- Search Input - hidden on mobile, responsive width on tablet/desktop -->
        <a-input-search
            v-model:value="searchQuery"
            placeholder="Search..."
            class="hidden sm:block search-input"
            @search="handleSearch"
        />
      </div>

      <div class="flex items-center gap-1 sm:gap-2 md:gap-3">
        <!-- Language Selector -->
        <a-dropdown>
          <a-button type="text" class="language-btn flex items-center gap-1 md:gap-2 text-gray-600 dark:text-gray-300">
            <GlobalOutlined />
            <span class="hidden md:inline text-sm">{{ currentLanguage }}</span>
          </a-button>
          <template #overlay>
            <a-menu :theme="themeStore.isDark ? 'dark' : 'light'" @click="handleLanguageChange">
              <a-menu-item key="en">
              <span class="flex items-center gap-2" :style="{ color: themeStore.isDark ? '#ffffffd9' : '#000000d9' }">
                <span>🇬🇧</span>
                <span>English</span>
              </span>
              </a-menu-item>
              <a-menu-item key="ru">
              <span class="flex items-center gap-2" :style="{ color: themeStore.isDark ? '#ffffffd9' : '#000000d9' }">
                <span>🇷🇺</span>
                <span>Русский</span>
              </span>
              </a-menu-item>
              <a-menu-item key="uz">
              <span class="flex items-center gap-2" :style="{ color: themeStore.isDark ? '#ffffffd9' : '#000000d9' }">
                <span>🇺🇿</span>
                <span>O'zbek</span>
              </span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- Theme Toggle -->
        <a-button type="text" class="header-btn text-gray-600 dark:text-gray-300" @click="themeStore.toggleTheme()">
          <BulbOutlined v-if="themeStore.isDark" />
          <BulbFilled v-else />
        </a-button>

        <!-- Notifications -->
        <a-badge count="3" :offset="[-2, 2]">
          <a-button type="text" class="header-btn text-gray-600 dark:text-gray-300">
            <BellOutlined />
          </a-button>
        </a-badge>

        <!-- User Menu -->
        <a-dropdown>
          <div class="flex items-center gap-2 cursor-pointer ml-1 md:ml-2">
            <a-avatar :src="authStore.user?.image" :size="34" class="flex-shrink-0">
              {{ authStore.user?.firstName?.[0] }}
            </a-avatar>
            <div class="hidden lg:block">
              <div class="text-sm font-medium text-gray-800 dark:text-white leading-tight">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Admin</div>
            </div>
            <DownOutlined class="hidden lg:block text-xs text-gray-400" />
          </div>
          <template #overlay>
            <a-menu :theme="themeStore.isDark ? 'dark' : 'light'">
              <a-menu-item key="profile" @click="navigateTo('/profile')">
                <span class="flex items-center" :style="{ color: themeStore.isDark ? '#ffffffd9' : '#000000d9' }">
                  <UserOutlined />
                  <span class="ml-2">{{ t('navigation.profile') }}</span>
                </span>
              </a-menu-item>
              <a-menu-item key="settings" @click="navigateTo('/settings')">
                <span class="flex items-center" :style="{ color: themeStore.isDark ? '#ffffffd9' : '#000000d9' }">
                  <SettingOutlined />
                  <span class="ml-2">{{ t('navigation.settings') }}</span>
                </span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <span class="flex items-center" :style="{ color: themeStore.isDark ? '#ffffffd9' : '#000000d9' }">
                  <LogoutOutlined />
                  <span class="ml-2">{{ t('auth.logout') }}</span>
                </span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>
</template>

<script setup lang="ts">
import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  GlobalOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
  DownOutlined,
} from '@ant-design/icons-vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const localeStore = useLocaleStore()
const { locale, t } = useI18n()

const searchQuery = ref('')

const currentLanguage = computed(() => {
  const langs: Record<string, string> = {
    en: 'English',
    ru: 'Русский',
    uz: "O'zbek",
  }
  return langs[locale.value] || 'English'
})

const handleSearch = (value: string) => {
  console.log('Search:', value)
}

const handleLanguageChange = ({ key }: { key: string }) => {
  localeStore.setLocale(key as any)
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.header {
  height: 64px;
  line-height: 64px;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #6366f1;
}

.header-btn {
  width: 36px;
  height: 36px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

.header-btn :deep(.anticon) {
  font-size: 16px;
}

.language-btn {
  height: 36px;
  width: 36px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

.language-btn :deep(.anticon) {
  font-size: 16px;
}

@media (min-width: 768px) {
  .language-btn {
    width: auto;
    padding: 0 12px !important;
  }
}

/* Search input responsive widths */
.search-input {
  width: 160px;
  transition: width 0.2s ease;
}

@media (min-width: 768px) {
  .search-input {
    width: 220px;
  }
}

@media (min-width: 1024px) {
  .search-input {
    width: 280px;
  }
}

@media (min-width: 1280px) {
  .search-input {
    width: 320px;
  }
}
</style>
