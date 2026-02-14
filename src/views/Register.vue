<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import type { RegisterRequest } from '@/types/auth'
import { 
  UserCircleIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  AcademicCapIcon, 
  BuildingLibraryIcon,
  ArrowRightIcon 
} from '@heroicons/vue/24/outline'

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
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Blobs -->
    <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-600/20 rounded-full blur-[120px] animate-blob"></div>
    <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

    <div class="glass-card w-full max-w-2xl p-8 relative z-10 animate-slide-up">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-2">创建账号</h2>
        <p class="text-gray-400">开启您的 AI 模拟面试之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300 ml-1">用户名 <span class="text-error-400">*</span></label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                v-model="registerForm.username"
                type="text"
                class="input-field pl-10"
                placeholder="3-50 个字符"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300 ml-1">邮箱</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                v-model="registerForm.email"
                type="email"
                class="input-field pl-10"
                placeholder="example@email.com"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300 ml-1">密码 <span class="text-error-400">*</span></label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                v-model="registerForm.password"
                type="password"
                class="input-field pl-10"
                placeholder="至少 8 位"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300 ml-1">确认密码 <span class="text-error-400">*</span></label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                v-model="confirmPassword"
                type="password"
                class="input-field pl-10"
                placeholder="再次输入密码"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300 ml-1">真实姓名</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                v-model="registerForm.real_name"
                type="text"
                class="input-field pl-10"
                placeholder="选填"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300 ml-1">学校</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingLibraryIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                v-model="registerForm.school"
                type="text"
                class="input-field pl-10"
                placeholder="选填"
                :disabled="loading"
              />
            </div>
          </div>

           <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-medium text-gray-300 ml-1">专业</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AcademicCapIcon class="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                v-model="registerForm.major"
                type="text"
                class="input-field pl-10"
                placeholder="选填"
                :disabled="loading"
              />
            </div>
          </div>
        </div>

        <div v-if="errorMsg" class="p-4 bg-error-500/10 border border-error-500/20 rounded-lg text-error-400 text-sm flex items-center gap-2 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 shrink-0">
            <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
          </svg>
          {{ errorMsg }}
        </div>

        <div v-if="successMsg" class="p-4 bg-success-500/10 border border-success-500/20 rounded-lg text-success-400 text-sm flex items-center gap-2 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 shrink-0">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
          </svg>
          {{ successMsg }}
        </div>

        <button
          type="submit"
          class="btn-primary w-full flex items-center justify-center gap-2 mt-4"
          :disabled="loading"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-else>注册账号</span>
          <ArrowRightIcon v-if="!loading" class="w-5 h-5" />
        </button>

        <div class="text-center text-sm text-gray-400 pt-4">
          已有账号？
          <router-link to="/login" class="text-primary-400 hover:text-primary-300 font-medium hover:underline decoration-primary-400/30 underline-offset-4 transition-all">
            立即登录
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
