<template>
    <a-drawer
        v-model:open="drawerVisible"
        :title="t('users.userDetails')"
        placement="right"
        width="550"
    >
      <div v-if="user" class="user-details">
        <div class="text-center mb-6">
          <a-avatar :src="user.image" :size="100" class="mb-4">
            {{ user.firstName?.[0] }}
          </a-avatar>
          <h2 class="text-xl font-bold dark:text-white">
            {{ user.firstName }} {{ user.lastName }}
          </h2>
          <p class="text-gray-500 dark:text-gray-400">@{{ user.username }}</p>
          <div class="mt-2">
            <a-tag :color="getRoleColor(user.role)">
              {{ getRoleLabel(user.role) }}
            </a-tag>
            <a-tag :color="user.status === 'active' ? 'green' : 'red'">
              {{ user.status === 'active' ? t('common.active') : t('common.inactive') }}
            </a-tag>
          </div>
        </div>

        <a-descriptions bordered :column="2" size="small">
          <a-descriptions-item :label="t('users.email')" :span="2">
            {{ user.email }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.phone')" :span="2">
            {{ user.phone }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.age')">
            {{ user.age }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.gender')">
            <a-tag :color="user.gender === 'male' ? 'blue' : 'pink'">
              {{ user.gender === 'male' ? t('users.male') : t('users.female') }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.birthDate')">
            {{ user.birthDate || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.bloodGroup')">
            {{ user.bloodGroup || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.height')">
            {{ user.height ? `${user.height} cm` : '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.weight')">
            {{ user.weight ? `${user.weight} kg` : '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.eyeColor')">
            {{ user.eyeColor || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.maidenName')">
            {{ user.maidenName || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>{{ t('users.hairInfo') }}</a-divider>
        <a-descriptions bordered :column="2" size="small">
          <a-descriptions-item :label="t('users.hairColor')">
            {{ user.hair?.color || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.hairType')">
            {{ user.hair?.type || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>{{ t('users.address') }}</a-divider>
        <a-descriptions bordered :column="2" size="small">
          <a-descriptions-item :label="t('users.streetAddress')" :span="2">
            {{ user.address?.address || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.city')">
            {{ user.address?.city || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.state')">
            {{ user.address?.state || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.postalCode')">
            {{ user.address?.postalCode || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.country')">
            {{ user.address?.country || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>{{ t('users.companyInfo') }}</a-divider>
        <a-descriptions bordered :column="1" size="small">
          <a-descriptions-item :label="t('users.companyName')">
            {{ user.company?.name || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.department')">
            {{ user.company?.department || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('users.title')">
            {{ user.company?.title || '-' }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>{{ t('users.education') }}</a-divider>
        <a-descriptions bordered :column="1" size="small">
          <a-descriptions-item :label="t('users.university')">
            {{ user.university || '-' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-drawer>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  user: any
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const { t } = useI18n()

const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'red'
    case 'moderator':
      return 'orange'
    case 'user':
    default:
      return 'blue'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return t('users.roleAdmin')
    case 'moderator':
      return t('users.roleModerator')
    case 'user':
    default:
      return t('users.roleUser')
  }
}
</script>

<style scoped>
.user-details :deep(.ant-descriptions-item-label) {
  font-weight: 600;
}
</style>
