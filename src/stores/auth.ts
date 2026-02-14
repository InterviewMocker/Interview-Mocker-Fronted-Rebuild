import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/auth'
import type { User, LoginRequest, TokenResponse } from '@/types/auth'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_info'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const user = ref<User | null>(
    localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)!) : null
  )

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const username = computed(() => user.value?.username || '')

  // Actions
  async function login(loginData: LoginRequest): Promise<TokenResponse> {
    const response = await apiLogin(loginData)
    const data = response.data

    token.value = data.access_token
    refreshToken.value = data.refresh_token
    user.value = data.user

    localStorage.setItem(TOKEN_KEY, data.access_token)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))

    return data
  }

  async function logout() {
    try {
      if (token.value) {
        await apiLogout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      refreshToken.value = null
      user.value = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  async function fetchCurrentUser() {
    try {
      const response = await getCurrentUser()
      user.value = response.data
      localStorage.setItem(USER_KEY, JSON.stringify(response.data))
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  }

  return {
    token,
    refreshToken,
    user,
    isLoggedIn,
    isAdmin,
    username,
    login,
    logout,
    fetchCurrentUser
  }
})
