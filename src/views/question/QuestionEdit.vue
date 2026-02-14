<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createQuestion, getQuestion, updateQuestion, listQuestionBanks } from '@/api/question'
import type { QuestionCreate, QuestionUpdate, QuestionBank } from '@/types/question'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const saving = ref(false)
const loading = ref(false)
const banks = ref<QuestionBank[]>([])

const form = reactive<QuestionCreate>({
  bank_id: '',
  title: '',
  content: '',
  type: 'technical',
  difficulty: 'medium',
  difficulty_score: 5,
  category: '',
  tags: [],
  reference_answer: '',
  answer_key_points: []
})

const tagInput = ref('')
const keyPointInput = ref('')

onMounted(async () => {
  // Load banks for selection
  try {
    const res = await listQuestionBanks({ page_size: 100 })
    banks.value = res.data.items
    // Pre-select bank if passed in query
    if (route.query.bank_id) {
      form.bank_id = route.query.bank_id as string
    }
  } catch (error) {
    console.error('Failed to load banks:', error)
  }

  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    loading.value = true
    try {
      const res = await getQuestion(id)
      const data = res.data
      Object.assign(form, {
        bank_id: data.bank_id,
        title: data.title,
        content: data.content,
        type: data.type,
        difficulty: data.difficulty,
        difficulty_score: data.difficulty_score || 5,
        category: data.category || '',
        tags: data.tags || [],
        reference_answer: data.reference_answer || '',
        answer_key_points: data.answer_key_points || []
      })
    } catch (error) {
      console.error('Failed to load question:', error)
      router.push('/questions/banks')
    } finally {
      loading.value = false
    }
  }
})

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !form.tags?.includes(tag)) {
    if (!form.tags) form.tags = []
    form.tags.push(tag)
    tagInput.value = ''
  }
}

function removeTag(tag: string) {
  if (form.tags) {
    form.tags = form.tags.filter(t => t !== tag)
  }
}

function addKeyPoint() {
  const point = keyPointInput.value.trim()
  if (point) {
    if (!form.answer_key_points) form.answer_key_points = []
    form.answer_key_points.push(point)
    keyPointInput.value = ''
  }
}

function removeKeyPoint(index: number) {
  if (form.answer_key_points) {
    form.answer_key_points.splice(index, 1)
  }
}

async function handleSubmit() {
  if (!form.title || !form.content || !form.bank_id) return
  
  saving.value = true
  try {
    if (isEdit.value) {
      await updateQuestion(route.params.id as string, form as QuestionUpdate)
    } else {
      await createQuestion(form)
    }
    router.back()
  } catch (error) {
    console.error('Save failed:', error)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6 flex items-center gap-4">
        <button 
          @click="router.back()"
          class="p-2 rounded-lg hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-bold">{{ isEdit ? '编辑题目' : '创建新题目' }}</h1>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        加载中...
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">所属题库 <span class="text-red-500">*</span></label>
            <select
              v-model="form.bank_id"
              required
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            >
              <option value="" disabled>请选择题库</option>
              <option v-for="bank in banks" :key="bank.id" :value="bank.id">
                {{ bank.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">题目标题 <span class="text-red-500">*</span></label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="输入题目标题"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">类型</label>
              <select
                v-model="form.type"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              >
                <option value="technical">技术题</option>
                <option value="scenario">场景题</option>
                <option value="algorithm">算法题</option>
                <option value="behavioral">行为题</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">难度</label>
              <select
                v-model="form.difficulty"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">分类</label>
              <input
                v-model="form.category"
                type="text"
                placeholder="例如: React, Vue"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">题目内容 <span class="text-red-500">*</span></label>
            <textarea
              v-model="form.content"
              required
              rows="8"
              placeholder="输入详细的题目描述..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            ></textarea>
          </div>
        </div>

        <!-- Answer & Criteria -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">参考答案</label>
            <textarea
              v-model="form.reference_answer"
              rows="6"
              placeholder="输入参考答案..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">得分要点</label>
            <div class="space-y-2 mb-2">
              <div 
                v-for="(point, index) in form.answer_key_points" 
                :key="index"
                class="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
              >
                <span class="flex-1 text-sm text-gray-200">{{ point }}</span>
                <button @click="removeKeyPoint(index)" type="button" class="text-gray-500 hover:text-red-400">&times;</button>
              </div>
            </div>
            <div class="flex gap-2">
              <input
                v-model="keyPointInput"
                @keydown.enter.prevent="addKeyPoint"
                type="text"
                placeholder="添加得分要点 (按回车)"
                class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
              <button
                @click="addKeyPoint"
                type="button"
                class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-lg transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <label class="text-sm font-medium text-gray-300">标签</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 rounded-full text-sm flex items-center gap-2"
            >
              {{ tag }}
              <button @click="removeTag(tag)" type="button" class="hover:text-white">&times;</button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="tagInput"
              @keydown.enter.prevent="addTag"
              type="text"
              placeholder="添加标签 (按回车)"
              class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            />
            <button
              @click="addTag"
              type="button"
              class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-lg transition-colors"
            >
              添加
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            @click="router.back()"
            class="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? '保存中...' : '保存题目' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
