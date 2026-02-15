<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  extractQuestions, 
  batchCreateQuestions, 
  importExtractedQuestions,
  getExtractionTask
} from '@/api/question'
import type { 
  QuestionBatchCreateItem, 
  QuestionBatchCreate,
  QuestionExtractionTask,
  QuestionExtractionEvent
} from '@/types/question'
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CpuChipIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const bankId = route.query.bank_id as string

const activeTab = ref<'file' | 'manual'>('file')
const loading = ref(false)
const error = ref<string | null>(null)

// ================= File Import Logic =================

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const uploadProgress = ref(0)
const extractionStatus = ref<'idle' | 'uploading' | 'processing' | 'review' | 'importing' | 'completed'>('idle')
const taskId = ref<string | null>(null)
const extractedQuestions = ref<QuestionBatchCreateItem[]>([])
const selectedIndices = ref<Set<number>>(new Set())

// SSE Reader
let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    error.value = null
  }
}

async function startExtraction() {
  if (!selectedFile.value || !bankId) return
  
  loading.value = true
  extractionStatus.value = 'uploading'
  error.value = null
  extractedQuestions.value = []
  
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('bank_id', bankId)
  
  try {
    const response = await extractQuestions(formData)
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }
    
    if (!response.body) throw new Error('No response body')
    
    extractionStatus.value = 'processing'
    reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      
      let currentEvent = ''
      
      for (const line of lines) {
        if (line.trim() === '') continue
        
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim()
        } else if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            handleSSEEvent(currentEvent, data)
          } catch (e) {
            console.error('Failed to parse SSE data:', e)
          }
        }
      }
    }
    
  } catch (err: any) {
    console.error('Extraction error:', err)
    error.value = err.message || 'Extraction failed'
    extractionStatus.value = 'idle'
  } finally {
    loading.value = false
    if (reader) reader.releaseLock()
  }
}

function handleSSEEvent(event: string, data: any) {
  switch (event) {
    case 'task_created':
      taskId.value = data.task_id
      localStorage.setItem('current_extraction_task', data.task_id)
      break
      
    case 'chunk_progress':
      uploadProgress.value = data.progress
      if (data.new_questions) {
        extractedQuestions.value.push(...data.new_questions)
        // Auto-select new questions
        const startIndex = extractedQuestions.value.length - data.new_questions.length
        for (let i = 0; i < data.new_questions.length; i++) {
          selectedIndices.value.add(startIndex + i)
        }
      }
      break
      
    case 'completed':
      extractionStatus.value = 'review'
      if (data.questions) {
        // Ensure we have the full list if provided
        extractedQuestions.value = data.questions
        // Select all by default
        selectedIndices.value = new Set(data.questions.map((_: any, i: number) => i))
      }
      localStorage.removeItem('current_extraction_task')
      break
      
    case 'error':
      error.value = data.message
      if (data.partial_questions) {
        extractedQuestions.value = data.partial_questions
        extractionStatus.value = 'review'
      } else {
        extractionStatus.value = 'idle'
      }
      break
  }
}

function toggleSelection(index: number) {
  if (selectedIndices.value.has(index)) {
    selectedIndices.value.delete(index)
  } else {
    selectedIndices.value.add(index)
  }
}

function toggleAll() {
  if (selectedIndices.value.size === extractedQuestions.value.length) {
    selectedIndices.value.clear()
  } else {
    extractedQuestions.value.forEach((_, i) => selectedIndices.value.add(i))
  }
}

async function confirmImport() {
  if (!taskId.value || !bankId || selectedIndices.value.size === 0) return
  
  loading.value = true
  extractionStatus.value = 'importing'
  
  try {
    await importExtractedQuestions({
      task_id: taskId.value,
      bank_id: bankId,
      question_indices: Array.from(selectedIndices.value)
    })
    
    extractionStatus.value = 'completed'
    setTimeout(() => {
      router.push(`/questions/banks/${bankId}`)
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Import failed'
    extractionStatus.value = 'review'
  } finally {
    loading.value = false
  }
}

// ================= Manual Batch Logic =================

const manualQuestions = ref<QuestionBatchCreateItem[]>([
  {
    title: '',
    content: '',
    type: 'technical',
    difficulty: 'medium',
    difficulty_score: 5,
    tags: [],
    reference_answer: '',
    answer_key_points: []
  }
])

function addManualQuestion() {
  manualQuestions.value.push({
    title: '',
    content: '',
    type: 'technical',
    difficulty: 'medium',
    difficulty_score: 5,
    tags: [],
    reference_answer: '',
    answer_key_points: []
  })
}

function removeManualQuestion(index: number) {
  if (manualQuestions.value.length > 1) {
    manualQuestions.value.splice(index, 1)
  }
}

function updateManualQuestion(index: number, field: keyof QuestionBatchCreateItem, value: any) {
  const q = manualQuestions.value[index]
  // @ts-ignore
  q[field] = value
}

async function submitManualBatch() {
  // Validate
  const validQuestions = manualQuestions.value.filter(q => q.title && q.content)
  if (validQuestions.length === 0) {
    error.value = '请至少填写一道完整的题目'
    return
  }
  
  loading.value = true
  try {
    await batchCreateQuestions({
      bank_id: bankId,
      questions: validQuestions
    })
    
    router.push(`/questions/banks/${bankId}`)
  } catch (err: any) {
    error.value = err.message || 'Batch creation failed'
  } finally {
    loading.value = false
  }
}

// Restore task on mount
onMounted(async () => {
  if (!bankId) {
    error.value = '缺少题库ID参数'
    return
  }

  const savedTaskId = localStorage.getItem('current_extraction_task')
  if (savedTaskId) {
    try {
      const res = await getExtractionTask(savedTaskId)
      const task = res.data
      
      if (task.status === 'processing') {
        taskId.value = task.task_id
        extractionStatus.value = 'processing'
        // TODO: Resume SSE or polling? For now we just reset as SSE reconnection is complex without backend keep-alive
        // Or we just poll
        pollTask(task.task_id)
      } else if (task.status === 'completed' && task.questions) {
        taskId.value = task.task_id
        extractedQuestions.value = task.questions
        extractionStatus.value = 'review'
        selectedIndices.value = new Set(task.questions.map((_, i) => i))
      }
    } catch (e) {
      console.error('Failed to restore task', e)
      localStorage.removeItem('current_extraction_task')
    }
  }
})

async function pollTask(tid: string) {
  const interval = setInterval(async () => {
    try {
      const res = await getExtractionTask(tid)
      const task = res.data
      
      if (task.status === 'completed' || task.status === 'failed') {
        clearInterval(interval)
        taskId.value = task.task_id
        if (task.questions) extractedQuestions.value = task.questions
        extractionStatus.value = task.status === 'completed' ? 'review' : 'idle'
        if (task.status === 'completed') {
          selectedIndices.value = new Set((task.questions || []).map((_, i) => i))
          localStorage.removeItem('current_extraction_task')
        }
      }
      // Update progress
      uploadProgress.value = task.progress
    } catch (e) {
      clearInterval(interval)
    }
  }, 2000)
}

onUnmounted(() => {
  if (reader) reader.cancel()
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button 
          @click="router.back()"
          class="p-2 rounded-lg hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold">导入题目</h1>
          <p class="text-gray-400 text-sm">批量导入或创建题目到题库</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-800">
        <button
          @click="activeTab = 'file'"
          :class="[
            'px-6 py-3 font-medium text-sm transition-colors border-b-2',
            activeTab === 'file' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-gray-400 hover:text-white'
          ]"
        >
          <div class="flex items-center gap-2">
            <DocumentTextIcon class="w-5 h-5" />
            智能文件提取
          </div>
        </button>
        <button
          @click="activeTab = 'manual'"
          :class="[
            'px-6 py-3 font-medium text-sm transition-colors border-b-2',
            activeTab === 'manual' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-gray-400 hover:text-white'
          ]"
        >
          <div class="flex items-center gap-2">
            <CpuChipIcon class="w-5 h-5" />
            批量手动录入
          </div>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
        <ExclamationCircleIcon class="w-5 h-5 flex-shrink-0" />
        <span>{{ error }}</span>
      </div>

      <!-- Content: File Import -->
      <div v-if="activeTab === 'file'" class="space-y-6">
        
        <!-- Upload Zone -->
        <div v-if="extractionStatus === 'idle' || extractionStatus === 'uploading'" 
          class="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-emerald-500/50 hover:bg-gray-900/50 transition-all cursor-pointer"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleFileChange"
        >
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept=".txt,.md,.docx,.pdf"
            @change="handleFileChange"
          />
          <CloudArrowUpIcon class="w-12 h-12 mx-auto text-gray-500 mb-4" />
          <h3 class="text-lg font-medium text-white mb-2">点击或拖拽上传文件</h3>
          <p class="text-gray-400 text-sm mb-6">支持 .txt, .md, .docx, .pdf (最大 50MB)</p>
          
          <div v-if="selectedFile" class="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg text-emerald-400 mb-4">
            <DocumentTextIcon class="w-5 h-5" />
            {{ selectedFile.name }}
          </div>
          
          <div v-if="selectedFile">
            <button 
              @click.stop="startExtraction"
              :disabled="loading"
              class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {{ loading ? '上传解析中...' : '开始智能提取' }}
            </button>
          </div>
        </div>

        <!-- Processing State -->
        <div v-else-if="extractionStatus === 'processing'" class="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <div class="animate-pulse space-y-4">
            <div class="h-2 bg-gray-700 rounded-full max-w-md mx-auto overflow-hidden">
              <div class="h-full bg-emerald-500 transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
            <p class="text-emerald-400 font-medium">正在通过 AI 智能分析题目...</p>
            <p class="text-gray-500 text-sm">已提取 {{ extractedQuestions.length }} 道题目</p>
          </div>
        </div>

        <!-- Review & Import State -->
        <div v-if="(extractionStatus === 'processing' || extractionStatus === 'review') && extractedQuestions.length > 0" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-white">提取结果预览 ({{ extractedQuestions.length }})</h3>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="selectedIndices.size === extractedQuestions.length"
                  @change="toggleAll"
                  class="rounded bg-gray-800 border-gray-700 text-emerald-500 focus:ring-emerald-500/20"
                />
                全选
              </label>
              <button 
                @click="confirmImport"
                :disabled="loading || selectedIndices.size === 0"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                导入选中题目 ({{ selectedIndices.size }})
              </button>
            </div>
          </div>

          <div class="grid gap-4">
            <div 
              v-for="(q, index) in extractedQuestions" 
              :key="index"
              :class="[
                'p-4 rounded-xl border transition-all cursor-pointer',
                selectedIndices.has(index) 
                  ? 'bg-emerald-900/10 border-emerald-500/50' 
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              ]"
              @click="toggleSelection(index)"
            >
              <div class="flex items-start gap-3">
                <div class="pt-1">
                  <input 
                    type="checkbox" 
                    :checked="selectedIndices.has(index)"
                    readonly
                    class="rounded bg-gray-800 border-gray-700 text-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-emerald-400 text-sm font-bold">[{{ q.type }}]</span>
                    <span class="text-gray-400 text-sm">难度: {{ q.difficulty }}</span>
                    <span class="text-gray-400 text-sm">分数: {{ q.difficulty_score }}</span>
                  </div>
                  <h4 class="font-medium text-white">{{ q.title }}</h4>
                  <p class="text-gray-400 text-sm line-clamp-2">{{ q.content }}</p>
                  <div v-if="q.reference_answer" class="text-gray-500 text-sm bg-gray-900/50 p-2 rounded">
                    <span class="text-gray-400">参考答案:</span> {{ q.reference_answer }}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tag in q.tags" :key="tag" class="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Success -->
        <div v-if="extractionStatus === 'completed'" class="bg-emerald-900/20 border border-emerald-800 rounded-xl p-8 text-center">
          <CheckCircleIcon class="w-16 h-16 mx-auto text-emerald-500 mb-4" />
          <h3 class="text-xl font-bold text-white mb-2">导入成功!</h3>
          <p class="text-emerald-400">题目已成功添加到题库</p>
        </div>
      </div>

      <!-- Content: Manual Batch -->
      <div v-else class="space-y-6">
        <div class="space-y-4">
          <div 
            v-for="(q, index) in manualQuestions" 
            :key="index"
            class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 relative group"
          >
            <!-- Remove Button -->
            <button 
              v-if="manualQuestions.length > 1"
              @click="removeManualQuestion(index)"
              class="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
            
            <div class="grid md:grid-cols-12 gap-4">
              <div class="md:col-span-8 space-y-2">
                <input 
                  v-model="q.title"
                  placeholder="题目标题"
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div class="md:col-span-2 space-y-2">
                 <select 
                  v-model="q.type"
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="technical">技术题</option>
                  <option value="scenario">场景题</option>
                  <option value="algorithm">算法题</option>
                  <option value="behavioral">行为题</option>
                </select>
              </div>
              <div class="md:col-span-2 space-y-2">
                <select 
                  v-model="q.difficulty"
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                </select>
              </div>
            </div>

            <textarea 
              v-model="q.content"
              rows="3"
              placeholder="题目详细内容..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            ></textarea>

            <textarea 
              v-model="q.reference_answer"
              rows="2"
              placeholder="参考答案 (可选)..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4">
          <button 
            @click="addManualQuestion"
            class="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 rounded-lg transition-colors"
          >
            <PlusIcon class="w-5 h-5" />
            添加下一题
          </button>

          <div class="flex gap-4">
            <button 
              @click="router.back()"
              class="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
            >
              取消
            </button>
            <button 
              @click="submitManualBatch"
              :disabled="loading"
              class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {{ loading ? '提交中...' : `批量提交 (${manualQuestions.length})` }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
