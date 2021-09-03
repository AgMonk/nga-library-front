// 主题列表

import {request} from "@/assets/js/request";

const prefix = `NgaThread`;

export default {
    namespaced: true,
    state: {
        threads: {},
    },
    mutations: {},
    actions: {
        page: ({dispatch, commit, state}, data) => {
            return request({
                url: `/${prefix}/page`,
                data
            }).then(res => {
                state.threads[JSON.stringify(data)] = {
                    timestamp: new Date().getTime(),
                    data: res.data,
                }
                return res.data;
            });
        },
        getPage: ({dispatch, commit, state}, data) => {
            let now = new Date().getTime()
            let cache = state.threads[JSON.stringify(data)];

            if (cache && (now - cache.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache.data))
            } else {
                return dispatch("page", data);
            }
        },
        setThreadType: ({dispatch, commit, state}, {typeUuid, tid, params}) => {
            return request({
                url: `/${prefix}/setThreadType`,
                params: {typeUuid, tid}
            }).then(() => {
                return dispatch("page", params)
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}