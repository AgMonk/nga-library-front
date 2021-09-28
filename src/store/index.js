import {createStore} from 'vuex'
import user from "@/store/user";
import library from "@/store/library";
import threadList from "@/store/threadList";
import threadType from "@/store/threadType";
import threadTypeCondition from "@/store/threadTypeCondition";
import ngaAccount from "@/store/ngaAccount";
import forum from "@/store/forum";
import repost from "@/store/repost";
import messageBoard from "@/store/messageBoard";
import messageBoardReply from "@/store/messageBoardReply";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user, library, threadList, threadType, threadTypeCondition, ngaAccount, forum, repost, messageBoard, messageBoardReply
  }
})
