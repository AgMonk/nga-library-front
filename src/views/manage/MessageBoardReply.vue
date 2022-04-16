<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <div>
        <el-form inline>
          <el-form-item label="作者">
            <el-input v-model="params.condition.author" clearable size="small" />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="params.start"
                            placeholder="选择时间"
                            size="small"
                            type="datetime"
                            value-format="X"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="params.end"
                            placeholder="选择时间"
                            size="small"
                            type="datetime"
                            value-format="X"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="关键字">
            <el-select v-model="params.condition.keywords"
                       allow-create
                       clearable
                       default-first-option
                       filterable
                       multiple
                       size="small"
            />
            <el-select v-model="params.condition.logic" size="small" style="width:80px">
              <el-option label="和" value="and" />
              <el-option label="或" value="or" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button size="small" type="primary" @click="getPageData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div>
        <el-button size="small" type="primary" @click="dialogShow=true">统计</el-button>

        <el-dialog v-model="dialogShow" append-to-body title="统计">
          <el-form inline>
            <el-form-item label="开始时间">
              <el-date-picker v-model="countParam.start"
                              placeholder="选择时间"
                              size="small"
                              type="datetime"
                              value-format="X"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="countParam.end"
                              placeholder="选择时间"
                              size="small"
                              type="datetime"
                              value-format="X"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="countParam.limit" clearable size="small" />
            </el-form-item>
            <el-form-item label="tid">
              <el-input v-model="countParam.tid" clearable size="small" />
            </el-form-item>

            <el-form-item>
              <el-button size="small" type="primary" @click="count">查询</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

      <el-pagination
          v-model:currentPage="params.page"
          :page-size="params.size"
          :total="total"
          hide-on-single-page
          layout="total, prev, pager, next, jumper"
          @current-change="getPageData"
      >
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
        <el-table-column label="正文" prop="content" />
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
      dialogShow: false,
      countParam: {
        tid: 25968165,
        start: undefined,
        end: undefined,
        limit: 100
      }
    }
  },
  methods: {
    ...mapMutations("messageBoardReply", [`setParams`]),
    ...mapActions("messageBoardReply", [`getPage`, `page`, `countByAuthorId`]),
    getPageData() {
      this.setParams(this.params);
      return this.getPage().then(res => {
        console.log(res)
        this.total = res.total;
      })
    },
    count() {
      this.countByAuthorId(this.countParam).then(res => {
        console.log(res.data)
        const list = res.data.map(item => {
          const {authorId, author, count} = item
          if (authorId.startsWith('#anony_')) {
            return `${count} ${author}[匿名]`
          } else {
            return `${count} [uid=${authorId}]${author}[/uid]`
          }
        })
        const {tid, start, end, limit} = this.countParam
        let title = `tid = ${tid} `
        if (start) {
          title += ' 开始时间:' + new Date(start * 1000).format("yyyy-MM-dd hh:mm:ss")
        }
        if (end) {
          title += ' 结束时间:' + new Date(end * 1000).format("yyyy-MM-dd hh:mm:ss")
        }
        if (limit) {
          title += ` 前${limit}名`
        }

        const s = title + '\n' + list.join('\n')
        console.log(s)
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