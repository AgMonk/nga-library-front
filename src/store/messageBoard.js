//留言板

import {request} from "@/assets/js/request";

const prefix = `MessageBoard`;

export default {
    namespaced: true,
    state: {
        messageBoard: [],
        timestamp: 0,
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

        findAll: ({dispatch, commit, state}) => request({
            url: `/${prefix}/findAll`,
        }).then(res => {
            state.messageBoard = res.data;
            state.timestamp = new Date().getTime();
            return res.data;
        }),
        getAll: ({dispatch, commit, state}) => {
            let now = new Date().getTime()
            if (state.timestamp && (now - state.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(state.messageBoard))
            } else {
                return dispatch("findAll")
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}