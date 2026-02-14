<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getPosition, deletePosition } from '@/api/position'
import type { Position } from '@/types/position'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  BriefcaseIcon,
  AcademicCapIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const position = ref<Position | null>(null)
const loading = ref(false)

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

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    loading.value = true
    try {
      const res = await getPosition(id)
      position.value = res.data
    } catch (error) {
      console.error('Failed to load position:', error)
      router.push('/positions')
    } finally {
      loading.value = false
    }
  }
})

function handleEdit() {
  if (position.value) {
    router.push(`/positions/${position.value.id}/edit`)
  }
}

function startInterview() {
  if (position.value) {
    router.push(`/interview/start?position_id=${position.value.id}`)
  }
}

async function handleDelete() {
  if (!position.value || !confirm('确定要删除此岗位吗？')) return
  
  try {
    await deletePosition(position.value.id)
    router.push('/positions')
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <div v-if="loading" class="text-center py-20 text-gray-500">
        加载中...
      </div>

      <div v-else-if="position" class="space-y-8">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="space-y-4">
            <button 
              @click="router.back()"
              class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              <span>返回列表</span>
            </button>
            
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-white">{{ position.name }}</h1>
                <span 
                  v-if="position.difficulty_level"
                  :class="['px-2.5 py-0.5 rounded-full text-xs font-medium border', difficultyColors[position.difficulty_level]]"
                >
                  {{ difficultyNames[position.difficulty_level] }}
                </span>
              </div>
              <p class="text-gray-500 font-mono text-sm">{{ position.code }}</p>
            </div>
          </div>

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

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Left Column: Details -->
          <div class="md:col-span-2 space-y-8">
            <!-- Description -->
            <section class="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BriefcaseIcon class="w-5 h-5 text-emerald-500" />
                岗位描述
              </h2>
              <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {{ position.description || '暂无描述' }}
              </p>
            </section>

            <!-- Skills -->
            <section class="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AcademicCapIcon class="w-5 h-5 text-emerald-500" />
                技能要求
              </h2>
              <div v-if="position.required_skills?.length" class="flex flex-wrap gap-2">
                <span 
                  v-for="skill in position.required_skills" 
                  :key="skill"
                  class="px-3 py-1.5 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg text-sm"
                >
                  {{ skill }}
                </span>
              </div>
              <p v-else class="text-gray-500">暂无技能要求</p>
            </section>
          </div>

          <!-- Right Column: Meta Info -->
          <div class="space-y-6">
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
              <div class="space-y-4">
                <div>
                  <div class="text-sm text-gray-500 mb-1">分类</div>
                  <div class="text-white">{{ position.category || '未分类' }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500 mb-1">学历要求</div>
                  <div class="text-white">{{ position.education_requirement || '不限' }}</div>
                </div>

                <div class="pt-4 border-t border-gray-800 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 flex items-center gap-2">
                      <DocumentTextIcon class="w-4 h-4" />
                      默认题数
                    </span>
                    <span class="text-white font-mono">{{ position.default_question_count }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 flex items-center gap-2">
                      <ClockIcon class="w-4 h-4" />
                      默认时长
                    </span>
                    <span class="text-white font-mono">{{ position.default_duration }} min</span>
                  </div>
                </div>
              </div>

              <button 
                @click="startInterview"
                class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
              >
                开始模拟面试
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
