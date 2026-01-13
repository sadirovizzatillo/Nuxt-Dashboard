<template>
  <div class="login-page">
    <!-- Background decoration -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Top bar with language and theme -->
    <div class="top-bar">
      <a-dropdown>
        <a-button type="text" class="control-btn">
          <GlobalOutlined />
          <span class="ml-2">{{ currentLanguage }}</span>
          <DownOutlined class="ml-1 text-xs" />
        </a-button>
        <template #overlay>
          <a-menu @click="handleLanguageChange" :selectedKeys="[locale]" :theme="themeStore.isDark ? 'dark' : 'light'">
            <a-menu-item key="en">
              <span class="flex items-center gap-2">
                <span>🇬🇧</span>
                <span>English</span>
              </span>
            </a-menu-item>
            <a-menu-item key="ru">
              <span class="flex items-center gap-2">
                <span>🇷🇺</span>
                <span>Русский</span>
              </span>
            </a-menu-item>
            <a-menu-item key="uz">
              <span class="flex items-center gap-2">
                <span>🇺🇿</span>
                <span>O'zbekcha</span>
              </span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-button type="text" class="control-btn" @click="themeStore.toggleTheme()">
        <BulbFilled v-if="themeStore.isDark" />
        <BulbOutlined v-else />
      </a-button>
    </div>

    <!-- Login card -->
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Left side - Branding -->
        <div class="login-branding">
          <div class="branding-content">
            <div class="logo-icon">
              <DashboardOutlined />
            </div>
            <h1 class="brand-title">DashStack</h1>
            <p class="brand-subtitle">{{ t('auth.brandSubtitle') }}</p>

            <div class="features">
              <div class="feature-item">
                <CheckCircleOutlined />
                <span>{{ t('auth.feature1') }}</span>
              </div>
              <div class="feature-item">
                <CheckCircleOutlined />
                <span>{{ t('auth.feature2') }}</span>
              </div>
              <div class="feature-item">
                <CheckCircleOutlined />
                <span>{{ t('auth.feature3') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Form -->
        <div class="login-form-section">
          <div class="form-header">
            <h2 class="form-title">{{ t('auth.welcomeBack') }}</h2>
            <p class="form-subtitle">{{ t('auth.loginSubtitle') }}</p>
          </div>

          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            @finish="handleLogin"
            layout="vertical"
            class="login-form"
          >
            <a-form-item name="username" :label="t('auth.username')">
              <a-input
                v-model:value="formState.username"
                size="large"
                :placeholder="t('auth.usernamePlaceholder')"
              >
                <template #prefix>
                  <UserOutlined class="input-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password" :label="t('auth.password')">
              <a-input-password
                v-model:value="formState.password"
                size="large"
                :placeholder="t('auth.passwordPlaceholder')"
              >
                <template #prefix>
                  <LockOutlined class="input-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <div class="form-options">
              <a-checkbox v-model:checked="formState.rememberMe">
                {{ t('auth.rememberMe') }}
              </a-checkbox>
              <a href="#" class="forgot-link">
                {{ t('auth.forgotPassword') }}
              </a>
            </div>

            <a-form-item class="submit-item">
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                :loading="loading"
                block
                class="login-btn"
              >
                <template #icon>
                  <LoginOutlined v-if="!loading" />
                </template>
                {{ t('auth.signIn') }}
              </a-button>
            </a-form-item>
          </a-form>

          <!-- Demo credentials -->
          <div class="demo-box">
            <div class="demo-header">
              <InfoCircleOutlined />
              <span>{{ t('auth.testCredentials') }}</span>
            </div>
            <div class="demo-content">
              <div class="demo-row">
                <span class="demo-label">{{ t('auth.username') }}:</span>
                <code class="demo-value">emmaj</code>
              </div>
              <div class="demo-row">
                <span class="demo-label">{{ t('auth.password') }}:</span>
                <code class="demo-value">emmajpass</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  DownOutlined,
  BulbOutlined,
  BulbFilled,
  DashboardOutlined,
  CheckCircleOutlined,
  LoginOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const { t, locale } = useI18n()

const formRef = ref(null)
const formState = reactive({
  username: 'emmaj',
  password: 'emmajpass',
  rememberMe: false,
})

const loading = ref(false)

const currentLanguage = computed(() => {
  const langs: Record<string, string> = {
    en: 'English',
    ru: 'Русский',
    uz: "O'zbekcha",
  }
  return langs[locale.value] || 'English'
})

const rules = {
  username: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
    { min: 6, message: t('validation.minLength', { min: 6 }), trigger: 'blur' },
  ],
}

const handleLanguageChange = ({ key }: { key: string }) => {
  localeStore.setLocale(key as any)
}

const handleLogin = async () => {
  loading.value = true

  try {
    await authStore.login({
      username: formState.username,
      password: formState.password,
    })

    message.success(t('auth.loginSuccess'))
    navigateTo('/')
  } catch (error: any) {
    message.error(error.message || t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  themeStore.initializeTheme()
  localeStore.initializeLocale()
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a1c2e 0%, #2d1f3d 50%, #1a2a3a 100%);
  position: relative;
  overflow: hidden;
}

/* Background decoration */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
  filter: blur(60px);
}

.circle-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  animation: float 15s ease-in-out infinite reverse;
}

.circle-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

/* Top bar */
.top-bar {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.control-btn {
  color: rgba(255, 255, 255, 0.8) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-radius: 8px !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  transition: all 0.3s ease !important;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

/* Login wrapper */
.login-wrapper {
  width: 100%;
  max-width: 1000px;
  z-index: 1;
}

.login-card {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

:global(.dark) .login-card {
  background: rgba(30, 41, 59, 0.95);
}

/* Branding section */
.login-branding {
  flex: 1;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-branding::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.branding-content {
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  backdrop-filter: blur(10px);
}

.brand-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 280px;
  line-height: 1.6;
}

.features {
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  font-size: 15px;
  opacity: 0.95;
}

.feature-item :deep(.anticon) {
  font-size: 18px;
}

/* Form section */
.login-form-section {
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

:global(.dark) .form-title {
  color: #f1f5f9;
}

.form-subtitle {
  color: #64748b;
  font-size: 15px;
}

:global(.dark) .form-subtitle {
  color: #94a3b8;
}

.login-form {
  margin-bottom: 24px;
}

.login-form :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
}

:global(.dark) .login-form :deep(.ant-form-item-label > label) {
  color: #d1d5db;
}

.input-icon {
  color: #9ca3af;
}

.login-form :deep(.ant-input-affix-wrapper) {
  border-radius: 10px;
  border-color: #e5e7eb;
  transition: all 0.3s ease;
}

:global(.dark) .login-form :deep(.ant-input-affix-wrapper) {
  background: #1e293b;
  border-color: #374151;
}

:global(.dark) .login-form :deep(.ant-input) {
  background: transparent;
  color: #e5e7eb;
}

:global(.dark) .login-form :deep(.ant-input::placeholder) {
  color: #6b7280;
}

:global(.dark) .login-form :deep(.ant-input-prefix) {
  color: #6b7280;
}

:global(.dark) .login-form :deep(.ant-input-password-icon) {
  color: #6b7280;
}

:global(.dark) .login-form :deep(.ant-input-password-icon:hover) {
  color: #9ca3af;
}

.login-form :deep(.ant-input-affix-wrapper:hover),
.login-form :deep(.ant-input-affix-wrapper:focus),
.login-form :deep(.ant-input-affix-wrapper-focused) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

:global(.dark) .login-form :deep(.ant-input-affix-wrapper:hover),
:global(.dark) .login-form :deep(.ant-input-affix-wrapper:focus),
:global(.dark) .login-form :deep(.ant-input-affix-wrapper-focused) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

:global(.dark) .form-options :deep(.ant-checkbox-wrapper) {
  color: #d1d5db;
}

:global(.dark) .form-options :deep(.ant-checkbox-inner) {
  background-color: #1e293b;
  border-color: #374151;
}

:global(.dark) .form-options :deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #6366f1;
  border-color: #6366f1;
}

.forgot-link {
  color: #6366f1;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #4f46e5;
}

:global(.dark) .forgot-link {
  color: #818cf8;
}

:global(.dark) .forgot-link:hover {
  color: #a5b4fc;
}

.submit-item {
  margin-bottom: 0;
}

.login-btn {
  height: 48px !important;
  border-radius: 10px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border: none !important;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4) !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
}

.login-btn:active {
  transform: translateY(0);
}

/* Demo box */
.demo-box {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 16px;
}

:global(.dark) .demo-box {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-color: rgba(99, 102, 241, 0.3);
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0369a1;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 12px;
}

:global(.dark) .demo-header {
  color: #93c5fd;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.demo-label {
  color: #64748b;
  min-width: 80px;
}

:global(.dark) .demo-label {
  color: #94a3b8;
}

.demo-value {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #1e293b;
}

:global(.dark) .demo-value {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .login-branding {
    padding: 32px;
  }

  .brand-title {
    font-size: 28px;
  }

  .features {
    display: none;
  }

  .login-form-section {
    padding: 32px;
  }

  .form-title {
    font-size: 24px;
  }
}
</style>
