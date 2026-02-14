<script setup lang="ts">
import { 
  CubeIcon, 
  ArrowRightIcon, 
  BookOpenIcon,
  CpuChipIcon,
  ChartBarIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  FireIcon
} from '@heroicons/vue/24/outline'

const stats = [
  { value: '1000+', label: '面试真题' },
  { value: '50+', label: '热门岗位' },
  { value: 'AI', label: '智能评估' },
]

const features = [
  { 
    id: 1, 
    title: '海量题库', 
    description: '覆盖全栈开发领域，精选高频真题。',
    icon: BookOpenIcon,
    gradient: 'from-orange-500 to-amber-500'
  },
  { 
    id: 2, 
    title: '岗位模拟', 
    description: '真实还原大厂面试流程与考核标准。',
    icon: BriefcaseIcon,
    gradient: 'from-rose-500 to-pink-500'
  },
  { 
    id: 3, 
    title: 'AI 评估', 
    description: '深度分析回答质量，提供优化建议。',
    icon: CpuChipIcon,
    gradient: 'from-teal-500 to-emerald-500'
  },
  { 
    id: 4, 
    title: '知识沉淀', 
    description: '构建个人专属知识体系，查漏补缺。',
    icon: CubeIcon,
    gradient: 'from-blue-500 to-indigo-500'
  },
  { 
    id: 5, 
    title: '实战演练', 
    description: '在线代码编辑器，支持实时运行。',
    icon: CodeBracketIcon,
    gradient: 'from-violet-500 to-purple-500'
  },
  { 
    id: 6, 
    title: '复盘提升', 
    description: '自动生成面试报告，可视化能力模型。',
    icon: ChartBarIcon,
    gradient: 'from-red-500 to-orange-500'
  },
]
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative z-10">
      <div class="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium backdrop-blur-sm">
          <FireIcon class="w-4 h-4" />
          <span>全新 AI 驱动面试体验</span>
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
          掌握面试主动权<br />
          <span class="text-gradient">成就职业梦想</span>
        </h1>
        
        <p class="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
          Mock.AI 通过先进的数字人技术，为您提供身临其境的模拟面试环境。
          实时反馈、精准评估，助您在每一次真实面试中脱颖而出。
        </p>
        
        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
          <router-link to="/positions" class="btn-primary flex items-center gap-2 text-lg px-8 py-3">
            开始模拟面试
            <ArrowRightIcon class="w-5 h-5" />
          </router-link>
          <router-link to="/knowledge" class="btn-secondary flex items-center gap-2 text-lg px-8 py-3">
            浏览知识库
          </router-link>
        </div>

        <div class="grid grid-cols-3 gap-8 md:gap-16 pt-12 border-t border-white/5 w-full max-w-3xl">
          <div v-for="stat in stats" :key="stat.label" class="space-y-1">
            <div class="text-3xl lg:text-4xl font-bold text-white">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 uppercase tracking-wider">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-4 lg:px-8 py-20 relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-white mb-4">全方位能力提升</h2>
        <p class="text-gray-400 max-w-xl mx-auto">从基础知识到实战演练，我们为您准备了完整的面试准备工具链。</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="feature in features" 
          :key="feature.id"
          class="glass-card p-6 group cursor-pointer hover:-translate-y-1"
        >
          <div :class="['w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br text-white shadow-lg', feature.gradient]">
            <component :is="feature.icon" class="w-6 h-6" />
          </div>
          
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
            {{ feature.title }}
          </h3>
          <p class="text-gray-400 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
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
