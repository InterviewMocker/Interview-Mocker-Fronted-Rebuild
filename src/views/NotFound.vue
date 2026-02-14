<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
    <div class="text-center space-y-6">
      <h1 class="text-9xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
        404
      </h1>
      <h2 class="text-2xl text-white font-semibold">页面未找到</h2>
      <p class="text-gray-400 max-w-md mx-auto">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <button 
        @click="router.push('/')"
        class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
      >
        返回首页
      </button>
    </div>
  </div>
</template>
