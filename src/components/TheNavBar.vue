<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navigation = [
  { name: '首页', path: '/' },
  { name: '知识库', path: '/knowledge' },
  { name: '题库', path: '/questions/banks' },
  { name: '岗位', path: '/positions' },
  // { name: '面试', path: '/interview' }, // Not implemented yet
  // { name: '复盘提升', path: '/review' }, // Not implemented yet
]

const user = computed(() => authStore.user)
const isLoggedIn = computed(() => authStore.isLoggedIn)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function handleLogin() {
  router.push('/login')
}
</script>

<template>
  <nav class="border-b border-gray-800/50 backdrop-blur-xl sticky top-0 z-50 bg-gray-950/80">
    <div class="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          模拟面试系统
        </router-link>
        <div class="hidden md:flex items-center gap-6">
          <router-link 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.path"
            class="text-sm font-medium transition-colors"
            :class="[
              route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path))
                ? 'text-emerald-400' 
                : 'text-gray-400 hover:text-emerald-400'
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <template v-if="isLoggedIn">
          <div class="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors">
            <UserCircleIcon class="w-5 h-5" />
            <span class="text-sm font-medium">{{ user?.username || user?.email || '用户' }}</span>
          </div>
          <button 
            @click="handleLogout"
            class="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            <span class="text-sm font-medium">退出</span>
          </button>
        </template>
        <template v-else>
          <button 
            @click="handleLogin"
            class="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            登录
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
