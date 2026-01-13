<template>
    <a-modal
        v-model:open="modalVisible"
        :title="isEdit ? t('users.editUser') : t('users.addUser')"
        width="900px"
        @cancel="handleCancel"
    >
      <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          layout="vertical"
      >
        <a-divider class="dark:text-white" orientation="left">{{ t('users.personalInfo') }}</a-divider>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item name="firstName" :label="t('users.firstName')">
              <a-input v-model:value="formState.firstName" :placeholder="t('users.firstName') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="lastName" :label="t('users.lastName')">
              <a-input v-model:value="formState.lastName" :placeholder="t('users.lastName') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="maidenName" :label="t('users.maidenName')">
              <a-input v-model:value="formState.maidenName" :placeholder="t('users.maidenName') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="email" :label="t('users.email')">
              <a-input v-model:value="formState.email" type="email" :placeholder="t('users.email') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="phone" :label="t('users.phone')">
              <a-input v-model:value="formState.phone" :placeholder="t('users.phone') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="username" :label="t('users.username')">
              <a-input v-model:value="formState.username" :placeholder="t('users.username') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="age" :label="t('users.age')">
              <a-input-number v-model:value="formState.age" :min="1" style="width: 100%" :placeholder="t('users.age') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="gender" :label="t('users.gender')">
              <a-select v-model:value="formState.gender" :placeholder="t('users.gender') + ' tanlang'">
                <a-select-option value="male">{{ t('users.male') }}</a-select-option>
                <a-select-option value="female">{{ t('users.female') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="birthDate" :label="t('users.birthDate')">
              <a-input v-model:value="formState.birthDate" :placeholder="t('users.birthDate') + ' kiriting (YYYY-MM-DD)'" />
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="bloodGroup" :label="t('users.bloodGroup')">
              <a-select v-model:value="formState.bloodGroup" :placeholder="t('users.bloodGroup') + ' tanlang'">
                <a-select-option value="A+">A+</a-select-option>
                <a-select-option value="A-">A-</a-select-option>
                <a-select-option value="B+">B+</a-select-option>
                <a-select-option value="B-">B-</a-select-option>
                <a-select-option value="AB+">AB+</a-select-option>
                <a-select-option value="AB-">AB-</a-select-option>
                <a-select-option value="O+">O+</a-select-option>
                <a-select-option value="O-">O-</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="height" :label="t('users.height')">
              <a-input-number v-model:value="formState.height" :min="0" style="width: 100%" addon-after="cm" :placeholder="t('users.height') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="weight" :label="t('users.weight')">
              <a-input-number v-model:value="formState.weight" :min="0" style="width: 100%" addon-after="kg" :placeholder="t('users.weight') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="eyeColor" :label="t('users.eyeColor')">
              <a-input v-model:value="formState.eyeColor" :placeholder="t('users.eyeColor') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item name="image" :label="t('users.image')">
              <a-input v-model:value="formState.image" :placeholder="t('users.image') + ' URL kiriting'" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider class="dark:text-white" orientation="left">{{ t('users.hairInfo') }}</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="t('users.hairColor')">
              <a-input v-model:value="formState.hair.color" :placeholder="t('users.hairColor') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="t('users.hairType')">
              <a-input v-model:value="formState.hair.type" :placeholder="t('users.hairType') + ' kiriting'" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider class="dark:text-white" orientation="left">{{ t('users.address') }}</a-divider>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item :label="t('users.streetAddress')">
              <a-input v-model:value="formState.address.address" :placeholder="t('users.streetAddress') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('users.city')">
              <a-input v-model:value="formState.address.city" :placeholder="t('users.city') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('users.state')">
              <a-input v-model:value="formState.address.state" :placeholder="t('users.state') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('users.postalCode')">
              <a-input v-model:value="formState.address.postalCode" :placeholder="t('users.postalCode') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="t('users.country')">
              <a-input v-model:value="formState.address.country" :placeholder="t('users.country') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :label="t('users.university')">
              <a-input v-model:value="formState.university" :placeholder="t('users.university') + ' kiriting'" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider class="dark:text-white" orientation="left">{{ t('users.companyInfo') }}</a-divider>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item :label="t('users.companyName')">
              <a-input v-model:value="formState.company.name" :placeholder="t('users.companyName') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('users.department')">
              <a-input v-model:value="formState.company.department" :placeholder="t('users.department') + ' kiriting'" />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item :label="t('users.title')">
              <a-input v-model:value="formState.company.title" :placeholder="t('users.title') + ' kiriting'" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider class="dark:text-white" orientation="left">{{ t('users.accountInfo') }}</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item name="role" :label="t('users.role')">
              <a-select v-model:value="formState.role" :placeholder="t('users.role') + ' tanlang'">
                <a-select-option value="admin">{{ t('users.roleAdmin') }}</a-select-option>
                <a-select-option value="moderator">{{ t('users.roleModerator') }}</a-select-option>
                <a-select-option value="user">{{ t('users.roleUser') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item name="status" :label="t('users.status')">
              <a-select v-model:value="formState.status" :placeholder="t('users.status') + ' tanlang'">
                <a-select-option value="active">{{ t('common.active') }}</a-select-option>
                <a-select-option value="inactive">{{ t('common.inactive') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template #footer>
        <a-button @click="handleCancel">{{ t('common.cancel') }}</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">
          {{ t('common.save') }}
        </a-button>
      </template>
    </a-modal>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const props = defineProps<{
  visible: boolean
  user: any
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

const usersStore = useUsersStore()
const { t } = useI18n()

const formRef = ref()
const loading = ref(false)

const isEdit = computed(() => !!props.user)

const modalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const formState = reactive({
  firstName: '',
  lastName: '',
  maidenName: '',
  age: 18,
  gender: 'male',
  email: '',
  phone: '',
  username: '',
  password: '',
  birthDate: '',
  image: '',
  bloodGroup: 'A+',
  height: 0,
  weight: 0,
  eyeColor: '',
  hair: {
    color: '',
    type: '',
  },
  address: {
    address: '',
    city: '',
    state: '',
    stateCode: '',
    postalCode: '',
    country: '',
  },
  university: '',
  company: {
    name: '',
    department: '',
    title: '',
  },
  ein: '',
  ssn: '',
  userAgent: '',
  role: 'user',
  status: 'active',
})

const rules = {
  firstName: [{ required: true, message: t('validation.required') }],
  lastName: [{ required: true, message: t('validation.required') }],
  email: [
    { required: true, message: t('validation.required') },
    { type: 'email', message: t('validation.email') },
  ],
  username: [{ required: true, message: t('validation.required') }],
  age: [{ required: true, message: t('validation.required') }],
  gender: [{ required: true, message: t('validation.required') }],
}

const resetForm = () => {
  Object.assign(formState, {
    firstName: '',
    lastName: '',
    maidenName: '',
    age: 18,
    gender: 'male',
    email: '',
    phone: '',
    username: '',
    password: '',
    birthDate: '',
    image: '',
    bloodGroup: 'A+',
    height: 0,
    weight: 0,
    eyeColor: '',
    hair: {
      color: '',
      type: '',
    },
    address: {
      address: '',
      city: '',
      state: '',
      stateCode: '',
      postalCode: '',
      country: '',
    },
    university: '',
    company: {
      name: '',
      department: '',
      title: '',
    },
    ein: '',
    ssn: '',
    userAgent: '',
    role: 'user',
    status: 'active',
  })
}

watch(() => props.user, (newUser) => {
  if (newUser) {
    Object.assign(formState, newUser)
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await usersStore.updateUser(props.user.id, formState)
      message.success(t('messages.updateSuccess'))
    } else {
      await usersStore.addUser(formState)
      message.success(t('messages.createSuccess'))
    }

    emit('success')
  } catch (error: any) {
    message.error(error.message || t('messages.error'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}
</script>
