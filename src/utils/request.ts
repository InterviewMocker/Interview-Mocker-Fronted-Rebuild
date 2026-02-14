import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Use environment variables for base URL
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_PREFIX || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError<{ message: string; detail?: any }>) => {
    const authStore = useAuthStore()
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Token expired or invalid
          authStore.logout()
          router.push('/login')
          break
        case 403:
          console.error('Permission denied:', data.message)
          break
        case 422:
          console.error('Validation error:', data.detail)
          break
        default:
          console.error('Request error:', data.message)
      }
    } else if (error.request) {
      console.error('Network error, please check your connection')
    }
    
    return Promise.reject(error)
  }
)

export default request
