// 图书馆
import {request} from "@/assets/js/request";

const prefix = `NgaLibrary`;

export default {
    namespaced: true,
    state: {
        libraries:[],
        timestamp:0,
        currentLibrary:"0",
    },
    mutations: {},
    actions: {
        add: ({dispatch, state}, data) => request({
            url: `/${prefix}/add`,
            data
        }).then(() => dispatch("findAll")),

        update: ({dispatch, state}, data) => request({
            url: `/${prefix}/update`,
            data
        }).then(() => dispatch("findAll")),

        del: ({dispatch, commit, state}, uuid) => request({
            url: `/${prefix}/del`,
            params: {uuid}
        }).then(() => dispatch("findAll")),

        exportToPid: ({dispatch, state}, {fid, pid}) => request({
            url: `/${prefix}/export`,
            params: {fid, pid},
        }),

        findAll: ({dispatch, commit, state}) => request({
            url: `/${prefix}/findAll`,
        }).then(res => {
            state.libraries = res.data;
            state.libraries.forEach(i => i.fid = i.fid.toString())
            state.timestamp = new Date().getTime();
            return res.data;
        }),
        getAll: ({dispatch, commit, state}) => {
            let now = new Date().getTime()
            if (state.timestamp && (now - state.timestamp) < 60 * 1000) {
                state.currentLibrary = state.currentLibrary === "0" ? state.libraries[0].fid : state.currentLibrary;
                return new Promise(resolve => resolve(state.libraries))
            } else {
                return dispatch("findAll").then(res => {
                    state.currentLibrary = state.currentLibrary === "0" ? res[0].fid : state.currentLibrary;
                    return res;
                });
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}