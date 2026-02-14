<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createKnowledgeDocument, getKnowledgeDocument, updateKnowledgeDocument } from '@/api/knowledge'
import type { KnowledgeDocumentCreate, KnowledgeDocumentUpdate } from '@/types/knowledge'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const saving = ref(false)
const loading = ref(false)

const form = reactive<KnowledgeDocumentCreate>({
  title: '',
  content: '',
  summary: '',
  category: '',
  doc_type: '',
  difficulty: 'medium',
  tags: []
})

const tagInput = ref('')

// Load existing document if editing
onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    loading.value = true
    try {
      const res = await getKnowledgeDocument(id)
      Object.assign(form, res.data)
    } catch (error) {
      console.error('Failed to load document:', error)
      router.push('/knowledge')
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

async function handleSubmit() {
  if (!form.title || !form.content) return
  
  saving.value = true
  try {
    if (isEdit.value) {
      await updateKnowledgeDocument(route.params.id as string, form as KnowledgeDocumentUpdate)
    } else {
      await createKnowledgeDocument(form)
    }
    router.push('/knowledge')
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
        <h1 class="text-2xl font-bold">{{ isEdit ? '编辑文档' : '创建新文档' }}</h1>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        加载中...
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">标题 <span class="text-red-500">*</span></label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="输入文档标题"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">分类</label>
              <select
                v-model="form.category"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              >
                <option value="">请选择</option>
                <option value="frontend">前端</option>
                <option value="backend">后端</option>
                <option value="algorithm">算法</option>
                <option value="system">系统设计</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">文档类型</label>
              <select
                v-model="form.doc_type"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              >
                <option value="">请选择</option>
                <option value="技术文档">技术文档</option>
                <option value="面试题解">面试题解</option>
                <option value="最佳实践">最佳实践</option>
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
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">摘要</label>
            <textarea
              v-model="form.summary"
              rows="3"
              placeholder="简短的文档描述..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Content Editor -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">内容 (Markdown) <span class="text-red-500">*</span></label>
            <textarea
              v-model="form.content"
              required
              rows="20"
              placeholder="# 开始编写..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            ></textarea>
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
            {{ saving ? '保存中...' : '保存文档' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
