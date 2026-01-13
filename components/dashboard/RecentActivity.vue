<template>
    <div class="recent-activity h-80">
      <a-timeline>
        <a-timeline-item
            v-for="activity in activities"
            :key="activity.id"
            :color="activity.color"
        >
          <div class="mb-2">
            <p class="font-bold dark:text-gray-400">{{ activity.title }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ activity.description }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {{ activity.time }}
            </p>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
</template>

<script setup lang="ts">
const activities = ref([
  {
    id: 1,
    title: 'Yangi buyurtma qabul qilindi',
    description: 'John Doe dan #12345 buyurtma',
    time: '2 daqiqa oldin',
    color: 'blue',
  },
  {
    id: 2,
    title: 'Mahsulot qo\'shildi',
    description: 'iPhone 15 Pro Max omborga qo\'shildi',
    time: '1 soat oldin',
    color: 'green',
  },
  {
    id: 3,
    title: 'Foydalanuvchi ro\'yxatdan o\'tdi',
    description: 'Yangi foydalanuvchi Jane Smith ro\'yxatdan o\'tdi',
    time: '3 soat oldin',
    color: 'purple',
  },
  {
    id: 4,
    title: 'To\'lov amalga oshirildi',
    description: '$1,299.00 to\'lov yakunlandi',
    time: '5 soat oldin',
    color: 'orange',
  },
  {
    id: 5,
    title: 'Buyurtma jo\'natildi',
    description: '#12340 buyurtma jo\'natildi',
    time: '1 kun oldin',
    color: 'cyan',
  },
])
</script>

<style scoped>
.recent-activity {
  max-height: 400px;
  overflow-y: auto;
}
</style>
