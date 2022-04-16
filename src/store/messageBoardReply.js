// 留言板回复

import {copyObj} from "@/assets/js/utils";
import {request} from "@/assets/js/request";

const prefix = `MessageBoardReply`;

export default {
    namespaced: true,
    state: {
        replies: {},
        params: {
            page: 1,
            size: 10,
            start: undefined,
            end: undefined,
            condition: {
                keywords: [],
                logic: undefined,
            }
        },
    },
    mutations: {
        setParams(state, params) {
            state.params = copyObj(params);
        }
    },
    actions: {
        page: ({dispatch, commit, state}) => {
            const data = state.params
            return request({
                url: `/${prefix}/page`,
                data
            }).then(res => {
                state.replies[JSON.stringify(data)] = {
                    timestamp: new Date().getTime(),
                    data: res.data,
                }
                return res.data;
            });
        },
        getPage: ({dispatch, commit, state}) => {
            const data = state.params
            let now = new Date().getTime()
            let cache = state.replies[JSON.stringify(data)];

            if (cache && (now - cache.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache.data))
            } else {
                return dispatch("page");
            }
        },
        countByAuthorId: ({dispatch, commit, state}, {tid, start, end, limit}) => {
            return request({
                url: `/${prefix}/countByAuthorId`,
                params: {
                    tid, start, end, limit
                }
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}