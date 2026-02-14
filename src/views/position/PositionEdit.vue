<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createPosition, getPosition, updatePosition } from '@/api/position'
import type { PositionCreate, PositionUpdate } from '@/types/position'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const loading = ref(false)

const form = reactive<PositionCreate>({
  name: '',
  code: '',
  category: '',
  description: '',
  requirements: '',
  required_skills: [],
  skill_weights: {},
  difficulty_level: 'mid',
  education_requirement: '本科',
  default_question_count: 10,
  default_duration: 30
})

const skillInput = ref('')

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    loading.value = true
    try {
      const res = await getPosition(id)
      const data = res.data
      Object.assign(form, {
        name: data.name,
        code: data.code,
        category: data.category || '',
        description: data.description || '',
        requirements: '', // Note: API might not return this in detail view if separated? Assuming it's there or need separate fetch? The interface has it.
        required_skills: data.required_skills || [],
        difficulty_level: data.difficulty_level || 'mid',
        education_requirement: data.education_requirement || '本科',
        default_question_count: data.default_question_count,
        default_duration: data.default_duration
      })
    } catch (error) {
      console.error('Failed to load position:', error)
      router.push('/positions')
    } finally {
      loading.value = false
    }
  }
})

function generateCode() {
  if (form.name && !form.code && !isEdit.value) {
    form.code = form.name
      .toLowerCase()
      .replace(/[\u4e00-\u9fa5]/g, (match) => {
        // Very basic placeholder for pinyin or just random string if no pinyin lib
        return 'p' 
      })
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `pos-${Date.now().toString(36)}`
  }
}

function addSkill() {
  const skill = skillInput.value.trim()
  if (skill && !form.required_skills?.includes(skill)) {
    if (!form.required_skills) form.required_skills = []
    form.required_skills.push(skill)
    skillInput.value = ''
  }
}

function removeSkill(skill: string) {
  if (form.required_skills) {
    form.required_skills = form.required_skills.filter(s => s !== skill)
  }
}

async function handleSubmit() {
  if (!form.name || !form.code) return
  
  saving.value = true
  try {
    if (isEdit.value) {
      const updateData: PositionUpdate = { ...form }
      // Remove code from update as it's typically immutable
      delete (updateData as any).code
      await updatePosition(route.params.id as string, updateData)
    } else {
      await createPosition(form)
    }
    router.push('/positions')
  } catch (error: any) {
    console.error('Save failed:', error)
    alert(error.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 lg:p-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6 flex items-center gap-4">
        <button 
          @click="router.back()"
          class="p-2 rounded-lg hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h1 class="text-2xl font-bold">{{ isEdit ? '编辑岗位' : '创建新岗位' }}</h1>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        加载中...
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Info -->
        <section class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 class="text-lg font-semibold text-white border-b border-gray-800 pb-4">基本信息</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">岗位名称 <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                @blur="generateCode"
                type="text"
                required
                placeholder="例如：高级前端开发工程师"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">岗位编码 <span class="text-red-500">*</span></label>
              <input
                v-model="form.code"
                type="text"
                required
                :disabled="isEdit"
                placeholder="例如：senior-frontend-dev"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">分类</label>
              <select
                v-model="form.category"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              >
                <option value="">请选择</option>
                <option value="技术类">技术类</option>
                <option value="产品类">产品类</option>
                <option value="运营类">运营类</option>
                <option value="设计类">设计类</option>
                <option value="市场类">市场类</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">难度等级</label>
              <select
                v-model="form.difficulty_level"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              >
                <option value="junior">初级</option>
                <option value="mid">中级</option>
                <option value="senior">高级</option>
                <option value="expert">专家</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">学历要求</label>
              <select
                v-model="form.education_requirement"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              >
                <option value="不限">不限</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">岗位描述</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="简短的岗位职责描述..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors resize-none"
            ></textarea>
          </div>
        </section>

        <!-- Requirements & Skills -->
        <section class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 class="text-lg font-semibold text-white border-b border-gray-800 pb-4">要求与技能</h2>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">详细要求</label>
            <textarea
              v-model="form.requirements"
              rows="6"
              placeholder="详细的任职要求..."
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-300">必备技能</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="skill in form.required_skills"
                :key="skill"
                class="px-3 py-1 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 rounded-full text-sm flex items-center gap-2"
              >
                {{ skill }}
                <button @click="removeSkill(skill)" type="button" class="hover:text-white">&times;</button>
              </span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="skillInput"
                @keydown.enter.prevent="addSkill"
                type="text"
                placeholder="添加技能 (按回车)"
                class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
              <button
                @click="addSkill"
                type="button"
                class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-lg transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </section>

        <!-- Interview Config -->
        <section class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 class="text-lg font-semibold text-white border-b border-gray-800 pb-4">面试配置</h2>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">默认题目数量</label>
              <input
                v-model.number="form.default_question_count"
                type="number"
                min="1"
                max="50"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-300">默认时长 (分钟)</label>
              <input
                v-model.number="form.default_duration"
                type="number"
                min="5"
                max="180"
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4">
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
            {{ saving ? '保存中...' : '保存岗位' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
