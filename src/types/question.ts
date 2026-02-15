export interface QuestionBankCreate {
  name: string
  description?: string
  category?: string
  tags?: string[]
}

export interface QuestionBankUpdate {
  name?: string
  description?: string
  category?: string
  tags?: string[]
  status?: 'active' | 'inactive'
}

export interface QuestionBank {
  id: string
  name: string
  description: string | null
  category: string | null
  tags: string[] | null
  status: string
  created_by: string | null
  created_at: string
}

export interface QuestionBankListParams {
  page?: number
  page_size?: number
  category?: string
  status?: string
}

export type QuestionType = 'technical' | 'scenario' | 'algorithm' | 'behavioral'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface QuestionCreate {
  bank_id: string
  title: string
  content: string
  type: QuestionType
  category?: string
  difficulty: Difficulty
  difficulty_score?: number
  tags?: string[]
  reference_answer?: string
  answer_key_points?: string[]
  scoring_criteria?: Record<string, number>
}

export interface QuestionBatchCreateItem {
  title: string
  content: string
  type: QuestionType
  category?: string
  difficulty: Difficulty
  difficulty_score?: number
  tags?: string[]
  reference_answer?: string
  answer_key_points?: string[]
  scoring_criteria?: Record<string, number>
}

export interface QuestionBatchCreate {
  bank_id: string
  questions: QuestionBatchCreateItem[]
}

export interface QuestionBatchCreateResponse {
  total: number
  questions: Question[]
}

export interface QuestionUpdate {
  title?: string
  content?: string
  type?: QuestionType
  category?: string
  difficulty?: Difficulty
  difficulty_score?: number
  tags?: string[]
  reference_answer?: string
  answer_key_points?: string[]
  scoring_criteria?: Record<string, number>
  status?: 'active' | 'inactive'
}

export interface Question {
  id: string
  bank_id: string
  title: string
  content: string
  type: QuestionType
  category: string | null
  difficulty: Difficulty
  difficulty_score: number | null
  tags: string[] | null
  usage_count: number
  status: string
  created_at: string
}

export interface QuestionDetail extends Question {
  reference_answer: string | null
  answer_key_points: string[] | null
  scoring_criteria: Record<string, number> | null
}

export interface QuestionListParams {
  page?: number
  page_size?: number
  bank_id?: string
  type?: QuestionType
  category?: string
  difficulty?: Difficulty
  status?: string
}

// ============ Extraction Types ============

export interface QuestionExtractionTask {
  task_id: string
  filename: string
  bank_id: string
  status: 'processing' | 'completed' | 'failed'
  total_chunks: number
  processed_chunks: number
  progress: number
  total_questions?: number
  questions?: QuestionBatchCreateItem[] // Uses the creation item type as they are not yet saved
  error?: string | null
  created_at: number
  updated_at: number
}

export interface QuestionExtractionEvent {
  task_id: string
  chunk?: number
  total_chunks?: number
  progress?: number
  new_questions?: QuestionBatchCreateItem[]
  total_questions_so_far?: number
  total_questions?: number
  questions?: QuestionBatchCreateItem[]
  message?: string
  partial_questions?: QuestionBatchCreateItem[]
}

export interface ImportQuestionsRequest {
  task_id: string
  bank_id: string
  question_indices?: number[]
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
