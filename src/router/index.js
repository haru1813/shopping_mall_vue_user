import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      //component: () => import('@/views/index.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/index.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
    },
    {
      path: '/product_list/:id',
      name: 'product_list',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/product/product_list.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/product_search',
      name: 'product_search',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/product/product_search.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/join1',
      name: 'join1',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/join/join1.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/join2',
      name: 'join2',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/join/join2.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
  ],
})

export default router
