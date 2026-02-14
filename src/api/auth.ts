import request from '@/utils/request'
import type {
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  User,
  TokenResponse,
  ApiResponse
} from '@/types/auth'

const AUTH_PREFIX = '/auth'

export function register(data: RegisterRequest): Promise<ApiResponse<User>> {
  return request.post(`${AUTH_PREFIX}/register`, data)
}

export function login(data: LoginRequest): Promise<ApiResponse<TokenResponse>> {
  return request.post(`${AUTH_PREFIX}/login`, data)
}

export function logout(): Promise<ApiResponse<null>> {
  return request.post(`${AUTH_PREFIX}/logout`)
}

export function getCurrentUser(): Promise<ApiResponse<User>> {
  return request.get(`${AUTH_PREFIX}/me`)
}

export function changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
  return request.post(`${AUTH_PREFIX}/password/change`, data)
}
