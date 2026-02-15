<script setup lang="ts">
import { computed } from 'vue'
import type { QuestionBank } from '@/types/question'
import { useAuthStore } from '@/stores/auth'
import { 
  FolderIcon, 
  PencilIcon, 
  TrashIcon,
  GlobeAltIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  bank: QuestionBank
  isCommunityView?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'apply', id: string): void
  (e: 'copy', id: string): void
}>()

const authStore = useAuthStore()
const isOwner = computed(() => props.bank.created_by === authStore.user?.id)

// Status helpers
const isCommunityUploaded = computed(() => props.bank.community_status === 'approved')
const isCommunityPending = computed(() => props.bank.community_status === 'pending')
const isCommunityRejected = computed(() => props.bank.community_status === 'rejected')

// Highlight logic
const shouldHighlight = computed(() => {
  if (props.isCommunityView) {
    return isOwner.value // Highlight my uploads in community view
  } else {
    return isCommunityUploaded.value // Highlight uploaded banks in my view
  }
})

const highlightClass = computed(() => {
  if (shouldHighlight.value) {
    return 'ring-1 ring-primary-500/50 bg-primary-900/10'
  }
  return ''
})

</script>

<template>
  <div
    @click="emit('click', bank.id)"
    class="glass-card p-5 cursor-pointer flex flex-col h-full group hover:-translate-y-1 relative transition-all duration-300"
    :class="highlightClass"
  >
    <!-- Highlight Badge -->
    <div v-if="shouldHighlight" class="absolute -top-2 -right-2 z-10">
      <span class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-primary-500 text-white shadow-lg shadow-primary-500/30">
        <template v-if="isCommunityView">我的上传</template>
        <template v-else>已上架社区</template>
      </span>
    </div>

    <div class="flex flex-col h-full">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span 
            v-if="bank.category"
            class="px-2 py-0.5 rounded text-xs font-medium bg-primary-900/30 text-primary-400 border border-primary-800/50"
          >
            {{ bank.category }}
          </span>
          
          <!-- Status Badges -->
          <template v-if="!isCommunityView">
            <span 
              v-if="isCommunityPending"
              class="px-2 py-0.5 rounded text-xs font-medium bg-warning-900/30 text-warning-400 border border-warning-800/50 flex items-center gap-1"
            >
              <ClockIcon class="w-3 h-3" />
              审核中
            </span>
            <span 
              v-else-if="isCommunityRejected"
              class="px-2 py-0.5 rounded text-xs font-medium bg-error-900/30 text-error-400 border border-error-800/50 flex items-center gap-1"
            >
              <XCircleIcon class="w-3 h-3" />
              已拒绝
            </span>
            <span 
              v-else-if="bank.status === 'active'"
              class="px-2 py-0.5 rounded text-xs font-medium bg-success-900/30 text-success-400 border border-success-800/50"
            >
              活跃
            </span>
            <span 
              v-else
              class="px-2 py-0.5 rounded text-xs font-medium bg-dark-800 text-gray-400 border border-gray-700"
            >
              停用
            </span>
          </template>
        </div>
        <FolderIcon class="w-6 h-6 text-gray-500 group-hover:opacity-0 transition-opacity" />
      </div>

      <h3 class="text-lg font-semibold text-gray-100 group-hover:text-primary-400 transition-colors mb-2">
        {{ bank.name }}
      </h3>

      <div class="text-xs text-gray-500 mb-2 flex items-center gap-2">
        <span v-if="bank.creator_username">
          创建人: {{ bank.creator_username }}
        </span>
        <span v-if="bank.created_at">
          {{ new Date(bank.created_at).toLocaleDateString() }}
        </span>
      </div>

      <p class="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
        {{ bank.description || '暂无描述' }}
      </p>

      <div v-if="bank.tags?.length" class="flex flex-wrap gap-2 mt-auto">
        <span 
          v-for="tag in bank.tags.slice(0, 3)" 
          :key="tag"
          class="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-dark-800/50 text-gray-400 border border-white/10"
        >
          {{ tag }}
        </span>
        <span v-if="bank.tags.length > 3" class="text-xs text-gray-500 self-center">
          +{{ bank.tags.length - 3 }}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <!-- Community View Actions -->
      <template v-if="isCommunityView">
        <button 
          @click.stop="emit('copy', bank.id)"
          class="p-1.5 rounded-lg bg-primary-900/20 hover:bg-primary-900/40 text-primary-400 hover:text-primary-300 border border-primary-900/30 transition-colors"
          title="复制到我的题库"
        >
          <DocumentDuplicateIcon class="w-4 h-4" />
        </button>
      </template>

      <!-- My Banks View Actions -->
      <template v-else>
        <!-- Apply to Community -->
        <button 
          v-if="!isCommunityUploaded && !isCommunityPending"
          @click.stop="emit('apply', bank.id)"
          class="p-1.5 rounded-lg bg-accent-900/20 hover:bg-accent-900/40 text-accent-400 hover:text-accent-300 border border-accent-900/30 transition-colors"
          title="发布到社区"
        >
          <GlobeAltIcon class="w-4 h-4" />
        </button>
        
        <button 
          @click.stop="emit('edit', bank.id)"
          class="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white border border-white/10 transition-colors"
          title="编辑"
        >
          <PencilIcon class="w-4 h-4" />
        </button>
        <button 
          @click.stop="emit('delete', bank.id)"
          class="p-1.5 rounded-lg bg-error-900/20 hover:bg-error-900/40 text-error-400 hover:text-error-300 border border-error-900/30 transition-colors"
          title="删除"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </template>
    </div>
  </div>
</template>
