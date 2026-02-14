export type DifficultyLevel = 'junior' | 'mid' | 'senior' | 'expert'
export type EducationRequirement = '不限' | '大专' | '本科' | '硕士' | '博士'

export interface PositionCreate {
  name: string
  code: string
  category?: string
  description?: string
  requirements?: string
  required_skills?: string[]
  skill_weights?: Record<string, number>
  difficulty_level?: DifficultyLevel
  education_requirement?: EducationRequirement
  default_question_count?: number
  default_duration?: number
}

export interface PositionUpdate {
  name?: string
  category?: string
  description?: string
  requirements?: string
  required_skills?: string[]
  skill_weights?: Record<string, number>
  difficulty_level?: DifficultyLevel
  education_requirement?: EducationRequirement
  default_question_count?: number
  default_duration?: number
  status?: 'active' | 'inactive'
}

export interface Position {
  id: string
  name: string
  code: string
  category: string | null
  description: string | null
  required_skills: string[] | null
  difficulty_level: DifficultyLevel | null
  education_requirement: EducationRequirement | null
  default_question_count: number
  default_duration: number
  status: string
  created_by: string | null
  created_at: string
}

export interface PositionListParams {
  page?: number
  page_size?: number
  category?: string
  status?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
