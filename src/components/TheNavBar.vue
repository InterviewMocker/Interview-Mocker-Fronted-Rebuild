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
  <nav class="glass-nav sticky top-0 z-50">
    <div class="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-xl font-bold text-gradient flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
          </div>
          Mock.AI
        </router-link>
        <div class="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5">
          <router-link 
            v-for="item in navigation" 
            :key="item.name" 
            :to="item.path"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="[
              route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path))
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/25' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <template v-if="isLoggedIn">
          <div class="flex items-center gap-3 px-3 py-1.5 rounded-full bg-dark-900/50 border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer group">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 p-[1px]">
              <div class="w-full h-full rounded-full bg-dark-950 flex items-center justify-center">
                <span class="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-secondary-500">
                  {{ (user?.username?.[0] || 'U').toUpperCase() }}
                </span>
              </div>
            </div>
            <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{{ user?.username || 'User' }}</span>
          </div>
          <button 
            @click="handleLogout"
            class="p-2 text-gray-400 hover:text-error-400 transition-colors rounded-full hover:bg-white/5"
            title="退出登录"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
          </button>
        </template>
        <template v-else>
          <button 
            @click="handleLogin"
            class="btn-primary text-sm"
          >
            登录
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
