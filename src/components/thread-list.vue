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
        <el-form-item label="标题颜色">
          <el-select v-if="params.condition" v-model="params.condition.titleFont" clearable @change="getPageData">
            <el-option v-for="(color,i) in titleColor" :key="i" :value="color">{{ color }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题分类">
          <el-cascader
              v-if="types[fid] && params.condition"
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
        <el-form-item v-if="isPermitted(`主题:修改:分类`)" label="批量设置主题分类">
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
        <el-table-column v-if="isPermitted(`主题:修改:分类`)" type="selection" width="30"/>
        <el-table-column prop="subject" label="主题">
          <!--suppress HtmlUnknownAttribute -->
          <template #default="s">
            <nga-thread-link :thread="s.row"/>
            <el-tooltip v-for="(item,i) in s.row.typeOptions" v-if="isPermitted(`主题:修改:分类`)" :key="i" placement="top">
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
            <div v-if="types[fid]">
              <el-cascader
                  v-if="isPermitted(`主题:修改:分类`)"
                  v-model="s.row.threadTypeUuid"
                  :options="[...types[fid].data]"
                  :props="cascaderProps"
                  clearable
                  filterable
                  style="width:100%"
                  @change="setType(s.row.threadTypeUuid,s.row.tid)"
              />
              <span v-else-if="s.row.threadType && s.row.threadType.fullPath">{{ s.row.threadType.fullPath.join('/') }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="80" prop="contentLength" label="正文长度"/>
        <el-table-column width="150" prop="postTimestamp.timeString" label="发布时间"/>
        <el-table-column label="最后修改" prop="lastEdit.timeString" width="150"/>
        <el-table-column width="150" prop="lastCheck.timeString" label="更新时间"/>
      </el-table>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {unEscape} from "@/assets/js/utils";
import NgaThreadLink from "@/components/nga/nga-thread-link";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: "thread-list",
  components: {NgaThreadLink},
  data() {
    return {
      cascaderProps: {expandTrigger: 'hover', label: `name`, value: `uuid`, checkStrictly: true, emitPath: false},

      total: 100,
      params: {
        page: 1,
        size: 10,
        condition: {
          fid: this.fid,
          threadTypeUuid: "*",
          includeChildren: true,
        }
      },
      threadTypeUuid: ``,
      selection: [],
    }
  },
  computed: {
    ...mapState({
      types: state => state.threadType.types,
      threads: state => state.threadList.threads,
      titleColor: state => state.threadList.titleColor,
    }),
    ...mapGetters("user", [`isPermitted`]),
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
      this.setParams({key: this.fid, params: this.params});
      this.getPage(this.fid).then(res => {
        this.total = res.total
      })
    },
    setType(typeUuid, tid) {
      if (this.isPermitted(`主题:修改:分类`)) {
        this.setThreadType({typeUuid, tid, fid: this.fid}).then(res => {
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
    const cache = this.$store.state.threadList.params[this.fid];
    this.params = cache ? cache : this.params;
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