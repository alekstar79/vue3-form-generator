import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Домашняя страница - Form Generator'
    }
  },
  {
    path: '/basic-form',
    name: 'basic-form',
    component: () => import('@/views/BasicFormDemo.vue'),
    meta: {
      title: 'Базовая форма - Form Generator'
    }
  },
  {
    path: '/complex-form',
    name: 'complex-form',
    component: () => import('@/views/ComplexFormDemo.vue'),
    meta: {
      title: 'Сложная форма - Form Generator'
    }
  },
  {
    path: '/slot-customization',
    name: 'slot-customization',
    component: () => import('@/views/SlotCustomizationDemo.vue'),
    meta: {
      title: 'Кастомизация слотами - Form Generator'
    }
  },
  {
    path: '/advanced',
    name: 'advanced',
    component: () => import('@/views/AdvancedDemo.vue'),
    meta: {
      title: 'Продвинутые примеры - Form Generator'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'Form Generator'
})

export default router
