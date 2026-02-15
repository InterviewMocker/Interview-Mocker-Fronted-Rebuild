<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  listQuestionBanks, 
  deleteQuestionBank, 
  listCommunityBanks, 
  applyCommunity, 
  copyCommunityBank 
} from '@/api/question'
import type { QuestionBank, QuestionBankListParams } from '@/types/question'
import QuestionBankCard from '@/components/question/QuestionBankCard.vue'
import { 
  FolderIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const activeTab = ref<'my' | 'community'>('my')
const banks = ref<QuestionBank[]>([])
const total = ref(0)
const loading = ref(false)

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

// Watch for tab changes to refetch
watch(activeTab, () => {
  queryParams.page = 1
  fetchBanks()
})

async function fetchBanks() {
  loading.value = true
  try {
    const apiCall = activeTab.value === 'my' ? listQuestionBanks : listCommunityBanks
    const res = await apiCall(queryParams)
    banks.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to fetch question banks:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchBanks()
}

function navigateToBank(id: string) {
  if (activeTab.value === 'community') {
    // If viewing community bank, maybe go to a detail preview page?
    // For now, let's just go to the same detail page, but backend needs to allow access if approved.
    router.push(`/questions/banks/${id}`)
  } else {
    router.push(`/questions/banks/${id}`)
  }
}

function navigateToCreate() {
  router.push('/questions/banks/create')
}

function editBank(id: string) {
  router.push(`/questions/banks/${id}/edit`)
}

async function handleDelete(id: string) {
  if (!confirm('确定要删除该题库吗？这将同时删除其中的所有题目！')) return
  
  try {
    await deleteQuestionBank(id)
    fetchBanks()
  } catch (error) {
    console.error('Delete failed:', error)
  }
}

async function handleApply(id: string) {
  if (!confirm('确定要申请将该题库上架到社区吗？需要管理员审核通过后其他人才可见。')) return
  
  try {
    await applyCommunity(id)
    alert('申请已提交，请等待管理员审核')
    fetchBanks()
  } catch (error: any) {
    console.error('Apply failed:', error)
    alert(error.response?.data?.message || '申请失败')
  }
}

async function handleCopy(id: string) {
  if (!confirm('确定要复制该题库到我的题库吗？')) return
  
  try {
    await copyCommunityBank(id)
    alert('复制成功！已添加到"我的题库"')
    // Optional: switch to my banks tab
    // activeTab.value = 'my'
  } catch (error: any) {
    console.error('Copy failed:', error)
    alert(error.response?.data?.message || '复制失败')
  }
}

onMounted(() => {
  // Check URL query for tab
  if (route.query.tab === 'community') {
    activeTab.value = 'community'
  }
  fetchBanks()
})
</script>

<template>
  <div class="min-h-screen p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gradient">
            题库管理
          </h1>
          <p class="text-gray-400 mt-1">管理个人题库与探索社区资源</p>
        </div>
        <button
          @click="navigateToCreate"
          class="btn-primary flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          <span>新建题库</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 border-b border-white/10">
        <button
          @click="activeTab = 'my'"
          class="pb-3 px-4 text-sm font-medium transition-colors relative"
          :class="activeTab === 'my' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'"
        >
          <div class="flex items-center gap-2">
            <UserIcon class="w-5 h-5" />
            我的题库
          </div>
          <div 
            v-if="activeTab === 'my'" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full"
          ></div>
        </button>
        <button
          @click="activeTab = 'community'"
          class="pb-3 px-4 text-sm font-medium transition-colors relative"
          :class="activeTab === 'community' ? 'text-primary-400' : 'text-gray-400 hover:text-gray-200'"
        >
          <div class="flex items-center gap-2">
            <GlobeAltIcon class="w-5 h-5" />
            社区题库
          </div>
          <div 
            v-if="activeTab === 'community'" 
            class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full"
          ></div>
        </button>
      </div>

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
          :is-community-view="activeTab === 'community'"
          @click="navigateToBank(bank.id)"
          @edit="editBank"
          @delete="handleDelete"
          @apply="handleApply"
          @copy="handleCopy"
        />
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        <FolderIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>暂无题库</p>
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
  </div>
</template>
