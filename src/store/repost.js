// 转发图片
import {request} from "@/assets/js/request";
import {copyObj} from "@/assets/js/utils";

const prefix = `Repost`;


export default {
    namespaced: true,
    state: {
        reposts: {},
        params: {},
    },
    mutations: {
        setParams(state, params) {
            state.params = copyObj(params);
        }
    },
    actions: {
        add: ({dispatch, state}, data) => request({
            url: `/${prefix}/add`,
            data
        }).then(res => dispatch("get", res.data)),

        update: ({dispatch, state}, data) => request({
            url: `/${prefix}/update`,
            data
        }).then(() => dispatch("get", data.uuid)),

        del: ({dispatch, commit, state}, uuid) => request({
            url: `/${prefix}/del`,
            params: {uuid}
        }).then(() => dispatch("page")),

        get: ({dispatch, commit, state}, uuid) => request({
            url: `/${prefix}/get`,
            params: {uuid}
        }).then(res => {
            const data = res.data;
            data.time = (data.time).toString();
            data.executeTime = data.executeTime ? (data.executeTime).toString() : undefined;
            return data;
        }),
        deleteFile: ({dispatch, commit, state}, {uuid, fileName}) => request({
            url: `/${prefix}/deleteFile`,
            data: {uuid, fileName},
        }),
        getNextTime: ({dispatch, commit, state}) => request({
            url: `/${prefix}/getNextTime`,
        }),
        page: ({dispatch, commit, state}) => {
            const data = state.params
            return request({
                url: `/${prefix}/page`,
                data
            }).then(res => {
                state.reposts[JSON.stringify(data)] = {
                    timestamp: new Date().getTime(),
                    data: res.data,
                }
                return res.data;
            });
        },
        getPage: ({dispatch, commit, state}, params) => {
            if (params) {
                commit("setParams", params)
            }
            const data = state.params
            let now = new Date().getTime()
            let cache = state.reposts[JSON.stringify(data)];

            if (cache && (now - cache.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache.data))
            } else {
                return dispatch("page");
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}