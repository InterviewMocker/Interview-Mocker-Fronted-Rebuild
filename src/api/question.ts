import request from '@/utils/request'
import type { ApiResponse } from '@/types/auth'
import type {
  QuestionBankCreate,
  QuestionBankUpdate,
  QuestionBankListParams,
  QuestionBank,
  CommunityReviewRequest,
  QuestionCreate,
  QuestionUpdate,
  QuestionListParams,
  QuestionBatchCreate,
  QuestionBatchCreateResponse,
  Question,
  QuestionDetail,
  PaginatedResponse,
  QuestionExtractionTask,
  ImportQuestionsRequest
} from '@/types/question'

const QUESTION_PREFIX = '/questions'

// ============ Question Bank API ============

export function listQuestionBanks(params?: QuestionBankListParams): Promise<ApiResponse<PaginatedResponse<QuestionBank>>> {
  return request.get(`${QUESTION_PREFIX}/banks`, { params })
}

export function createQuestionBank(data: QuestionBankCreate): Promise<ApiResponse<QuestionBank>> {
  return request.post(`${QUESTION_PREFIX}/banks`, data)
}

export function getQuestionBank(bankId: string): Promise<ApiResponse<QuestionBank>> {
  return request.get(`${QUESTION_PREFIX}/banks/${bankId}`)
}

export function updateQuestionBank(bankId: string, data: QuestionBankUpdate): Promise<ApiResponse<QuestionBank>> {
  return request.put(`${QUESTION_PREFIX}/banks/${bankId}`, data)
}

export function deleteQuestionBank(bankId: string): Promise<ApiResponse<null>> {
  return request.delete(`${QUESTION_PREFIX}/banks/${bankId}`)
}

// ============ Community API ============

export function listCommunityBanks(params?: Omit<QuestionBankListParams, 'status'>): Promise<ApiResponse<PaginatedResponse<QuestionBank>>> {
  return request.get(`${QUESTION_PREFIX}/community/banks`, { params })
}

export function applyCommunity(bankId: string): Promise<ApiResponse<QuestionBank>> {
  return request.post(`${QUESTION_PREFIX}/banks/${bankId}/apply-community`)
}

export function reviewCommunity(bankId: string, data: CommunityReviewRequest): Promise<ApiResponse<QuestionBank>> {
  return request.post(`${QUESTION_PREFIX}/banks/${bankId}/review-community`, data)
}

export function listPendingBanks(params?: { page?: number; page_size?: number }): Promise<ApiResponse<PaginatedResponse<QuestionBank>>> {
  return request.get(`${QUESTION_PREFIX}/community/pending`, { params })
}

export function copyCommunityBank(bankId: string): Promise<ApiResponse<QuestionBank>> {
  return request.post(`${QUESTION_PREFIX}/community/banks/${bankId}/copy`)
}

// ============ Question API ============

export function listQuestions(params?: QuestionListParams): Promise<ApiResponse<PaginatedResponse<Question>>> {
  return request.get(QUESTION_PREFIX, { params })
}

export function createQuestion(data: QuestionCreate): Promise<ApiResponse<Question>> {
  return request.post(QUESTION_PREFIX, data)
}

export function batchCreateQuestions(data: QuestionBatchCreate): Promise<ApiResponse<QuestionBatchCreateResponse>> {
  return request.post(`${QUESTION_PREFIX}/batch`, data)
}

export function getQuestion(questionId: string): Promise<ApiResponse<QuestionDetail>> {
  return request.get(`${QUESTION_PREFIX}/${questionId}`)
}

export function updateQuestion(questionId: string, data: QuestionUpdate): Promise<ApiResponse<Question>> {
  return request.put(`${QUESTION_PREFIX}/${questionId}`, data)
}

export function deleteQuestion(questionId: string): Promise<ApiResponse<null>> {
  return request.delete(`${QUESTION_PREFIX}/${questionId}`)
}

// ============ Extraction API ============

/**
 * Upload file and extract questions (SSE)
 * Note: This returns the raw response for SSE handling, not a Promise<ApiResponse>
 */
export function extractQuestions(formData: FormData): Promise<Response> {
  // We use fetch directly for SSE to get the readable stream
  const token = localStorage.getItem('token') || ''
  return fetch(`/api/v1${QUESTION_PREFIX}/extract`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
}

export function getExtractionTask(taskId: string): Promise<ApiResponse<QuestionExtractionTask>> {
  return request.get(`${QUESTION_PREFIX}/extract/tasks/${taskId}`)
}

export function listExtractionTasks(limit: number = 20): Promise<ApiResponse<QuestionExtractionTask[]>> {
  return request.get(`${QUESTION_PREFIX}/extract/tasks`, { params: { limit } })
}

export function importExtractedQuestions(data: ImportQuestionsRequest): Promise<ApiResponse<Question[]>> {
  return request.post(`${QUESTION_PREFIX}/extract/import`, data)
}
