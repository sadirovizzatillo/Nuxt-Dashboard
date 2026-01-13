<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

onMounted(() => {
  themeStore.initializeTheme()
  localeStore.initializeLocale()
})
</script>
