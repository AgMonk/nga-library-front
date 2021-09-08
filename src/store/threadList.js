// 主题列表

import {request} from "@/assets/js/request";

const prefix = `NgaThread`;

export default {
    namespaced: true,
    state: {
        threads: {},
        params: {
            page: 1,
            size: 10,
            condition: {
                fid: 0,
                threadTypeUuid: "*",
                includeChildren: true,
            }
        },
    },
    mutations: {
        setParams(state, params) {
            state.params = params;
        }
    },
    actions: {
        page: ({dispatch, commit, state}) => {
            const data = state.params
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
        getPage: ({dispatch, commit, state}) => {
            const data = state.params
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