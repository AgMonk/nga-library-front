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
        findAll: ({dispatch, commit, state}, payload) => request({
            url: `/${prefix}/findAll`,
        }).then(res => {
            state.libraries = res.data;
            state.libraries.forEach(i=>i.fid=i.fid.toString())
            state.timestamp = new Date().getTime();
            return res.data;
        }),
        getAll: ({dispatch, commit, state}, payload) => {
            let now = new Date().getTime()
            if (state.timestamp && (now - state.timestamp) < 60 * 1000) {
                state.currentLibrary = state.currentLibrary==="0"?state.libraries[0].fid:state.currentLibrary;
                return new Promise(resolve => resolve(state.libraries))
            } else {
                return dispatch("findAll").then(res=>{
                    state.currentLibrary = state.currentLibrary==="0"?res[0].fid:state.currentLibrary;
                    return res;
                });
            }
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}