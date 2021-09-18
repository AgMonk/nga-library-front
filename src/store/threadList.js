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
            `灰色普通`,
            `灰色加粗`,
            `红色普通`,
            `红色加粗`,
            `绿色普通`,
            `绿色加粗`,
            `蓝色普通`,
            `蓝色加粗`,
            `棕色普通`,
            `棕色加粗`,
        ],
    },
    mutations: {
        setParams(state, {key, params}) {
            state.params[key] = copyObj(params);
        }
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