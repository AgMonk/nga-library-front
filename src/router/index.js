import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Manage from "@/views/Manage";
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
    component: Manage,
    children:[
      { path:`threadType`,
        name:`主题类型`,
        component: ()=>import("../views/manage/ThreadType"),
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

