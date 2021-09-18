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
      <el-button @click="add" type="primary">添加分类条件</el-button>
    </el-header>

    <el-main>
      <el-table v-if="conditions[JSON.stringify(params)]" :data="conditions[JSON.stringify(params)].data.records">
        <el-table-column label="操作" width="80">
          <template #default="s">
            <i class="el-icon-edit" style="cursor: pointer" @click="edit(s.row)"/>
            &nbsp;
            <i class="el-icon-delete" @click="del(s.row.uuid)"/>
          </template>
        </el-table-column>
        <el-table-column label="匹配类型">
          <template #default="s">
            <!--            <el-cascader-->
            <!--                style="width:100%"-->
            <!--                disabled-->
            <!--                v-if="types[fid]"-->
            <!--                v-model="s.row.threadTypeUuid"-->
            <!--                :options="types[fid].data"-->
            <!--                :props="{ expandTrigger: 'hover',label:`name`,value:`uuid`,checkStrictly:true,emitPath:false }"-->
            <!--            />-->
            <span>{{ s.row.threadType.fullPath.join('/') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题颜色" prop="titleColor"/>
        <el-table-column label="必备关键字" prop="hasAllKeywords"/>
        <el-table-column label="必无关键字" prop="hasNotKeywords"/>
        <el-table-column label="必1关键字" prop="hasOneKeywords"/>
        <el-table-column label="最小正文长度" prop="minContentLength" width="80"/>
        <el-table-column label="最大正文长度" prop="maxContentLength" width="80"/>
        <el-table-column label="发表时间起" prop="postTimestampStart.date" width="100"/>
        <el-table-column label="发表时间止" prop="postTimestampEnd.date" width="100"/>
      </el-table>

      <el-dialog v-model="dialogShow" :title="dialogTitle">
        <el-form :model="condition" label-width="120px" inline>
          <el-form-item label="标题颜色">
            <el-select v-model="condition.titleColor" multiple>
              <el-option v-for="(color,i) in titleColor" :key="i" :value="color">{{ color }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="匹配类型">
            <el-cascader
                filterable
                v-if="types[fid]"
                v-model="condition.threadTypeUuid"
                :options="types[fid].data"
                :props="{ expandTrigger: 'hover',label:`name`,value:`uuid`,checkStrictly:true,emitPath:false }"
            />
          </el-form-item>
        </el-form>
        <el-form :model="condition" label-width="120px" inline>
          <el-form-item label="最小正文长度">
            <el-input clearable v-model="condition.minContentLength" type="number"/>
          </el-form-item>
          <el-form-item label="最大正文长度">
            <el-input clearable v-model="condition.maxContentLength" type="number"/>
          </el-form-item>
        </el-form>
        <el-form :model="condition" label-width="120px" inline>
          <el-form-item label="发表时间起">
            <el-date-picker
                value-format="X"
                clearable
                v-model="condition.postTimestampStart.timestamp"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发表时间止">
            <el-date-picker
                value-format="X"
                clearable
                v-model="condition.postTimestampEnd.timestamp"
                type="date"
                placeholder="选择日期"/>
          </el-form-item>
        </el-form>
        <el-form :model="condition" label-width="120px">
          <el-form-item label="必备关键字">
            <el-select v-model="condition.hasAllKeywords" multiple allow-create filterable default-first-option style="width:100%"/>
          </el-form-item>
          <el-form-item label="必无关键字">
            <el-select v-model="condition.hasNotKeywords" multiple allow-create filterable default-first-option style="width:100%"/>
          </el-form-item>
          <el-form-item label="必1关键字">
            <el-select v-model="condition.hasOneKeywords" multiple allow-create filterable default-first-option style="width:100%"/>
          </el-form-item>
        </el-form>
        <el-form>
          <el-form-item>
            <el-button type="success" @click="submit">提交</el-button>
            <el-button v-if="dialogTitle===`添加分类`" type="warning" @click="createEmptyCondition">重置</el-button>
            <el-button v-if="dialogTitle===`修改分类`" type="success" @click="dialogTitle=`添加分类`;submit()">复制</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";

export default {
  name: "thread-type-condition-list",
  data() {
    return {
      dialogTitle: "",
      dialogShow: false,
      total: 10,
      params: {
        page: 1,
        size: 10,
        condition: {

          postTimestampStart: {},
          postTimestampEnd: {},
        }
      },
      condition: this.createEmptyCondition(),
    }
  },
  computed: {
    ...mapState({
      types: state => state.threadType.types,
      conditions: state => state.threadTypeCondition.conditions,
      titleColor: state => state.threadList.titleColor,
    })
  },
  methods: {
    createEmptyCondition() {
      return {
        titleColor: [],
        hasAllKeywords: [],
        hasNotKeywords: [],
        hasOneKeywords: [],
        minContentLength: undefined,
        maxContentLength: undefined,
        threadTypeUuid: undefined,
        postTimestampStart: {},
        postTimestampEnd: {},
      }
    },
    add() {
      this.dialogTitle = "添加分类";
      this.dialogShow = true;
      this.condition = this.createEmptyCondition()
    },
    edit(e) {
      this.dialogTitle = "修改分类";
      this.dialogShow = true;
      const condition = {...copyObj(e)};
      condition.postTimestampStart = condition.postTimestampStart ? condition.postTimestampStart : {};
      condition.postTimestampEnd = condition.postTimestampEnd ? condition.postTimestampEnd : {};
      this.condition = condition
    },
    del(uuid) {
      if (confirm(`确认删除`)) {
        this.$store.dispatch("threadTypeCondition/del", {uuid, params: this.params}).then(res => this.total = res.total)
      }
    },
    getPage() {
      this.$store.dispatch("threadTypeCondition/getPage", this.params).then(res => this.total = res.total)
    },
    submit() {
      const data = copyObj({...this.condition, fid: this.fid});
      if (!data.postTimestampStart.timestamp) {
        delete data.postTimestampStart
      }
      if (!data.postTimestampEnd.timestamp) {
        delete data.postTimestampEnd
      }
      switch (this.dialogTitle) {
        case "添加分类":
          this.$store.dispatch("threadTypeCondition/add", {data, params: this.params}).then(res => {
            this.$message.success("添加成功")
            this.dialogShow = false;
            this.total = res.total
          })
          break;
        case "修改分类":
          this.$store.dispatch("threadTypeCondition/update", {data, params: this.params}).then(res => {
            this.$message.success("修改成功")
            this.dialogShow = false;
            this.total = res.total
          })
          break;
      }
    }
  },
  mounted() {
    this.params.condition.fid = this.fid;
    this.$store.dispatch("threadType/getAll", this.fid)
    this.getPage();
  },
  watch: {},
  props: {
    fid: {required: true}
  },
}

</script>

<style scoped>

</style>