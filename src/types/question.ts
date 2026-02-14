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

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
