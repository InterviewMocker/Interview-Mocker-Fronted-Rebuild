<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import type { RegisterRequest } from '@/types/auth'
import { UserCircleIcon, LockClosedIcon, EnvelopeIcon, AcademicCapIcon, BuildingLibraryIcon, BookOpenIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const registerForm = reactive<RegisterRequest>({
  username: '',
  password: '',
  email: '',
  real_name: '',
  school: '',
  major: ''
})

const confirmPassword = ref('')

async function handleRegister() {
  if (!registerForm.username || !registerForm.password) {
    errorMsg.value = '请填写用户名和密码'
    return
  }

  if (registerForm.password.length < 8) {
    errorMsg.value = '密码长度至少为 8 位'
    return
  }

  if (registerForm.password !== confirmPassword.value) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await register(registerForm)
    successMsg.value = '注册成功！即将跳转到登录页...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    errorMsg.value = error.response?.data?.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          创建账号
        </h2>
        <p class="text-gray-400 mt-2">加入 AI 模拟面试系统，提升面试技能</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">用户名 <span class="text-red-500">*</span></label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon class="h-5 w-5 text-gray-500" />
              </div>
              <input
                v-model="registerForm.username"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                placeholder="3-50 个字符"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">邮箱</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-500" />
              </div>
              <input
                v-model="registerForm.email"
                type="email"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                placeholder="example@email.com"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">密码 <span class="text-red-500">*</span></label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-500" />
              </div>
              <input
                v-model="registerForm.password"
                type="password"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                placeholder="至少 8 位，含大小写字母和数字"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">确认密码 <span class="text-red-500">*</span></label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-500" />
              </div>
              <input
                v-model="confirmPassword"
                type="password"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                placeholder="再次输入密码"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">真实姓名</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon class="h-5 w-5 text-gray-500" />
              </div>
              <input
                v-model="registerForm.real_name"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                placeholder="选填"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">学校</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingLibraryIcon class="h-5 w-5 text-gray-500" />
              </div>
              <input
                v-model="registerForm.school"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                placeholder="选填"
                :disabled="loading"
              />
            </div>
          </div>

           <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-gray-300">专业</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AcademicCapIcon class="h-5 w-5 text-gray-500" />
              </div>
              <input
                v-model="registerForm.major"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                placeholder="选填"
                :disabled="loading"
              />
            </div>
          </div>
        </div>

        <div v-if="errorMsg" class="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-sm">
          {{ errorMsg }}
        </div>

        <div v-if="successMsg" class="p-3 bg-emerald-900/20 border border-emerald-800/50 rounded-lg text-emerald-400 text-sm">
          {{ successMsg }}
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册账号' }}
        </button>

        <div class="text-center text-sm text-gray-400">
          已有账号？
          <router-link to="/login" class="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
            立即登录
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
