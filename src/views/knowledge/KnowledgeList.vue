<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { listKnowledgeDocuments, deleteKnowledgeDocument } from '@/api/knowledge'
import type { KnowledgeDocument, KnowledgeDocumentListParams } from '@/types/knowledge'
import { 
  DocumentTextIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const documents = ref<KnowledgeDocument[]>([])
const total = ref(0)
const loading = ref(false)

const queryParams = reactive<KnowledgeDocumentListParams>({
  page: 1,
  page_size: 12,
  category: '',
  doc_type: ''
})

const categories = [
  { label: '全部', value: '' },
  { label: '前端', value: 'frontend' },
  { label: '后端', value: 'backend' },
  { label: '算法', value: 'algorithm' },
  { label: '系统设计', value: 'system' }
]

const docTypes = [
  { label: '全部', value: '' },
  { label: '技术文档', value: '技术文档' },
  { label: '面试题解', value: '面试题解' },
  { label: '最佳实践', value: '最佳实践' }
]

async function fetchDocuments() {
  loading.value = true
  try {
    const res = await listKnowledgeDocuments(queryParams)
    documents.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    console.error('Failed to fetch documents:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.page = 1
  fetchDocuments()
}

watch(() => [queryParams.category, queryParams.doc_type], () => {
  handleSearch()
})

function navigateToDetail(id: string) {
  router.push(`/knowledge/${id}`)
}

function navigateToCreate() {
  router.push('/knowledge/create')
}

onMounted(() => {
  fetchDocuments()
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            知识库
          </h1>
          <p class="text-gray-400 mt-1">面试知识点、技术文档与最佳实践</p>
        </div>
        <button
          @click="navigateToCreate"
          class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <PlusIcon class="w-5 h-5" />
          <span>新建文档</span>
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
          class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option v-for="opt in categories" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <select
          v-model="queryParams.doc_type"
          class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option v-for="opt in docTypes" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="h-48 bg-gray-900 rounded-xl animate-pulse border border-gray-800"></div>
      </div>

      <div v-else-if="documents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="doc in documents"
          :key="doc.id"
          @click="navigateToDetail(doc.id)"
          class="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all cursor-pointer flex flex-col h-full"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <span 
                v-if="doc.category"
                class="px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50"
              >
                {{ doc.category }}
              </span>
              <span 
                v-if="doc.doc_type"
                class="px-2 py-0.5 rounded text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800/50"
              >
                {{ doc.doc_type }}
              </span>
            </div>
            <DocumentTextIcon class="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </div>

          <h3 class="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors mb-2 line-clamp-2">
            {{ doc.title }}
          </h3>

          <p class="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
            {{ doc.summary || '暂无摘要' }}
          </p>

          <div class="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-800">
            <div class="flex items-center gap-1">
              <EyeIcon class="w-3.5 h-3.5" />
              <span>{{ doc.view_count }}</span>
            </div>
            <div class="flex items-center gap-1">
              <ClockIcon class="w-3.5 h-3.5" />
              <span>{{ new Date(doc.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-500">
        <DocumentTextIcon class="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>暂无文档，开始创建你的第一个知识库文档吧</p>
      </div>

      <!-- Pagination (Simple) -->
      <div v-if="total > queryParams.page_size!" class="flex justify-center gap-2 mt-8">
        <button
          :disabled="queryParams.page === 1"
          @click="queryParams.page!--; fetchDocuments()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          :disabled="queryParams.page! * queryParams.page_size! >= total"
          @click="queryParams.page!++; fetchDocuments()"
          class="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>
