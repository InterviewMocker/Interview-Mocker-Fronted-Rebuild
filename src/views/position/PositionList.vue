<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { listPositions, deletePosition } from '@/api/position'
import type { Position, PositionListParams } from '@/types/position'
import { 
  BriefcaseIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const positions = ref<Position[]>([])
const total = ref(0)
const loading = ref(false)

const queryParams = reactive<PositionListParams>({
  page: 1,
  page_size: 12,
  category: ''
})

const categories = [
  { label: '全部', value: '' },
  { label: '技术类', value: '技术类' },
  { label: '产品类', value: '产品类' },
  { label: '运营类', value: '运营类' },
  { label: '设计类', value: '设计类' },
  { label: '市场类', value: '市场类' }
]

const difficultyNames: Record<string, string> = {
  junior: '初级',
  mid: '中级',
  senior: '高级',
  expert: '专家'
}

const difficultyColors: Record<string, string> = {
  junior: 'bg-green-900/30 text-green-400 border-green-800/50',
  mid: 'bg-blue-900/30 text-blue-400 border-blue-800/50',
  senior: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
  expert: 'bg-red-900/30 text-red-400 border-red-800/50'
}

async function fetchPositions() {
  loading.value = true
  try {
    const res = await listPositions(queryParams)
    positions.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to fetch positions:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchPositions()
}

function navigateToDetail(id: string) {
  router.push(`/positions/${id}`)
}

function navigateToCreate() {
  router.push('/positions/create')
}

function editPosition(id: string) {
  router.push(`/positions/${id}/edit`)
}

async function handleDelete(id: string) {
  if (!confirm('确定要删除该岗位吗？')) return
  
  try {
    await deletePosition(id)
    fetchPositions()
  } catch (error) {
    console.error('Delete failed:', error)
  }
}

onMounted(() => {
  fetchPositions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            岗位管理
          </h1>
          <p class="text-gray-400 mt-1">管理招聘岗位与面试要求</p>
        </div>
        <button
          @click="navigateToCreate"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <PlusIcon class="w-5 h-5" />
          <span>新建岗位</span>
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
        <div v-for="n in 6" :key="n" class="h-48 bg-gray-900 rounded-xl animate-pulse border border-gray-800"></div>
      </div>

      <div v-else-if="positions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="pos in positions"
          :key="pos.id"
          class="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all flex flex-col h-full relative"
        >
          <!-- Card Content -->
          <div @click="navigateToDetail(pos.id)" class="cursor-pointer flex-1">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span 
                  v-if="pos.category"
                  class="px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50"
                >
                  {{ pos.category }}
                </span>
                <span 
                  v-if="pos.difficulty_level"
                  :class="['px-2 py-0.5 rounded text-xs font-medium border', difficultyColors[pos.difficulty_level]]"
                >
                  {{ difficultyNames[pos.difficulty_level] }}
                </span>
              </div>
              <BriefcaseIcon class="w-6 h-6 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </div>

            <h3 class="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors mb-1">
              {{ pos.name }}
            </h3>
            <p class="text-xs text-gray-500 mb-3 font-mono">{{ pos.code }}</p>

            <p class="text-sm text-gray-400 line-clamp-2 mb-4">
              {{ pos.description || '暂无描述' }}
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-if="pos.education_requirement"
                class="px-2 py-0.5 rounded text-xs bg-purple-900/30 text-purple-400 border border-purple-800/50"
              >
                {{ pos.education_requirement }}
              </span>
              <div class="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                <DocumentTextIcon class="w-3 h-3" />
                {{ pos.default_question_count }} 题
              </div>
              <div class="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                <ClockIcon class="w-3 h-3" />
                {{ pos.default_duration }} 分钟
              </div>
            </div>

            <div v-if="pos.required_skills?.length" class="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-800">
              <span 
                v-for="skill in pos.required_skills.slice(0, 3)" 
                :key="skill"
                class="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700"
              >
                {{ skill }}
              </span>
              <span v-if="pos.required_skills.length > 3" class="text-xs text-gray-500 self-center">
                +{{ pos.required_skills.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click.stop="editPosition(pos.id)"
              class="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors"
              title="编辑"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button 
              @click.stop="handleDelete(pos.id)"
              class="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30 transition-colors"
              title="删除"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        <BriefcaseIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>暂无岗位，创建一个开始吧</p>
      </div>

      <!-- Pagination -->
      <div v-if="total > queryParams.page_size!" class="flex justify-center gap-2 mt-8">
        <button
          :disabled="queryParams.page === 1"
          @click="queryParams.page!--; fetchPositions()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          :disabled="queryParams.page! * queryParams.page_size! >= total"
          @click="queryParams.page!++; fetchPositions()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
