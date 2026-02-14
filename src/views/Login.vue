<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/auth'
import { UserCircleIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive<LoginRequest>({
  username: '',
  password: '',
  device_type: 'web'
})

const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!loginForm.username || !loginForm.password) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await authStore.login(loginForm)
    router.push('/')
  } catch (error: any) {
    errorMsg.value = error.response?.data?.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Blobs -->
    <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px] animate-blob"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

    <div class="glass-card w-full max-w-md p-8 relative z-10 animate-slide-up">
      <div class="text-center mb-10">
        <router-link to="/" class="inline-block mb-6">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg mx-auto">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
              <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </router-link>
        <h2 class="text-3xl font-bold text-white mb-2">欢迎回来</h2>
        <p class="text-gray-400">登录您的 Mock.AI 账号</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-300 ml-1">用户名</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCircleIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
            </div>
            <input
              v-model="loginForm.username"
              type="text"
              class="input-field pl-10"
              placeholder="请输入用户名"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-300 ml-1">密码</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
            </div>
            <input
              v-model="loginForm.password"
              type="password"
              class="input-field pl-10"
              placeholder="请输入密码"
              :disabled="loading"
            />
          </div>
        </div>

        <div v-if="errorMsg" class="p-4 bg-error-500/10 border border-error-500/20 rounded-lg text-error-400 text-sm flex items-center gap-2 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 shrink-0">
            <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
          </svg>
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          class="btn-primary w-full flex items-center justify-center gap-2 mt-4"
          :disabled="loading"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>立即登录</span>
          <ArrowRightIcon v-if="!loading" class="w-5 h-5" />
        </button>

        <div class="text-center text-sm text-gray-400 pt-4">
          还没有账号？
          <router-link to="/register" class="text-primary-400 hover:text-primary-300 font-medium hover:underline decoration-primary-400/30 underline-offset-4 transition-all">
            免费注册
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
