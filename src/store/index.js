import { createStore } from 'vuex'
import user from "@/store/user";
import library from "@/store/library";
import threadList from "@/store/threadList";
import threadType from "@/store/threadType";
import threadTypeCondition from "@/store/threadTypeCondition";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,library,threadList,threadType,threadTypeCondition
  }
})
