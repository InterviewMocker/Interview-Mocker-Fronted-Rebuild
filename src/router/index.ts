import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          meta: { requiresAuth: false }
        },
        // Knowledge Base Routes
        {
          path: 'knowledge',
          name: 'knowledge-list',
          component: () => import('@/views/knowledge/KnowledgeList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'knowledge/create',
          name: 'knowledge-create',
          component: () => import('@/views/knowledge/KnowledgeEdit.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'knowledge/:id',
          name: 'knowledge-detail',
          component: () => import('@/views/knowledge/KnowledgeDetail.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'knowledge/:id/edit',
          name: 'knowledge-edit',
          component: () => import('@/views/knowledge/KnowledgeEdit.vue'),
          meta: { requiresAuth: true }
        },
        // Question Bank Routes
        {
          path: 'questions/banks',
          name: 'question-bank-list',
          component: () => import('@/views/question/QuestionBankList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'questions/banks/create',
          name: 'question-bank-create',
          component: () => import('@/views/question/QuestionBankEdit.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'questions/banks/:id',
          name: 'question-bank-detail',
          component: () => import('@/views/question/QuestionBankDetail.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'questions/banks/:id/edit',
          name: 'question-bank-edit',
          component: () => import('@/views/question/QuestionBankEdit.vue'),
          meta: { requiresAuth: true }
        },
        // Question Routes
        {
          path: 'questions/create',
          name: 'question-create',
          component: () => import('@/views/question/QuestionEdit.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'questions/:id/edit',
          name: 'question-edit',
          component: () => import('@/views/question/QuestionEdit.vue'),
          meta: { requiresAuth: true }
        },
        // Position Routes
        {
          path: 'positions',
          name: 'position-list',
          component: () => import('@/views/position/PositionList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'positions/create',
          name: 'position-create',
          component: () => import('@/views/position/PositionEdit.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'positions/:id',
          name: 'position-detail',
          component: () => import('@/views/position/PositionDetail.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'positions/:id/edit',
          name: 'position-edit',
          component: () => import('@/views/position/PositionEdit.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state from local storage if needed
  // (Pinia store initializes state from localStorage automatically based on definition)

  const isLoggedIn = authStore.isLoggedIn

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && isLoggedIn) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
