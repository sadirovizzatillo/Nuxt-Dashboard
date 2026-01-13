<template>
    <a-table
        :columns="columns"
        :data-source="deals"
        :pagination="false"
        :scroll="{ x: 800 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'product'">
          <div class="flex items-center gap-3">
            <a-avatar :src="record.image" :size="40" shape="square" />
            <span class="font-medium dark:text-white">{{ record.productName }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'amount'">
          <span class="font-medium dark:text-white">${{ record.amount.toLocaleString() }}</span>
        </template>

        <template v-else-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
      </template>
    </a-table>
</template>

<script setup lang="ts">
const { t } = useI18n()

const columns = computed(() => [
  {
    title: t('table.productName'),
    dataIndex: 'productName',
    key: 'product',
    width: 250,
  },
  {
    title: t('table.location'),
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: t('table.dateTime'),
    dataIndex: 'dateTime',
    key: 'dateTime',
  },
  {
    title: t('table.piece'),
    dataIndex: 'piece',
    key: 'piece',
    align: 'center',
  },
  {
    title: t('table.amount'),
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
  },
  {
    title: t('table.status'),
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
])

const deals = ref([
  {
    id: 1,
    productName: 'Apple Watch',
    image: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
    location: 'Toshkent, Chilonzor tumani',
    dateTime: '12.09.2024 - 12:53',
    piece: 423,
    amount: 34295,
    status: 'Delivered',
  },
  {
    id: 2,
    productName: 'iPhone 13 Pro',
    image: 'https://i.dummyjson.com/data/products/2/thumbnail.jpg',
    location: 'Toshkent, Yunusobod tumani',
    dateTime: '15.09.2024 - 15:30',
    piece: 156,
    amount: 45650,
    status: 'Pending',
  },
  {
    id: 3,
    productName: 'Samsung Galaxy',
    image: 'https://i.dummyjson.com/data/products/3/thumbnail.jpg',
    location: 'Samarqand, Registon ko\'chasi',
    dateTime: '18.09.2024 - 09:15',
    piece: 289,
    amount: 28990,
    status: 'Delivered',
  },
])

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Delivered: 'green',
    Pending: 'orange',
    Cancelled: 'red',
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    Delivered: t('table.delivered'),
    Pending: t('table.pending'),
    Cancelled: t('table.cancelled'),
  }
  return statusMap[status] || status
}
</script>
