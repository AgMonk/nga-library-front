// 主题类型

import {request} from "@/assets/js/request";

const prefix = `ThreadType`;

export default {
    namespaced: true,
    state: {
        types: {},
        params: {
            uuid: undefined,
            name: "",
            parentUuid: undefined,
            fid: -60157311,
        },
    },
    mutations: {},
    actions: {
        add: ({dispatch, state}) => request({
            url: `/${prefix}/add`,
            data: state.params
        }).then(() => dispatch("findAll")),

        update: ({dispatch, state}) => request({
            url: `/${prefix}/update`,
            data: state.params
        }).then(() => dispatch("findAll")),

        del: ({dispatch, commit, state}, uuid) => request({
            url: `/${prefix}/del`,
            params: {uuid}
        }).then(() => dispatch("findAll")),

        findAll: ({state}) => {
            let fid = state.params.fid.toString();
            return request({
                url: `/${prefix}/findAll`,
                params:{fid},
            }).then(res => {
                state.types[fid] = {
                    data: res.data,
                    timestamp: new Date().getTime(),
                }
                return res.data;
            });
        },
        getAll: ({dispatch, state}) => {
            let fid = state.params.fid.toString();
            let now = new Date().getTime()
            let cache = state.types[fid];

            if (cache && (now - cache.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache.data))
            } else {
                return dispatch("findAll");
            }
        },
        method: () => {

        },


    },
    getters: {},
}