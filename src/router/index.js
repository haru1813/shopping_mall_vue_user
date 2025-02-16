import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      //component: () => import('@/views/index.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/NotFound.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
    },
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
      path: '/product_detail',
      name: 'product_detail',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/product/product_detail.vue'),
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
    {
      path: '/join3',
      name: 'join3',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/join/join3.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/join4',
      name: 'join4',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/join/join4.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/login',
      name: 'login',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/login/login.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/id_find',
      name: 'id_find',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/find/id_find.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/pw_find',
      name: 'pw_find',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/find/pw_find.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/change1',
      name: 'change1',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/user/change1.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/change2',
      name: 'change2',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/user/change2.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/basket',
      name: 'basket',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/user/basket.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/order',
      name: 'order',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/user/order.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/buy',
      name: 'buy',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/buy/buy.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
    {
      path: '/buy_complete',
      name: 'buy_complete',
      //component: () => import('@/views/pages/product/product_list.vue'),
      components: {
        header: () => import('@/views/layout/HeadView.vue'),
        nav: () => import('@/views/layout/NavView.vue'),
        default: () => import('@/views/pages/buy/buy_complete.vue'),
        footer: () => import('@/views/layout/FooterView.vue')
      },
      props: true
    },
  ],
})

export default router
