import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from '../views/IndexPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'indexpage',
      component: IndexPage,
    },
    {
      path:'/levelPage',
      name:'levelpage',
      component:()=>import('../views/LevelsPage.vue'),
    },
    {
      path:'/playgroundpage',
      name:'playgroundpage',
      component:()=>import('../views/PlaygroundPage.vue'),
    },
    {
      path:'/learn/:levelKey',
      name:'learnpage',
      component:()=>import('../views/LearnPage.vue'),
    },
    {
      path:'/history',
      name:'history',
      component:()=>import('../views/HistoryPage.vue'),
    },
  ],
})

export default router
