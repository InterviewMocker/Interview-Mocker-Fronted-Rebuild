<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { 
  UserCircleIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/vue/24/outline'
import { listPendingBanks, reviewCommunity } from '@/api/question'
import type { QuestionBank } from '@/types/question'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.isAdmin)

const activeTab = ref('profile')
const adminTab = ref('review') // 'users' | 'review'

// Profile Form Data
const profileForm = ref({
  username: '',
  email: ''
})

// Review Data
const pendingBanks = ref<QuestionBank[]>([])
const loadingPending = ref(false)

function initProfile() {
  if (user.value) {
    profileForm.value = {
      username: user.value.username,
      email: user.value.email || '' // Assuming email exists on user
    }
  }
}

async function fetchPendingBanks() {
  loadingPending.value = true
  try {
    const res = await listPendingBanks({ page: 1, page_size: 100 })
    pendingBanks.value = res.data.items
  } catch (error) {
    console.error('Failed to fetch pending banks:', error)
  } finally {
    loadingPending.value = false
  }
}

async function handleReview(id: string, action: 'approve' | 'reject') {
  if (!confirm(`确定要${action === 'approve' ? '通过' : '拒绝'}该申请吗？`)) return
  
  try {
    await reviewCommunity(id, { action })
    alert('操作成功')
    fetchPendingBanks()
  } catch (error: any) {
    console.error('Review failed:', error)
    alert(error.response?.data?.message || '操作失败')
  }
}

// User Management Placeholder
const users = ref([
  { id: '1', username: 'admin', role: 'admin', email: 'admin@example.com' },
  { id: '2', username: 'user1', role: 'user', email: 'user1@example.com' }
])

function toggleAdmin(userId: string) {
  // TODO: Implement backend API
  alert('用户管理功能后端接口开发中')
}

onMounted(() => {
  initProfile()
  if (isAdmin.value) {
    fetchPendingBanks()
  }
})
</script>

<template>
  <div class="min-h-screen p-6 lg:p-8">
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-[2px]">
          <div class="w-full h-full rounded-full bg-dark-950 flex items-center justify-center">
            <span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-secondary-500">
              {{ (user?.username?.[0] || 'U').toUpperCase() }}
            </span>
          </div>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white">
            {{ user?.username }}
          </h1>
          <div class="flex items-center gap-2 mt-1">
            <span class="px-2 py-0.5 rounded text-xs font-medium bg-dark-800 text-gray-400 border border-white/10">
              {{ isAdmin ? '管理员' : '普通用户' }}
            </span>
            <span class="text-sm text-gray-500">{{ user?.email || '暂无邮箱' }}</span>
          </div>
        </div>
      </div>

      <!-- Main Tabs -->
      <div class="flex gap-6 border-b border-white/10">
        <button
          @click="activeTab = 'profile'"
          class="pb-3 px-2 text-sm font-medium transition-colors relative"
          :class="activeTab === 'profile' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'"
        >
          <div class="flex items-center gap-2">
            <UserCircleIcon class="w-5 h-5" />
            个人信息
          </div>
          <div 
            v-if="activeTab === 'profile'" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full"
          ></div>
        </button>
        
        <button
          v-if="isAdmin"
          @click="activeTab = 'admin'"
          class="pb-3 px-2 text-sm font-medium transition-colors relative"
          :class="activeTab === 'admin' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'"
        >
          <div class="flex items-center gap-2">
            <ShieldCheckIcon class="w-5 h-5" />
            管理控制台
          </div>
          <div 
            v-if="activeTab === 'admin'" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full"
          ></div>
        </button>
      </div>

      <!-- Profile Content -->
      <div v-if="activeTab === 'profile'" class="glass-card p-6 space-y-6">
        <h2 class="text-xl font-semibold text-white">基本信息</h2>
        <div class="grid gap-6 max-w-md">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">用户名</label>
            <input 
              v-model="profileForm.username"
              type="text" 
              disabled
              class="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">邮箱</label>
            <input 
              v-model="profileForm.email"
              type="email" 
              disabled
              class="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
            >
            <p class="text-xs text-gray-500 mt-1">如需修改个人信息请联系管理员</p>
          </div>
        </div>
      </div>

      <!-- Admin Content -->
      <div v-else-if="isAdmin && activeTab === 'admin'" class="space-y-6">
        <!-- Admin Sub-tabs -->
        <div class="flex gap-2">
          <button
            @click="adminTab = 'review'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
            :class="adminTab === 'review' 
              ? 'bg-primary-900/20 text-primary-400 border-primary-500/30' 
              : 'bg-dark-800 text-gray-400 border-white/5 hover:bg-dark-700'"
          >
            社区审核
            <span v-if="pendingBanks.length" class="ml-1 px-1.5 py-0.5 rounded-full bg-primary-500 text-white text-xs">
              {{ pendingBanks.length }}
            </span>
          </button>
          <button
            @click="adminTab = 'users'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
            :class="adminTab === 'users' 
              ? 'bg-primary-900/20 text-primary-400 border-primary-500/30' 
              : 'bg-dark-800 text-gray-400 border-white/5 hover:bg-dark-700'"
          >
            用户管理
          </button>
        </div>

        <!-- Community Review -->
        <div v-if="adminTab === 'review'" class="space-y-4">
          <div v-if="loadingPending" class="text-center py-10">
            <div class="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
          
          <div v-else-if="pendingBanks.length > 0" class="grid gap-4">
            <div 
              v-for="bank in pendingBanks" 
              :key="bank.id"
              class="glass-card p-4 flex items-center justify-between group hover:border-primary-500/30 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="p-3 rounded-lg bg-dark-800 text-gray-400">
                  <GlobeAltIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-medium text-white">{{ bank.name }}</h3>
                  <p class="text-sm text-gray-400">{{ bank.description || '无描述' }}</p>
                  <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>申请人ID: {{ bank.created_by }}</span>
                    <span>•</span>
                    <span>{{ new Date(bank.created_at).toLocaleDateString() }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button 
                  @click="handleReview(bank.id, 'approve')"
                  class="p-2 rounded-lg bg-success-900/20 text-success-400 hover:bg-success-900/40 transition-colors"
                  title="通过"
                >
                  <CheckCircleIcon class="w-5 h-5" />
                </button>
                <button 
                  @click="handleReview(bank.id, 'reject')"
                  class="p-2 rounded-lg bg-error-900/20 text-error-400 hover:bg-error-900/40 transition-colors"
                  title="拒绝"
                >
                  <XCircleIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-20 text-gray-500 glass-card">
            <CheckCircleIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>暂无待审核的社区内容</p>
          </div>
        </div>

        <!-- User Management (Placeholder) -->
        <div v-if="adminTab === 'users'" class="glass-card p-6">
          <div class="text-center py-10 text-gray-500">
            <p>用户管理功能开发中...</p>
            <div class="mt-4 grid gap-2 opacity-50 pointer-events-none">
               <div v-for="u in users" :key="u.id" class="flex items-center justify-between p-3 bg-dark-900/30 rounded border border-white/5">
                 <span>{{ u.username }}</span>
                 <span class="text-xs bg-dark-800 px-2 py-1 rounded">{{ u.role }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
