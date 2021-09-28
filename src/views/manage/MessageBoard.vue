<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header>留言板</el-header>-->

    <el-main>留言板

      <el-table :data="messageBoard">
        <el-table-column label="操作">
          <template #default="s">
            <i class="el-icon-edit" style="cursor: pointer" @click=""/>
            &nbsp;
            <i class="el-icon-delete" style="cursor: pointer" @click=""/>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="当前页数" prop="page"/>
        <el-table-column label="最大页数" prop="maxPages"/>
        <el-table-column label="tid" prop="tid">
          <template #default="s">
            <el-link :href="`https://bbs.nga.cn/read.php?tid=`+s.row.tid" target="_blank">{{ s.row.tid }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="管理员" prop="managerUid">
          <template #default="s">
            <el-link :href="`https://bbs.nga.cn/nuke.php?func=ucp&uid=`+s.row.managerUid" target="_blank" type="primary">
              {{ accounts.filter(i => i.uid === s.row.managerUid)[0].username }}
            </el-link>
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
  name: "MessageBoard",
  data() {
    return {}
  },
  methods: {
    ...mapActions("messageBoard", [`getAll`]),
  },
  computed: {
    ...mapState("messageBoard", [`messageBoard`]),
    ...mapState("ngaAccount", [`accounts`])
  },
  mounted() {

    this.$store.dispatch("ngaAccount/getAll").then(() => this.getAll())
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>