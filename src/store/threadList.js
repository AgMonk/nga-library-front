// 主题列表

import {request} from "@/assets/js/request";
import {copyObj} from "@/assets/js/utils";

const prefix = `NgaThread`;

export default {
    namespaced: true,
    state: {
        threads: {},
        params: {},
        titleColor: [
            `灰色`,
            `红色`,
            `绿色`,
            `蓝色`,
            `棕色`,
        ],
    },
    mutations: {
        setParams(state, {key, params}) {
            state.params[key] = copyObj(params);
        },
        clearCache(state) {
            state.threads = {}
        },
    },
    actions: {
        page: ({dispatch, commit, state}, fid) => {
            const data = state.params[fid]
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
        getPage: ({dispatch, commit, state}, fid) => {
            const data = state.params[fid]
            let now = new Date().getTime()
            let cache = state.threads[JSON.stringify(data)];

            if (cache && (now - cache.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache.data))
            } else {
                return dispatch("page", fid);
            }
        },
        setThreadType: ({dispatch, commit, state}, {typeUuid, tid, fid}) => {
            return request({
                url: `/${prefix}/setThreadType`,
                params: {typeUuid, tid}
            }).then(() => {
                return dispatch("page", fid)
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}