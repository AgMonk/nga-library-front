import {createRouter, createWebHistory} from 'vue-router'

export const routes = [
    {
        path: `/`,
        redirect: `/home`
    },
    {
        path: '/home',
        name: '图书馆',
        component: () => import("../views/Home")
    },
    {
        path: `/me`,
        name: `我的`,
        component: () => import("../views/Me")
    },
    {
        path: `/manage`,
        name: `管理`,
        component: () => import("../views/Manage"),
        children: [
            {
                path: `threadType`,
                name: `主题类型`,
                component: () => import("../views/manage/ThreadType"),
                permission: `主题类型:修改:*`,
            },
            {
                path: `threadTypeCondition`,
                name: `分类条件`,
                component: () => import("../views/manage/ThreadTypeCondition"),
                permission: `主题类型:修改:*`,
            },
            {
                path: `ngaAccount`,
                name: `NGA账号`,
                component: () => import("../views/manage/NgaAccount"),
                permission: `NGA账号:添加:*`,
            },
            {
                path: `library`,
                name: `图书馆管理`,
                component: () => import("../views/manage/NgaLibrary"),
                permission: `图书馆:添加:*`,
            },
            {
                path: `forum`,
                name: `版面管理`,
                component: () => import("../views/manage/Forum"),
                permission: `版面:添加:*`,
            },
            {
                path: `repost`,
                name: `转发管理`,
                component: () => import("../views/manage/Repost"),
                permission: `转发:查询:*`,
            },
            {
                path: `messageBoard`,
                name: `留言板管理`,
                component: () => import("../views/manage/MessageBoard"),
                permission: `留言板:查询:*`,
            },
            {
                path: `messageBoardReply`,
                name: `留言板回复`,
                component: () => import("../views/manage/MessageBoardReply"),
                permission: `留言板:查询:*`,
            },

        ]
    }
]

export const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

