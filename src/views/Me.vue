
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h3>我的</h3>
    </el-header>
    <el-main>
     <el-row>
       <el-col :sm="{span:16,offset:4}" :md="{span:12,offset:6}" :lg="{span:8,offset:8}"  >
         <el-tabs v-model="loginActiveName" v-if="!user">
           <el-tab-pane label="登陆" name="登陆">
             <el-form :model="params.login" label-width="80px">
               <el-form-item label="用户名">
                 <el-input v-model="params.login.username" placeholder="用户名" clearable />
               </el-form-item>
               <el-form-item label="密码">
                 <el-input v-model="params.login.password" placeholder="密码" type="password" clearable show-password />
               </el-form-item>
               <el-form-item label-width="0">
                 <my-button type="success" text="登陆" @click="login" />
                 <my-button type="danger" text="重置" @click="params.login={}"/>
               </el-form-item>
             </el-form>
           </el-tab-pane>
           <el-tab-pane label="注册" name="注册">
<!--             todo 注册-->
           </el-tab-pane>
         </el-tabs >
         <el-tabs v-else v-model="loggedActiveName" >
           <el-tab-pane label="用户信息" name="用户信息">
             <el-form :model="user" label-width="80px">
               <el-form-item label="用户名">{{user.username}}</el-form-item>
               <el-form-item label="姓名">{{user.name}}</el-form-item>
               <el-form-item label="电话">{{user.phone}}</el-form-item>
               <el-form-item label="角色">
                  <my-tag v-for="(role,i) in user.roles" :key="i" :text="role.name" />
               </el-form-item>


               <el-form-item label-width="0">
                 <my-button text="修改密码" @click="functionNotImplement"  />
                 <my-button text="修改信息" @click="functionNotImplement"  />
               </el-form-item>
             </el-form>
             <br>
             <br>
             <my-button type="danger" text="登出" @click="logout"/>


           </el-tab-pane>
           <el-tab-pane label="其他" name="其他">
             其他
           </el-tab-pane>
         </el-tabs>
       </el-col>
     </el-row>
    </el-main>
<!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>

import {mapState,mapGetters} from "vuex";
import MyButton from "@/components/my/my-button";
import {functionNotImplement} from "@/assets/js/utils";
import MyTag from "@/components/my/my-tag";

export default {
  name: "me",
  components: {MyTag, MyButton},
  data() {
    return {
      loginActiveName:"登陆",
      loggedActiveName:"用户信息",
      params:{
        login: {
          username:"administrator",
          password:"123456",
        },
        reg:{},
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
    }),
    ...mapGetters({
      isPermitted: `user/isPermitted`,
    })
  },
  methods: {
    functionNotImplement,
    login(){
      this.$store.dispatch("user/login",this.params.login)
    },
    logout(){
      if (confirm("确认登出?")){
        this.$store.dispatch("user/logout")
      }
    }
  },
  mounted() {

  },
}

</script>

<style scoped>

</style>