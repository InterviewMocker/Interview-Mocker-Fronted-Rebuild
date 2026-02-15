<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listCommunityBanks, copyCommunityBank } from '@/api/question'
import type { QuestionBank, QuestionBankListParams } from '@/types/question'
import QuestionBankCard from '@/components/question/QuestionBankCard.vue'
import { 
  GlobeAltIcon, 
  BookOpenIcon, 
  BriefcaseIcon, 
  SparklesIcon,
  MagnifyingGlassIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const activeTab = ref('banks')
const banks = ref<QuestionBank[]>([])
const loading = ref(false)
const total = ref(0)

const tabs = [
  { id: 'banks', name: '题库', icon: GlobeAltIcon },
  { id: 'knowledge', name: '知识库', icon: BookOpenIcon },
  { id: 'positions', name: '岗位', icon: BriefcaseIcon },
  { id: 'interview', name: '精彩面试', icon: SparklesIcon }
]

const queryParams = reactive<QuestionBankListParams>({
  page: 1,
  page_size: 12,
  category: ''
})

const categories = [
  { label: '全部', value: '' },
  { label: '前端', value: 'frontend' },
  { label: '后端', value: 'backend' },
  { label: '算法', value: 'algorithm' },
  { label: '系统设计', value: 'system' }
]

async function fetchBanks() {
  if (activeTab.value !== 'banks') return
  
  loading.value = true
  try {
    const res = await listCommunityBanks(queryParams)
    banks.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to fetch community banks:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchBanks()
}

function navigateToBank(id: string) {
  router.push(`/questions/banks/${id}`)
}

async function handleCopy(id: string) {
  if (!confirm('确定要复制该题库到我的题库吗？')) return
  
  try {
    await copyCommunityBank(id)
    alert('复制成功！已添加到"我的题库"')
  } catch (error: any) {
    console.error('Copy failed:', error)
    alert(error.response?.data?.message || '复制失败')
  }
}

onMounted(() => {
  fetchBanks()
})
</script>

<template>
  <div class="min-h-screen p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gradient">
          社区中心
        </h1>
        <p class="text-gray-400 mt-1">发现优秀的面试资源，与社区共同成长</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-6 border-b border-white/10 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id; if(tab.id === 'banks') fetchBanks()"
          class="pb-3 px-2 text-sm font-medium transition-colors relative whitespace-nowrap"
          :class="activeTab === tab.id ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'"
        >
          <div class="flex items-center gap-2">
            <component :is="tab.icon" class="w-5 h-5" />
            {{ tab.name }}
          </div>
          <div 
            v-if="activeTab === tab.id" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full"
          ></div>
        </button>
      </div>

      <!-- Content Area -->
      <div class="min-h-[400px]">
        <!-- Question Banks Tab -->
        <div v-if="activeTab === 'banks'" class="space-y-6">
          <!-- Filters -->
          <div class="glass-nav rounded-xl p-4 border border-white/5 flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2 text-gray-400">
              <MagnifyingGlassIcon class="w-5 h-5" />
              <span class="text-sm font-medium">筛选：</span>
            </div>
            
            <select
              v-model="queryParams.category"
              @change="handleSearch"
              class="bg-dark-900/50 border border-white/10 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none backdrop-blur-sm transition-all hover:border-white/20"
            >
              <option v-for="opt in categories" :key="opt.value" :value="opt.value">
                {{ opt.label || '全部分类' }}
              </option>
            </select>
          </div>

          <!-- Grid -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="h-48 bg-dark-900/50 rounded-xl animate-pulse border border-white/5"></div>
          </div>

          <div v-else-if="banks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuestionBankCard
              v-for="bank in banks"
              :key="bank.id"
              :bank="bank"
              :is-community-view="true"
              @click="navigateToBank(bank.id)"
              @copy="handleCopy"
            />
          </div>

          <div v-else class="text-center py-20 text-gray-500">
            <FolderIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>社区暂时没有公开的题库</p>
          </div>
          
          <!-- Pagination -->
          <div v-if="total > queryParams.page_size!" class="flex justify-center gap-2 mt-8">
            <button
              :disabled="queryParams.page === 1"
              @click="queryParams.page!--; fetchBanks()"
              class="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              :disabled="queryParams.page! * queryParams.page_size! >= total"
              @click="queryParams.page!++; fetchBanks()"
              class="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>

        <!-- Placeholders for other tabs -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500">
          <div class="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mb-6">
            <component 
              :is="tabs.find(t => t.id === activeTab)?.icon" 
              class="w-10 h-10 opacity-50" 
            />
          </div>
          <h3 class="text-xl font-medium text-gray-300 mb-2">功能开发中</h3>
          <p>{{ tabs.find(t => t.id === activeTab)?.name }}模块即将上线，敬请期待</p>
        </div>
      </div>
    </div>
  </div>
</template>
