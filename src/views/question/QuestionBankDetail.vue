<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { listQuestions, deleteQuestion, getQuestionBank, getQuestion } from '@/api/question'
import type { Question, QuestionListParams, QuestionBank, QuestionDetail } from '@/types/question'
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon, 
  TrashIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const bankId = route.params.id as string

const bank = ref<QuestionBank | null>(null)
const questions = ref<Question[]>([])
const total = ref(0)
const loading = ref(false)

// Modal State
const showDetailModal = ref(false)
const selectedQuestion = ref<QuestionDetail | null>(null)
const detailLoading = ref(false)

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

async function openDetailModal(id: string) {
  showDetailModal.value = true
  selectedQuestion.value = null
  detailLoading.value = true
  
  try {
    const res = await getQuestion(id)
    selectedQuestion.value = res.data
  } catch (error) {
    console.error('Failed to fetch question detail:', error)
    showDetailModal.value = false
  } finally {
    detailLoading.value = false
  }
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedQuestion.value = null
}

function editQuestion(id: string) {
  router.push(`/questions/${id}/edit`)
}

async function handleDelete(id: string) {
  if (!confirm('确定要删除这道题目吗？')) return
  
  try {
    await deleteQuestion(id)
    fetchQuestions()
    if (showDetailModal.value && selectedQuestion.value?.id === id) {
      closeDetailModal()
    }
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
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
              {{ bank?.name }}
              <span 
                v-if="bank?.community_status === 'approved'"
                class="px-2 py-1 rounded text-xs font-bold bg-primary-500 text-white shadow-lg shadow-primary-500/30"
              >
                社区题库
              </span>
            </h1>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span v-if="bank?.creator_username" class="flex items-center gap-1">
                <UserIcon class="w-4 h-4" />
                {{ bank.creator_username }}
              </span>
              <span v-if="bank?.created_at" class="flex items-center gap-1">
                <ClockIcon class="w-4 h-4" />
                {{ new Date(bank.created_at).toLocaleDateString() }}
              </span>
            </div>
            <p class="text-gray-400 mt-2">{{ bank?.description || '暂无描述' }}</p>
            <div v-if="bank?.tags?.length" class="flex flex-wrap gap-2 mt-3">
              <span 
                v-for="tag in bank.tags" 
                :key="tag"
                class="px-2 py-0.5 rounded text-xs bg-dark-800 text-gray-400 border border-white/10"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="router.push(`/questions/banks/${bankId}/import?bank_id=${bankId}`)"
              class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
            >
              <CloudArrowUpIcon class="w-5 h-5" />
              <span>导入/批量</span>
            </button>
            <button
              @click="navigateToCreate"
              class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              <PlusIcon class="w-5 h-5" />
              <span>新建题目</span>
            </button>
          </div>
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
                @click="openDetailModal(q.id)"
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

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeDetailModal"></div>
      <div class="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
        <!-- Modal Header -->
        <div class="flex items-start justify-between p-6 border-b border-gray-800">
          <div v-if="detailLoading" class="h-6 w-48 bg-gray-800 rounded animate-pulse"></div>
          <div v-else class="space-y-1 pr-8">
            <h2 class="text-xl font-bold text-white leading-tight">{{ selectedQuestion?.title }}</h2>
            <div class="flex items-center gap-2">
              <span class="text-sm text-emerald-400">{{ typeNames[selectedQuestion?.type || 'technical'] }}</span>
              <span class="text-gray-600">•</span>
              <span class="text-sm text-gray-400">{{ difficultyColors[selectedQuestion?.difficulty || 'medium'].includes('green') ? '简单' : difficultyColors[selectedQuestion?.difficulty || 'medium'].includes('yellow') ? '中等' : '困难' }}</span>
              <span v-if="selectedQuestion?.difficulty_score" class="text-sm text-gray-500">(难度分: {{ selectedQuestion.difficulty_score }})</span>
            </div>
          </div>
          <button 
            @click="closeDetailModal"
            class="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors absolute right-4 top-4"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto custom-scrollbar space-y-8">
          <div v-if="detailLoading" class="space-y-4">
            <div class="h-4 bg-gray-800 rounded w-full animate-pulse"></div>
            <div class="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
            <div class="h-4 bg-gray-800 rounded w-5/6 animate-pulse"></div>
          </div>
          
          <template v-else-if="selectedQuestion">
            <!-- Question Content -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">题目内容</h3>
              <div class="text-gray-200 whitespace-pre-wrap leading-relaxed">{{ selectedQuestion.content }}</div>
            </div>

            <!-- Reference Answer -->
            <div v-if="selectedQuestion.reference_answer" class="space-y-2">
              <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">参考答案</h3>
              <div class="bg-gray-800/50 rounded-xl p-4 text-gray-300 whitespace-pre-wrap leading-relaxed border border-gray-700/50">
                {{ selectedQuestion.reference_answer }}
              </div>
            </div>

            <!-- Key Points -->
            <div v-if="selectedQuestion.answer_key_points?.length" class="space-y-2">
              <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider">得分要点</h3>
              <ul class="space-y-3">
                <li v-for="(point, idx) in selectedQuestion.answer_key_points" :key="idx" class="flex items-start gap-3 text-sm text-gray-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                  <span class="leading-relaxed">{{ point }}</span>
                </li>
              </ul>
            </div>

            <!-- Tags -->
            <div v-if="selectedQuestion.tags?.length" class="pt-4 border-t border-gray-800">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in selectedQuestion.tags" :key="tag" class="px-2.5 py-1 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700">
                  {{ tag }}
                </span>
              </div>
            </div>
          </template>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50 rounded-b-2xl">
          <button 
            v-if="selectedQuestion"
            @click="editQuestion(selectedQuestion.id)"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-700 flex items-center gap-2"
          >
            <PencilIcon class="w-4 h-4" />
            编辑
          </button>
          <button 
            v-if="selectedQuestion"
            @click="handleDelete(selectedQuestion.id)"
            class="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-900/30 flex items-center gap-2"
          >
            <TrashIcon class="w-4 h-4" />
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #374151;
  border-radius: 20px;
}
</style>
