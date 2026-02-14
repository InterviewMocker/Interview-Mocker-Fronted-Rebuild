<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { listQuestionBanks, deleteQuestionBank } from '@/api/question'
import type { QuestionBank, QuestionBankListParams } from '@/types/question'
import { 
  FolderIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  TagIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

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

async function fetchBanks() {
  loading.value = true
  try {
    const res = await listQuestionBanks(queryParams)
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
  router.push(`/questions/banks/${id}`)
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

onMounted(() => {
  fetchBanks()
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            题库管理
          </h1>
          <p class="text-gray-400 mt-1">管理面试题目集合</p>
        </div>
        <button
          @click="navigateToCreate"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <PlusIcon class="w-5 h-5" />
          <span>新建题库</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <div class="flex items-center gap-2 text-gray-400">
          <MagnifyingGlassIcon class="w-5 h-5" />
          <span class="text-sm font-medium">筛选：</span>
        </div>
        
        <select
          v-model="queryParams.category"
          @change="handleSearch"
          class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option v-for="opt in categories" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="h-40 bg-gray-900 rounded-xl animate-pulse border border-gray-800"></div>
      </div>

      <div v-else-if="banks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="bank in banks"
          :key="bank.id"
          class="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all flex flex-col h-full relative"
        >
          <!-- Card Content (Clickable) -->
          <div @click="navigateToBank(bank.id)" class="cursor-pointer flex-1">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span 
                  v-if="bank.category"
                  class="px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50"
                >
                  {{ bank.category }}
                </span>
                <span 
                  :class="[
                    'px-2 py-0.5 rounded text-xs font-medium border',
                    bank.status === 'active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' : 'bg-gray-800 text-gray-400 border-gray-700'
                  ]"
                >
                  {{ bank.status === 'active' ? '活跃' : '停用' }}
                </span>
              </div>
              <FolderIcon class="w-6 h-6 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </div>

            <h3 class="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors mb-2">
              {{ bank.name }}
            </h3>

            <p class="text-sm text-gray-400 line-clamp-2 mb-4">
              {{ bank.description || '暂无描述' }}
            </p>

            <div v-if="bank.tags?.length" class="flex flex-wrap gap-2 mt-auto">
              <span 
                v-for="tag in bank.tags.slice(0, 3)" 
                :key="tag"
                class="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700"
              >
                {{ tag }}
              </span>
              <span v-if="bank.tags.length > 3" class="text-xs text-gray-500 self-center">
                +{{ bank.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click.stop="editBank(bank.id)"
              class="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors"
              title="编辑"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button 
              @click.stop="handleDelete(bank.id)"
              class="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30 transition-colors"
              title="删除"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        <FolderIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>暂无题库，创建一个开始吧</p>
      </div>

      <!-- Pagination -->
      <div v-if="total > queryParams.page_size!" class="flex justify-center gap-2 mt-8">
        <button
          :disabled="queryParams.page === 1"
          @click="queryParams.page!--; fetchBanks()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          :disabled="queryParams.page! * queryParams.page_size! >= total"
          @click="queryParams.page!++; fetchBanks()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
