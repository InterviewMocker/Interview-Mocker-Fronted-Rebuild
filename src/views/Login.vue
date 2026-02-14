<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/auth'
import { UserCircleIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

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
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          欢迎回来
        </h2>
        <p class="text-gray-400 mt-2">登录 AI 模拟面试系统</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-300">用户名</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCircleIcon class="h-5 w-5 text-gray-500" />
            </div>
            <input
              v-model="loginForm.username"
              type="text"
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              placeholder="请输入用户名"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-300">密码</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon class="h-5 w-5 text-gray-500" />
            </div>
            <input
              v-model="loginForm.password"
              type="password"
              class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              placeholder="请输入密码"
              :disabled="loading"
            />
          </div>
        </div>

        <div v-if="errorMsg" class="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-sm">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </button>

        <div class="text-center text-sm text-gray-400">
          还没有账号？
          <router-link to="/register" class="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
            立即注册
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
