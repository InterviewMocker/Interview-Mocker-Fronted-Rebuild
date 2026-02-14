import request from '@/utils/request'
import type { ApiResponse } from '@/types/auth'
import type {
  QuestionBankCreate,
  QuestionBankUpdate,
  QuestionBankListParams,
  QuestionBank,
  QuestionCreate,
  QuestionUpdate,
  QuestionListParams,
  Question,
  QuestionDetail,
  PaginatedResponse
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

// ============ Question API ============

export function listQuestions(params?: QuestionListParams): Promise<ApiResponse<PaginatedResponse<Question>>> {
  return request.get(QUESTION_PREFIX, { params })
}

export function createQuestion(data: QuestionCreate): Promise<ApiResponse<Question>> {
  return request.post(QUESTION_PREFIX, data)
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
