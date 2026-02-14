export interface RegisterRequest {
  username: string
  password: string
  email?: string
  real_name?: string
  school?: string
  major?: string
}

export interface LoginRequest {
  username: string
  password: string
  device_type?: 'web' | 'mobile' | 'desktop'
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface User {
  id: string
  username: string
  email: string | null
  real_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  status: 'active' | 'inactive' | 'banned'
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface UserProfile {
  id: string
  user_id: string
  target_positions: string[] | null
  skill_tags: Record<string, any> | null
  technical_score: number
  expression_score: number
  logic_score: number
  comprehensive_score: number
  total_interviews: number
  total_questions_answered: number
}
