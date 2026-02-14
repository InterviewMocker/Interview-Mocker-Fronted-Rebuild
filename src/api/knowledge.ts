import request from '@/utils/request'
import type { ApiResponse } from '@/types/auth'
import type {
  KnowledgeDocument,
  KnowledgeDocumentDetail,
  KnowledgeDocumentCreate,
  KnowledgeDocumentUpdate,
  KnowledgeDocumentListParams
} from '@/types/knowledge'

const KNOWLEDGE_PREFIX = '/knowledge/documents'

export function listKnowledgeDocuments(params: KnowledgeDocumentListParams): Promise<ApiResponse<{ items: KnowledgeDocument[], total: number }>> {
  return request.get(KNOWLEDGE_PREFIX, { params })
}

export function createKnowledgeDocument(data: KnowledgeDocumentCreate): Promise<ApiResponse<KnowledgeDocument>> {
  return request.post(KNOWLEDGE_PREFIX, data)
}

export function getKnowledgeDocument(id: string): Promise<ApiResponse<KnowledgeDocumentDetail>> {
  return request.get(`${KNOWLEDGE_PREFIX}/${id}`)
}

export function updateKnowledgeDocument(id: string, data: KnowledgeDocumentUpdate): Promise<ApiResponse<KnowledgeDocument>> {
  return request.put(`${KNOWLEDGE_PREFIX}/${id}`, data)
}

export function deleteKnowledgeDocument(id: string): Promise<ApiResponse<null>> {
  return request.delete(`${KNOWLEDGE_PREFIX}/${id}`)
}
