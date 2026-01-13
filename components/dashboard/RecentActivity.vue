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
    title: 'New Order Received',
    description: 'Order #12345 from John Doe',
    time: '2 minutes ago',
    color: 'blue',
  },
  {
    id: 2,
    title: 'Product Added',
    description: 'iPhone 15 Pro Max added to inventory',
    time: '1 hour ago',
    color: 'green',
  },
  {
    id: 3,
    title: 'User Registered',
    description: 'New user Jane Smith signed up',
    time: '3 hours ago',
    color: 'purple',
  },
  {
    id: 4,
    title: 'Payment Processed',
    description: 'Payment of $1,299.00 completed',
    time: '5 hours ago',
    color: 'orange',
  },
  {
    id: 5,
    title: 'Order Shipped',
    description: 'Order #12340 has been shipped',
    time: '1 day ago',
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
