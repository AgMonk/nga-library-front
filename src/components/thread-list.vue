<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-pagination
          @current-change="getPage"
          v-model:currentPage="params.page"
          :page-size="params.size"
          layout="prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-header>

    <el-main>
      <el-table v-if="threads[JSON.stringify(params)]" :data="threads[JSON.stringify(params)].data.records">
        <el-table-column prop="subject" label="主题">
          <template #default="s">
            <!--            <el-link target="_blank" :href="`https://bbs.nga.cn/read.php?tid=`+s.row.tid">{{ unEscape(s.row.subject) }}</el-link>-->
            <nga-thread-link :thread="s.row"/>
          </template>
        </el-table-column>

        <el-table-column prop="author" label="作者" width="150">
          <template #default="s">
            <el-link target="_blank" :href="`https://bbs.nga.cn/nuke.php?func=ucp&uid=`+s.row.authorId">{{ s.row.author }}</el-link>
          </template>
        </el-table-column>
        <el-table-column width="80" prop="contentLength" label="正文长度"/>
        <el-table-column width="150" prop="postTimestamp.timeString" label="发布时间"/>
        <el-table-column width="150" prop="lastModifyTimestamp.timeString" label="最后修改"/>
        <el-table-column width="150" prop="lastCheck.timeString" label="更新时间"/>
      </el-table>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {unEscape} from "@/assets/js/utils";
import NgaThreadLink from "@/components/nga/nga-thread-link";

export default {
  name: "thread-list",
  components: {NgaThreadLink},
  data() {
    return {
      total: 100,
      params: this.$store.state.threadList.params,
      threads: this.$store.state.threadList.threads,
    }
  },
  methods: {
    unEscape,
    getPage() {
      this.$store.dispatch("threadList/getPage").then(res => {
        this.total = res.total
      })
    },
  },
  mounted() {
    this.$store.state.threadList.params.condition.fid = this.fid;
    this.getPage();
  },
  unmounted() {
    this.params.page = 1;
  },
  watch: {},
  props: {
    fid: {required: true}
  },
}

</script>

<style scoped>

</style>