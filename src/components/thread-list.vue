<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-pagination
          @current-change="getPageData"
          v-model:currentPage="params.page"
          :page-size="params.size"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <el-form inline label-width="100">
        <el-form-item label="主题分类">
          <el-cascader
              v-if="types[fid]"
              v-model="params.condition.threadTypeUuid"
              :options="[{name:`全部`,uuid:`*`},{name:`未分类`,uuid:``},...types[fid].data]"
              :props="cascaderProps"
              clearable
              filterable
              size="medium"
              @change="getPageData"
          />
          <el-checkbox v-model="params.condition.includeChildren" label="包含子类" @change="getPageData"/>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="params.condition.subject" clearable @change="getPageData"/>
        </el-form-item>
        <el-form-item v-if="$store.getters[`user/isPermitted`](`主题:修改:分类`)" label="批量设置主题分类">
          <el-cascader
              v-if="types[fid]"
              v-model="threadTypeUuid"
              :options="[...types[fid].data]"
              :props="cascaderProps"
              clearable
              filterable
              @change="setType(threadTypeUuid,selection.map(i=>i.tid).join(`,`));threadTypeUuid=undefined;"
          />
        </el-form-item>
      </el-form>

    </el-header>

    <el-main>
      <el-table v-if="threads[JSON.stringify(params)]" :data="threads[JSON.stringify(params)].data.records" @selection-change="handleSelectionChange">
        <el-table-column v-if="$store.getters[`user/isPermitted`](`主题:修改:分类`)" type="selection" width="30"/>
        <el-table-column prop="subject" label="主题">
          <!--suppress HtmlUnknownAttribute -->
          <template #default="s">
            <nga-thread-link :thread="s.row"/>
            <el-tooltip v-if="$store.getters[`user/isPermitted`](`主题:修改:分类`)" placement="top" v-for="(item,i) in s.row.typeOptions" :key="i">
              <template #content>
                <!--                全名:{{item.fullPath.join(`/`)}}-->
                <!--                <br>-->
                得分:{{ item.score }}
              </template>
              <el-tag size="mini" style="cursor:pointer" @click="setType(item.uuid,s.row.tid)">
                <!--                {{item.name}}-->
                {{ item.fullPath.join(`/`) }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="author" label="作者" width="150">
          <!--suppress HtmlUnknownAttribute -->
          <template #default="s">
            <span v-if="s.row.authorId.startsWith(`#anony_`)">匿名作者</span>
            <el-link v-else target="_blank" :href="`https://bbs.nga.cn/nuke.php?func=ucp&uid=`+s.row.authorId">{{ s.row.author }}</el-link>
          </template>
        </el-table-column>
        <el-table-column width="400" prop="threadType" label="主题分类">
          <!--suppress HtmlUnknownAttribute -->
          <template #default="s">
            <el-cascader
                style="width:100%"
                filterable
                v-if="types[fid]"
                v-model="s.row.threadTypeUuid"
                :options="[...types[fid].data]"
                :props="cascaderProps"
                clearable
                @change="setType(s.row.threadTypeUuid,s.row.tid)"
            />
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
import {copyObj, unEscape} from "@/assets/js/utils";
import NgaThreadLink from "@/components/nga/nga-thread-link";
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  name: "thread-list",
  components: {NgaThreadLink},
  data() {
    return {
      cascaderProps: {expandTrigger: 'hover', label: `name`, value: `uuid`, checkStrictly: true, emitPath: false},

      total: 100,
      params: copyObj(this.$store.state.threadList.params),
      threadTypeUuid: ``,
      selection: [],
    }
  },
  computed: {
    ...mapState({
      types: state => state.threadType.types,
      threads: state => state.threadList.threads,
    }),
  },
  methods: {
    ...mapMutations("threadList", [`setParams`]),
    ...mapActions("threadList", [`getPage`, `setThreadType`]),
    handleSelectionChange(e) {
      this.selection = e;
      console.log(e)
    },
    unEscape,
    getPageData() {
      this.params.condition.fid = this.fid
      this.setParams(this.params);
      this.getPage().then(res => {
        this.total = res.total
      })
    },
    setType(typeUuid, tid) {
      if (this.$store.getters[`user/isPermitted`](`主题:修改:分类`)) {
        this.setThreadType({typeUuid, tid, params: this.params}).then(res => {
          this.$message.success("设置成功")
          this.total = res.total
        })
      }
    },
    onMount() {

      this.getPageData();
      this.$store.dispatch("threadType/getAll", this.fid)
    }
  },
  unmounted() {
    this.params.page = 1;
  },
  mounted() {
    this.onMount()

  },
  watch: {
    "fid": {
      handler: function (e) {
        this.onMount()
      }
    }
  },
  props: {
    fid: {required: true}
  },
}

</script>

<style scoped>

</style>