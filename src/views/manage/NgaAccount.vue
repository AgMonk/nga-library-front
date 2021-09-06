<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-form>
        <el-form-item label="添加账号">
          <el-input v-model="cookie" @keypress.enter="addAccount" placeholder="回车提交" />
        </el-form-item>
      </el-form>
    </el-header>

    <el-main>
      <el-table :data="accounts">
        <el-table-column label="uid" prop="uid" />
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="操作">
          <!--suppress HtmlUnknownAttribute -->
          <template #default="s">
            <i class="el-icon-delete" style="cursor: pointer"  @click="deleteAccount(s.row.uid)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "NgaAccount",
  data() {
    return {
      cookie:``,
    }
  },
  methods: {
    deleteAccount(uid){
      if (confirm(`确认删除？`)) {
        this.del(uid)
      }
    },
    addAccount(){
      this.add(this.cookie).then(()=>{
        this.$message.success("添加成功")
        this.cookie=``
      })
    },
    ...mapActions(`ngaAccount`,[
        `add`,
        `del`,
        `getAll`,
    ])
  },
  computed:{
    ...mapState(`ngaAccount`,[
        `accounts`
    ])
  },
  mounted() {
    this.getAll()
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>