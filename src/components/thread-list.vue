<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-pagination
          @current-change="getPage"
          v-model:currentPage="params.page"
          :page-size="params.size"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
     <el-form label-width="100" inline>
       <el-form-item label="主题分类">
         <el-cascader
             size="medium"
             filterable
             v-if="types[fid]"
             clearable
             v-model="params.condition.threadTypeUuid"
             :options="[{name:`全部`,uuid:`*`},{name:`未分类`,uuid:``},...types[fid].data]"
             :props="{ expandTrigger: 'hover',label:`name`,value:`uuid`,checkStrictly:true,emitPath:false }"
             @change="getPage"
         />
         <el-checkbox v-model="params.condition.includeChildren"  @change="getPage" label="包含子类" />
       </el-form-item>
       <el-form-item label="标题">
         <el-input v-model="params.condition.subject" @change="getPage" clearable />
       </el-form-item>
       <el-form-item label="批量设置主题分类" v-if="$store.getters[`user/isPermitted`](`主题:修改:分类`)">
         <el-cascader
             filterable
             v-if="types[fid]"
             clearable
             v-model="threadTypeUuid"
             :options="[...types[fid].data]"
             :props="{ expandTrigger: 'hover',label:`name`,value:`uuid`,checkStrictly:true,emitPath:false }"
             @change="setThreadType(threadTypeUuid,selection.map(i=>i.tid).join(`,`));threadTypeUuid=undefined;"
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
              <el-tag size="mini" style="cursor:pointer" @click="setThreadType(item.uuid,s.row.tid)">
<!--                {{item.name}}-->
                {{item.fullPath.join(`/`)}}
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
                 clearable
                 v-model="s.row.threadTypeUuid"
                 :options="[...types[fid].data]"
                 :props="{ expandTrigger: 'hover',label:`name`,value:`uuid`,checkStrictly:true,emitPath:false }"
                 @change="setThreadType(s.row.threadTypeUuid,s.row.tid)"
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
import {unEscape} from "@/assets/js/utils";
import NgaThreadLink from "@/components/nga/nga-thread-link";
import {mapState} from "vuex";

export default {
  name: "thread-list",
  components: {NgaThreadLink},
  data() {
    return {
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
    }),
  },
  methods: {
    handleSelectionChange(e) {
      this.selection = e;
      console.log(e)
    },
    unEscape,
    getPage() {
      this.$store.dispatch("threadList/getPage", this.params).then(res => {
        this.total = res.total
      })
    },
    setThreadType(typeUuid, tid) {
      if (this.$store.getters[`user/isPermitted`](`主题:修改:分类`)) {
        this.$store.dispatch("threadList/setThreadType", {typeUuid, tid, params: this.params}).then(res => {
          this.$message.success("设置成功")
          this.total = res.total
        })
      }
    }
  },
  mounted() {
    this.getPage();
    this.$store.dispatch("threadType/getAll",this.fid)

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