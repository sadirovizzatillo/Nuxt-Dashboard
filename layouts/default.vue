<template>
    <a-layout class="min-h-screen">
      <LayoutSidebar />
      <a-layout :style="{ marginLeft: sidebarMargin }" class="layout-main">
        <LayoutHeader />
        <a-layout-content class="content-wrapper">
          <slot />
        </a-layout-content>
      </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()

const isMobile = ref(false)

const checkMobile = () => {
  if (process.client) {
    const wasTabletOrMobile = isMobile.value
    isMobile.value = window.innerWidth < 1024 // lg breakpoint

    // Close mobile menu when resizing to desktop
    if (wasTabletOrMobile && !isMobile.value) {
      themeStore.closeMobileMenu()
    }
  }
}

const sidebarMargin = computed(() => {
  if (isMobile.value) return '0px'
  return themeStore.sidebarCollapsed ? '80px' : '250px'
})

onMounted(() => {
  themeStore.initializeTheme()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', checkMobile)
  }
})
</script>

<style scoped>
.layout-main {
  transition: margin-left 0.2s;
}

.content-wrapper {
  margin: 16px;
  padding: 16px;
  min-height: calc(100vh - 64px - 32px);
  border-radius: 8px;
}

@media (min-width: 768px) {
  .content-wrapper {
    margin: 24px;
    padding: 24px;
    min-height: calc(100vh - 64px - 48px);
  }
}

.dark .content-wrapper {
  background: #1B2431;
}
</style>
