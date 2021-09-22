import {createStore} from 'vuex'
import user from "@/store/user";
import library from "@/store/library";
import threadList from "@/store/threadList";
import threadType from "@/store/threadType";
import threadTypeCondition from "@/store/threadTypeCondition";
import ngaAccount from "@/store/ngaAccount";
import forum from "@/store/forum";
import repost from "@/store/repost";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user, library, threadList, threadType, threadTypeCondition, ngaAccount, forum, repost
  }
})
