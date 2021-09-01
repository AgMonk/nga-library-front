import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

export const routes = [
  {
    path:`/`,
    redirect:`/home`
  },
  {
    path: '/home',
    name: '图书馆',
    component: Home
  },
  {
    path: `/me`,
    name: `我的`,
    component: ()=>import("../views/Me")
  },
  {
    path:`/manage`,
    name:`管理`,
    component: ()=>import("../views/Me"),
    children:[

    ]
  }
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

