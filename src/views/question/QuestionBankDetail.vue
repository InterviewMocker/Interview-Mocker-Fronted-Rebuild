<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { listQuestions, deleteQuestion, getQuestionBank } from '@/api/question'
import type { Question, QuestionListParams, QuestionBank } from '@/types/question'
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon, 
  TrashIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const bankId = route.params.id as string

const bank = ref<QuestionBank | null>(null)
const questions = ref<Question[]>([])
const total = ref(0)
const loading = ref(false)

const queryParams = reactive<QuestionListParams>({
  page: 1,
  page_size: 20,
  bank_id: bankId,
  type: undefined,
  difficulty: undefined
})

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-900/30 text-green-400 border-green-800/50',
  medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
  hard: 'bg-red-900/30 text-red-400 border-red-800/50'
}

const typeNames: Record<string, string> = {
  technical: '技术题',
  scenario: '场景题',
  algorithm: '算法题',
  behavioral: '行为题'
}

async function fetchBankInfo() {
  try {
    const res = await getQuestionBank(bankId)
    bank.value = res.data
  } catch (error) {
    console.error('Failed to load bank info:', error)
  }
}

async function fetchQuestions() {
  loading.value = true
  try {
    const res = await listQuestions(queryParams)
    questions.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to fetch questions:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchQuestions()
}

function navigateToCreate() {
  router.push(`/questions/create?bank_id=${bankId}`)
}

function navigateToDetail(id: string) {
  router.push(`/questions/${id}`)
}

function editQuestion(id: string) {
  router.push(`/questions/${id}/edit`)
}

async function handleDelete(id: string) {
  if (!confirm('确定要删除这道题目吗？')) return
  
  try {
    await deleteQuestion(id)
    fetchQuestions()
  } catch (error) {
    console.error('Delete failed:', error)
  }
}

onMounted(() => {
  fetchBankInfo()
  fetchQuestions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <router-link to="/questions/banks" class="hover:text-white transition-colors">题库管理</router-link>
          <ChevronRightIcon class="w-4 h-4" />
          <span class="text-white">{{ bank?.name || '加载中...' }}</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white">
              {{ bank?.name }}
            </h1>
            <p class="text-gray-400 mt-1">{{ bank?.description || '题目列表' }}</p>
          </div>
          <button
            @click="navigateToCreate"
            class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            <PlusIcon class="w-5 h-5" />
            <span>新建题目</span>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <div class="flex items-center gap-2 text-gray-400">
          <MagnifyingGlassIcon class="w-5 h-5" />
          <span class="text-sm font-medium">筛选：</span>
        </div>
        
        <select
          v-model="queryParams.type"
          @change="handleSearch"
          class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option :value="undefined">全部类型</option>
          <option v-for="(name, key) in typeNames" :key="key" :value="key">
            {{ name }}
          </option>
        </select>

        <select
          v-model="queryParams.difficulty"
          @change="handleSearch"
          class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option :value="undefined">全部难度</option>
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>
      </div>

      <!-- List -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        加载中...
      </div>

      <div v-else-if="questions.length > 0" class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-gray-800 bg-gray-900/50">
                <th class="px-6 py-4 text-sm font-medium text-gray-400">标题</th>
                <th class="px-6 py-4 text-sm font-medium text-gray-400">类型</th>
                <th class="px-6 py-4 text-sm font-medium text-gray-400">难度</th>
                <th class="px-6 py-4 text-sm font-medium text-gray-400 text-right">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr 
                v-for="q in questions" 
                :key="q.id"
                @click="navigateToDetail(q.id)"
                class="hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="font-medium text-white mb-1">{{ q.title }}</div>
                  <div v-if="q.tags?.length" class="flex gap-2">
                    <span v-for="tag in q.tags.slice(0, 3)" :key="tag" class="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-gray-300">{{ typeNames[q.type] || q.type }}</span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    :class="['px-2 py-1 rounded text-xs border font-medium', difficultyColors[q.difficulty]]"
                  >
                    {{ q.difficulty === 'easy' ? '简单' : q.difficulty === 'medium' ? '中等' : '困难' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2" @click.stop>
                    <button 
                      @click="editQuestion(q.id)"
                      class="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="handleDelete(q.id)"
                      class="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                      title="删除"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        <p>该题库暂无题目</p>
      </div>

      <!-- Pagination -->
      <div v-if="total > queryParams.page_size!" class="flex justify-center gap-2 mt-8">
        <button
          :disabled="queryParams.page === 1"
          @click="queryParams.page!--; fetchQuestions()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          :disabled="queryParams.page! * queryParams.page_size! >= total"
          @click="queryParams.page!++; fetchQuestions()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
