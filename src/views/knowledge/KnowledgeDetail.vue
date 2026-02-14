<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getKnowledgeDocument, deleteKnowledgeDocument } from '@/api/knowledge'
import type { KnowledgeDocumentDetail } from '@/types/knowledge'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  ClockIcon, 
  EyeIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

// Note: In a real app, use a markdown renderer like 'markdown-it' or 'marked'
// For this prototype, we'll just display raw text in pre tag or simple replacement
import { marked } from 'marked' // Assuming marked is available or similar simple render

const router = useRouter()
const route = useRoute()
const document = ref<KnowledgeDocumentDetail | null>(null)
const loading = ref(false)

// Simple markdown rendering safety check
const renderedContent = computed(() => {
  if (!document.value?.content) return ''
  // Use marked to parse markdown
  return marked.parse(document.value.content)
})

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    loading.value = true
    try {
      const res = await getKnowledgeDocument(id)
      document.value = res.data
    } catch (error) {
      console.error('Failed to load document:', error)
      router.push('/knowledge')
    } finally {
      loading.value = false
    }
  }
})

function handleEdit() {
  if (document.value) {
    router.push(`/knowledge/${document.value.id}/edit`)
  }
}

async function handleDelete() {
  if (!document.value || !confirm('确定要删除此文档吗？')) return
  
  try {
    await deleteKnowledgeDocument(document.value.id)
    router.push('/knowledge')
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20 text-gray-500">
        加载中...
      </div>

      <div v-else-if="document" class="space-y-8">
        <!-- Header -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <button 
              @click="router.back()"
              class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              <span>返回列表</span>
            </button>
            
            <div class="flex items-center gap-3">
              <button 
                @click="handleEdit"
                class="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors text-sm"
              >
                <PencilIcon class="w-4 h-4" />
                编辑
              </button>
              <button 
                @click="handleDelete"
                class="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg border border-red-900/30 transition-colors text-sm"
              >
                <TrashIcon class="w-4 h-4" />
                删除
              </button>
            </div>
          </div>

          <h1 class="text-3xl lg:text-4xl font-bold text-white leading-tight">
            {{ document.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span 
              v-if="document.category"
              class="px-2 py-1 rounded-md bg-blue-900/30 text-blue-400 border border-blue-800/50"
            >
              {{ document.category }}
            </span>
            <div class="flex items-center gap-1">
              <ClockIcon class="w-4 h-4" />
              <span>{{ new Date(document.created_at).toLocaleDateString() }}</span>
            </div>
            <div class="flex items-center gap-1">
              <EyeIcon class="w-4 h-4" />
              <span>{{ document.view_count }} 次阅读</span>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="document.tags?.length" class="flex flex-wrap gap-2">
          <span 
            v-for="tag in document.tags" 
            :key="tag"
            class="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-900 text-gray-400 border border-gray-800"
          >
            <TagIcon class="w-3 h-3" />
            {{ tag }}
          </span>
        </div>

        <!-- Content -->
        <article class="prose prose-invert prose-emerald max-w-none bg-gray-900/30 p-8 rounded-2xl border border-gray-800/50">
          <div v-html="renderedContent"></div>
        </article>
      </div>
    </div>
  </div>
</template>

<style>
/* Add some basic prose styling if Tailwind Typography plugin isn't active or fully configured */
.prose h1, .prose h2, .prose h3 {
  color: white;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
}
.prose p {
  color: #d1d5db;
  line-height: 1.75;
  margin-bottom: 1.25em;
}
.prose ul, .prose ol {
  color: #d1d5db;
  margin-bottom: 1.25em;
  padding-left: 1.5em;
}
.prose li {
  margin-bottom: 0.5em;
}
.prose code {
  background-color: #1f2937;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-family: monospace;
  font-size: 0.9em;
}
.prose pre {
  background-color: #111827;
  padding: 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin-bottom: 1.5em;
}
.prose pre code {
  background-color: transparent;
  padding: 0;
  color: #e5e7eb;
}
.prose blockquote {
  border-left: 4px solid #10b981;
  padding-left: 1em;
  font-style: italic;
  color: #9ca3af;
  margin-bottom: 1.5em;
}
</style>
