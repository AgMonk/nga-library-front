import { createStore } from 'vuex'
import user from "@/store/user";
import library from "@/store/library";
import threadList from "@/store/threadList";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,library,threadList
  }
})
