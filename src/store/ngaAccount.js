// NGA账号（作为图书馆管理员）

import {request} from "@/assets/js/request";

const prefix = `NgaAccount`;

export default {
    namespaced: true,
    state: {
        accounts: [],
        timestamp: 0,
    },
    mutations: {},
    actions: {
        add: ({dispatch, state}, {cookie}) => request({
            url: `/${prefix}/add`,
            data: {cookie}
        }).then(() => dispatch("findAll")),

        del: ({dispatch, commit, state}, uuid) => request({
            url: `/${prefix}/del`,
            params: {uuid}
        }).then(() => dispatch("findAll")),

        findAll: ({state}) => {
            return request({
                url: `/${prefix}/findAll`,
            }).then(res => {
                state.accounts = res.data;
                state.timestamp = new Date().getTime();
                return res.data;
            });
        },
        getAll: ({dispatch, state}) => {
            let now = new Date().getTime()
            let cache = state.accounts;

            if (cache && (now - state.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache))
            } else {
                return dispatch("findAll");
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}