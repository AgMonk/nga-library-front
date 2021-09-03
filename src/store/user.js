// 用户
// noinspection JSUnresolvedVariable

import {request} from "@/assets/js/request";
import {ElMessage} from "element-plus";

export default {
    namespaced: true,
    state: {
        user: undefined,
        timestamp: 0,
    },
    mutations: {},
    actions: {
        login: ({dispatch, commit, state}, params) => request({
            url: "/User/login",
            params
        }).then(res => {
            state.user = res.data;
            ElMessage.success(res.message)
        }),
        logout: ({dispatch, commit, state}) => request({
            url: "/User/logout"
        }).then(res => {
            state.user =undefined;
            ElMessage.success(res.message)
        }),
        getStatus: ({dispatch, commit, state}) => {
            let now = new Date().getTime()
            if (state.user && (now - state.timestamp) < 30 * 1000) {
                return new Promise(resolve => resolve(true))
            } else {
                return request({
                    url: "/User/status",
                }).then(res => {
                    state.user = res.data;
                    state.timestamp = res.timestamp
                    return true;
                }).catch((err) => {
                    state.user = undefined;
                    state.timestamp = now
                })
            }
        },
        method({dispatch, commit, state}) {

        },

    },
    getters: {
        isPermitted: (state) => (permission) => {
            if (!state.user || !state.user.roles){
                return false;
            }
            const [namespace, action, target] = permission.split(":");
            const permissions = state.user.roles.flatMap(i => i.permissions).map(i => `${i.namespace}:${i.action}:${i.target}`)

            if (permissions.includes(`${namespace}:${action}:${target}`)
                || permissions.includes(`*:${action}:${target}`)
                || permissions.includes(`*:*:${target}`)
                || permissions.includes(`*:${action}:*}`)
                || permissions.includes(`${namespace}:*:${target}`)
                || permissions.includes(`${namespace}:*:*`)
                || permissions.includes(`${namespace}:${action}:*`)
                || permissions.includes(`*:*:*`)
            ) {
                return true;
            }
            return  false;
        }
    },
}
