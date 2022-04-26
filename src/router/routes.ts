import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }]
  },
  {
    path: '/welcome',
    component: () => import('layouts/EmptyLayout.vue'),
    meta: { authRequired: true },
    children: [{ path: '', component: () => import('pages/WelcomePage.vue') }]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { authRequired: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'u/:id', component: () => import('pages/UserPage.vue') },
      { path: 'b/:id', component: () => import('pages/BoltPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
