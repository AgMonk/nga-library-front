// 主题类型

import {request} from "@/assets/js/request";

const prefix = `ThreadType`;

export default {
    namespaced: true,
    state: {
        types: {},
    },
    mutations: {},
    actions: {
        add: ({dispatch, state},data) => request({
            url: `/${prefix}/add`,
            data
        }).then(() => dispatch("findAll",data.fid)),

        update: ({dispatch, state},data) => request({
            url: `/${prefix}/update`,
            data
        }).then(() => dispatch("findAll",data.fid)),

        del: ({dispatch, commit, state}, {uuid,fid}) => request({
            url: `/${prefix}/del`,
            params: {uuid}
        }).then(() => dispatch("findAll",fid)),

        findAll: ({state},fid) => {
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
        getAll: ({dispatch, state},fid) => {
            let now = new Date().getTime()
            let cache = state.types[fid];

            if (cache && (now - cache.timestamp) < 60 * 1000) {
                return new Promise(resolve => resolve(cache.data))
            } else {
                return dispatch("findAll",fid);
            }
        },
        method: () => {

        },


    },
    getters: {},
}