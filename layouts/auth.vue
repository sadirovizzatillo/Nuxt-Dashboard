<template>
  <div class="auth-layout" :class="{ dark: themeStore.isDark }">
    <slot />
  </div>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
}
</style>
