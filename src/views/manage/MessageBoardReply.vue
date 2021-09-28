<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-form inline>
        <el-form-item label="作者">
          <el-input v-model="params.condition.author"/>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
              v-model="params.start"
              placeholder="选择时间"
              type="datetime"
              value-format="X">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
              v-model="params.end"
              placeholder="选择时间"
              type="datetime"
              value-format="X">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关键字">
          <el-select
              v-model="params.condition.keywords"
              allow-create
              default-first-option
              filterable
              multiple
          />
          <el-select v-model="params.condition.logic" style="width:80px">
            <el-option label="和" value="and"/>
            <el-option label="或" value="or"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getPageData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>

    <el-main>
      <el-pagination
          v-model:currentPage="params.page"
          :page-size="params.size"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="getPageData">
      </el-pagination>
      <el-table v-if="replies[JSON.stringify(params)]" :data="replies[JSON.stringify(params)].data.records">
        <el-table-column label="作者" width="200px">
          <template #default="s">
            <el-link :href="`https://bbs.nga.cn/nuke.php?func=ucp&uid=`+s.row.authorId" target="_blank" type="primary">{{ s.row.author }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="楼层" prop="level" width="80px">
        </el-table-column>
        <el-table-column label="发布时间" width="150px">
          <template #default="s">
            <el-link :href="`https://bbs.nga.cn/read.php?tid=${s.row.tid}&pid=${s.row.pid}`" target="_blank" type="primary">{{ s.row.postTimestamp.timeString }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="正文" prop="content"/>
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";

export default {
  name: "MessageBoardReply",
  data() {
    return {
      total: 10,
      params: copyObj(this.$store.state.messageBoardReply.params),
    }
  },
  methods: {
    ...mapMutations("messageBoardReply", [`setParams`]),
    ...mapActions("messageBoardReply", [`getPage`, `page`]),
    getPageData() {
      this.setParams(this.params);
      return this.getPage().then(res => {
        console.log(res)
        this.total = res.total;
      })
    },
  },
  computed: {
    ...mapState("messageBoardReply", [`replies`]),
  },
  mounted() {
    this.getPageData()
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>