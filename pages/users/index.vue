<template>
  <div>
      <div>
        <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold dark:text-white">{{ t('users.title') }}</h1>
        <a-button type="primary" @click="handleClick">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ t('users.addUser') }}
        </a-button>
      </div>

      <!-- Filters and Search -->
      <a-card class="mb-4">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12" :md="8">
            <a-input-search
                v-model:value="searchQuery"
                :placeholder="t('common.search')"
                @search="handleSearch"
                allow-clear
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-select
                v-model:value="selectedGender"
                :placeholder="t('users.gender')"
                style="width: 100%"
                allow-clear
                @change="handleFilter"
            >
              <a-select-option value="">{{ t('users.allGenders') }}</a-select-option>
              <a-select-option value="male">{{ t('users.male') }}</a-select-option>
              <a-select-option value="female">{{ t('users.female') }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-button block @click="handleExport">
              <template #icon>
                <ExportOutlined />
              </template>
              {{ t('common.export') }}
            </a-button>
          </a-col>
        </a-row>
      </a-card>

      <!-- Users Table -->
      <a-card>
        <a-table
            :columns="columns"
            :data-source="usersStore.users"
            :loading="usersStore.loading"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="{ x: 1400 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <a-avatar :src="record.image" :size="50">
                {{ record.firstName?.[0] }}
              </a-avatar>
            </template>

            <template v-else-if="column.key === 'name'">
              <div>
                <div class="font-medium dark:text-white">
                  {{ record.firstName }} {{ record.lastName }}
                </div>
                <div class="text-xs text-gray-500">@{{ record.username }}</div>
              </div>
            </template>

            <template v-else-if="column.key === 'gender'">
              <a-tag :color="record.gender === 'male' ? 'blue' : 'pink'">
                {{ record.gender === 'male' ? t('users.male') : t('users.female') }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'role'">
              <a-tag color="purple">
                {{ record.role || 'user' }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleView(record)">
                  <EyeOutlined />
                </a-button>
                <a-button type="link" size="small" @click="handleEdit(record)">
                  <EditOutlined />
                </a-button>
                <a-popconfirm
                    :title="t('messages.deleteConfirm')"
                    @confirm="handleDelete(record.id)"
                >
                  <a-button type="link" danger size="small">
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>

      <!-- Add/Edit User Modal -->
      <UsersFormModal
          v-model:visible="showAddModal"
          :user="selectedUser"
          @success="handleSuccess"
      />

      <!-- View User Drawer -->
      <UsersViewDrawer
          v-model:visible="showViewDrawer"
          :user="selectedUser"
      />
      </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

definePageMeta({
  middleware: 'auth',
})

const usersStore = useUsersStore()
const { t } = useI18n()

const searchQuery = ref('')
const selectedGender = ref('')
const showAddModal = ref(false)
const showViewDrawer = ref(false)
const selectedUser = ref(null)


const columns = computed(() => [
  { title: t('common.avatar'), key: 'image', width: 80 },
  { title: t('users.firstName'), key: 'name', width: 200 },
  { title: t('users.email'), dataIndex: 'email', key: 'email', width: 200 },
  { title: t('users.phone'), dataIndex: 'phone', key: 'phone' },
  { title: t('users.age'), dataIndex: 'age', key: 'age', align: 'center', width: 80 },
  { title: t('users.gender'), key: 'gender', align: 'center', width: 100 },
  { title: t('users.role'), key: 'role', align: 'center', width: 100 },
  { title: t('common.actions'), key: 'action', fixed: 'right', width: 150 },
])

const pagination = computed(() => ({
  current: Math.floor(usersStore.pagination.skip / usersStore.pagination.limit) + 1,
  pageSize: usersStore.pagination.limit,
  total: usersStore.total,
  showSizeChanger: true,
  showTotal: (total: number) => `${t('common.total')} ${total}`,
}))

const handleTableChange = (pag: any) => {
  usersStore.setPagination({
    limit: pag.pageSize,
    skip: (pag.current - 1) * pag.pageSize,
  })
  usersStore.fetchUsers()
}

const handleSearch = async (value: string) => {
  if (value) {
    await usersStore.searchUsers(value)
  } else {
    await usersStore.fetchUsers()
  }
}

const handleClick = () => {
  selectedUser.value = null
  showAddModal.value = true
}

const handleFilter = () => {
  usersStore.fetchUsers()
}

const handleView = (user: any) => {
  selectedUser.value = user
  showViewDrawer.value = true
}

const handleEdit = (user: any) => {
  selectedUser.value = user
  showAddModal.value = true
}

const handleDelete = async (id: number) => {
  try {
    await usersStore.deleteUser(id)
    message.success(t('messages.deleteSuccess'))
  } catch (error) {
    message.error(t('messages.error'))
  }
}

const handleSuccess = () => {
  showAddModal.value = false
  selectedUser.value = null
  usersStore.fetchUsers()
}

const handleExport = () => {
  message.info(t('messages.exportComing'))
}

onMounted(() => {
  usersStore.fetchUsers()
})
</script>
