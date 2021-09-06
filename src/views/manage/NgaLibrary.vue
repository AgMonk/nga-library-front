<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>

    <el-main>
      <el-table :data="libraries">
        <el-table-column label="版面">
          <template #default="s">
            <el-link :href="`https://bbs.nga.cn/thread.php?fid=`+s.row.fid" target="_blank" type="primary">{{ s.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="管理员">
          <template #default="s">
            <el-link :href="`https://bbs.nga.cn/nuke.php?func=ucp&uid=`+s.row.managerUid" target="_blank" type="primary">{{ s.row.manager }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="s">

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
  name: "NgaLibrary",
  data() {
    return {}
  },
  methods: {
    ...mapActions(`ngaAccount`, {
      getAllAccount: `getAll`
    }),
    ...mapActions(`library`, {
      getAllLibrary: `getAll`
    }),

  },
  computed: {
    ...mapState(`library`, [
      `libraries`
    ]),
    ...mapState(`ngaAccount`, [
      `accounts`
    ]),

  },
  mounted() {
    this.getAllAccount()
    this.getAllLibrary()
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>