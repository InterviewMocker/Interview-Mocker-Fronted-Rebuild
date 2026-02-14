<script setup lang="ts">
import { 
  CubeIcon, 
  ArrowRightIcon, 
} from '@heroicons/vue/24/outline'

const stats = [
  { value: '1000+', label: '面试题库' },
  { value: '50+', label: '热门岗位' },
  { value: 'AI', label: '智能评估' },
]

const features = [
  { id: 1, title: '海量面试题库', description: '覆盖前端、后端、算法等多个领域，精选高频面试真题。' },
  { id: 2, title: '真实岗位模拟', description: '基于真实企业招聘需求，定制化岗位面试流程。' },
  { id: 3, title: 'AI 智能评估', description: '多维度能力评估，实时反馈面试表现，提供改进建议。' },
  { id: 4, title: '知识库沉淀', description: '构建个人专属知识体系，随时查阅复习。' },
  { id: 5, title: '实战模拟', description: '还原真实面试场景，支持代码考核与场景问答。' },
  { id: 6, title: '复盘提升', description: '面试记录自动保存，随时回放复盘，针对性突破。' },
]
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
    <div class="grid lg:grid-cols-2 gap-16 items-start">
      <!-- Left Column: Hero -->
      <div class="space-y-10 pt-4">
        <div class="space-y-6">
          <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            AI 驱动的<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              模拟面试系统
            </span>
          </h1>
          <p class="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-lg">
            通过 AI 数字人进行真实面试模拟，提升你的面试技能。<br />
            智能评估、精准反馈、持续提升。
          </p>
        </div>

        <div class="flex flex-wrap gap-4">
          <router-link to="/positions" class="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
            去面试
          </router-link>
          <router-link to="/positions" class="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all border border-gray-700 flex items-center gap-2 group">
            浏览岗位
            <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </router-link>
        </div>

        <div class="flex items-center gap-12 pt-4">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl font-bold text-white mb-1">{{ stat.value }}</div>
            <div class="text-sm text-gray-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Cards Grid -->
      <div class="relative">
        <div class="absolute inset-x-0 -top-8 h-20 bg-gradient-to-b from-gray-950 to-transparent z-10 pointer-events-none"></div>
        
        <div class="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pb-8">
          <div 
            v-for="card in features" 
            :key="card.id"
            class="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-gray-800/50 transition-all cursor-pointer"
          >
            <div class="aspect-video bg-gray-800/50 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
              <CubeIcon class="w-8 h-8 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 class="text-white font-medium mb-1 group-hover:text-emerald-400 transition-colors">{{ card.title }}</h3>
            <p class="text-gray-500 text-sm">{{ card.description }}</p>
          </div>
        </div>

        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pointer-events-none"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbar for Webkit */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(31, 41, 55, 0.5);
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(55, 65, 81, 0.8);
}
</style>
