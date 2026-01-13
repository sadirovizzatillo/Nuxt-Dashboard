<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold dark:text-white">{{ t('dashboard.title') }}</h1>
    </div>

    <!-- Statistics Cards -->
      <a-row :gutter="[16, 16]" class="mb-6">
        <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6" v-for="stat in stats" :key="stat.title">
          <DashboardStatCard :stat="stat" />
        </a-col>
      </a-row>

    <!-- Charts Section -->
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :lg="24" :xl="12">
          <a-card :title="t('dashboard.salesDetails')" class="mb-4">
            <DashboardSalesChart />
          </a-card>
        </a-col>

        <a-col :xs="24" :lg="24" :xl="12">
          <a-card :title="t('dashboard.recentActivity')" class="mb-4">
            <DashboardRecentActivity />
          </a-card>
        </a-col>
      </a-row>

    <!-- Deals Details Table -->
      <a-card :title="t('dashboard.dealsDetails')" class="mt-4">
        <DashboardDealsTable />
      </a-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const dashboardStore = useDashboardStore()
const { t } = useI18n()


const stats = computed(() => dashboardStore.getStatCards())

onMounted(async () => {
  try {
    await dashboardStore.fetchStatistics()
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
  }
})
</script>
