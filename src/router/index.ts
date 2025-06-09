import DefaultLayout from '@/layout/DefaultLayout.vue'
import LoginView from '@/views/LoginView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { PATH_PAGE_HOME, PATH_PAGE_LOGIN, PATH_PAGE_USERS } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Deixei o routes assim para conseguir ver a HomeView e Desenvolver a Sidebar
    // É uma ação temporária
    {
      path: '/',
      name: 'default',
      component: DefaultLayout,
      children: [
        {
          path: PATH_PAGE_HOME,
          name: 'home',
          component: HomeView,
        },
        {
          path: PATH_PAGE_USERS,
          name: 'usuarios',
          component: UsuariosView,
        },
      ],
    },
    {
      path: PATH_PAGE_LOGIN,
      name: 'login',
      component: LoginView,
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //  // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //  // which is lazy-loaded when the route is visited.
    //  component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
