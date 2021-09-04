// 主题分类条件

import {request} from "@/assets/js/request";

const prefix = `ThreadTypeCondition`;

export default {
    namespaced: true,
    state: {
        conditions:{},
    },
    mutations: {},
    actions: {
        add: ({dispatch, state}, {data,params}) => request({
            url: `/${prefix}/add`,
            data
        }).then(() => dispatch("page", params)),

        update: ({dispatch, state}, {data,params}) => request({
            url: `/${prefix}/update`,
            data
        }).then(() => dispatch("page", params)),

        del: ({dispatch, commit, state}, {uuid,params}) => request({
            url: `/${prefix}/del`,
            params: {uuid}
        }).then(() => dispatch("page", params)),

        page: ({dispatch, commit, state}, data) => {
            return request({
                url: `/${prefix}/page`,
                data
            }).then(res => {
                state.conditions[JSON.stringify(data)] = {
                    timestamp: new Date().getTime(),
                    data: res.data,
                }
                return res.data;
            });
        },
        getPage: ({dispatch, commit, state}, data) => {
            let now = new Date().getTime()
            let cache = state.conditions[JSON.stringify(data)];

            if (cache && (now - cache.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache.data))
            } else {
                return dispatch("page", data);
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}