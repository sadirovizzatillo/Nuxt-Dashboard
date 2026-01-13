<template>
  <ClientOnly>
    <div class="w-full h-80">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <template #fallback>
      <div class="w-full h-80 flex items-center justify-center">
        <div class="spinner w-8 h-8 border-primary-600"></div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/stores/theme'
import { Line } from 'vue-chartjs'

const themeStore = useThemeStore()

const chartData = computed(() => ({
  labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
  datasets: [{
    label: 'Sotuvlar',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 135, 150, 160],
    borderColor: '#4f46e5',
    backgroundColor: themeStore.isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.05)',
    fill: true,
    tension: 0.4,
    borderWidth: 3,
    pointRadius: 0,
    pointHoverRadius: 6,
  }]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: themeStore.isDark ? '#1f2937' : '#ffffff',
      titleColor: themeStore.isDark ? '#ffffff' : '#000000',
      bodyColor: themeStore.isDark ? '#ffffff' : '#000000',
      borderColor: themeStore.isDark ? '#374151' : '#e5e7eb',
      borderWidth: 1,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: themeStore.isDark ? '#9ca3af' : '#6b7280' }
    },
    y: {
      grid: { color: themeStore.isDark ? '#374151' : '#e5e7eb' },
      ticks: { color: themeStore.isDark ? '#9ca3af' : '#6b7280' }
    }
  }
}))
</script>
