<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
        <el-header>
          <el-button @click="addMain" type="primary">添加主分类</el-button>
        </el-header>
    <el-main>
      <el-tree
          v-if="types[fid]"
          :data="types[fid].data"
          node-key="uuid"
          :expand-on-click-node="false">
<!--          :default-expand-all="true"-->
        <!--suppress HtmlUnknownAttribute -->
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ data.name }}</span>
          &nbsp;
          &nbsp;
          &nbsp;
          <span>
            <i class="el-icon-plus" @click="addChildren(data,node)"/>
          &nbsp;
            <i class="el-icon-edit" @click="edit(data,node)"/>
          &nbsp;
            <i class="el-icon-delete" @click="del(data)"/>
&nbsp;
            <i v-if="data.pid" class="el-icon-share" @click="exportType({fid,pid:data.pid})"/>
&nbsp;&nbsp;
            <el-link :href="`https://bbs.nga.cn/read.php?pid=`+data.pid" target="_blank">&nbsp;{{ data.pid }}</el-link>
          </span>
        </span>
        </template>
      </el-tree>

      <el-dialog v-model="dialogShow" :title="dialogTitle">
        <el-form :model="params" label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="params.name" clearable ref="nameInput"/>
          </el-form-item>
          <el-form-item label="发布Pid">
            <el-input ref="pidInput" v-model="params.pid" clearable type="number"/>
          </el-form-item>
          <el-form-item label="上级分类" v-if="dialogTitle!==`添加主分类`">
            <el-cascader
                filterable
                clearable
                style="width:100%"
                v-model="parentUuid"
                :options="types[fid].data"
                :props="{ expandTrigger: 'hover',label:`name`,value:`uuid`,checkStrictly:true }"
                @change="nodeChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="submit(false)" type="primary" >连续添加</el-button>
            <el-button @click="submit(true)" type="primary" >提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
//查询当前节点的完整 uuid 路径
import {copyObj} from "@/assets/js/utils";
import {mapActions, mapState} from "vuex";

const findPath = (node) => {
  let uuid = node.data.uuid;
  if (node.parent && node.parent.data.uuid) {
    return [...findPath(node.parent), uuid]
  }
  return [uuid]
}

export default {
  name: "thread-type-list",
  data() {
    return {
      parentUuid: [],
      dialogTitle:"",
      dialogShow: false,
      params:{},
    }
  },
  computed: {
    ...mapState({
      types: state => state.threadType.types,
    })
  },
  methods: {
    ...mapActions("library", [`exportToPid`]),
    exportType(params) {
      this.exportToPid(params).then(res => {
        this.$message.success(res.message)
        window.open(res.data)
      })
    },
    nodeChange(e) {
      if (e) {
        this.params.parentUuid = e[e.length - 1];
      } else {
        this.params.parentUuid = undefined;
      }
      console.log(this.params)
    },
    edit(data, node) {
      this.dialogTitle = "修改分类";
      this.parentUuid = findPath(node);
      this.parentUuid.splice(this.parentUuid.length-1,1)
      this.params = {...copyObj(data), fid:this.fid,}
      this.dialogShow = true;
      this.$nextTick(function() {
        this.$refs.nameInput.select()
      })
      console.log(this.params)
    },
    addChildren(data, node) {
      this.dialogTitle = "添加子分类";
      this.parentUuid = findPath(node);
      this.params = {
        uuid: undefined,
        name: "",
        parentUuid: this.parentUuid[this.parentUuid.length-1],
        fid:this.fid,
      }
      this.dialogShow = true;
      this.$nextTick(function() {
        this.$refs.nameInput.select()
      })
    },
    del(data){
      if (confirm(`确认删除分类：${data.name}？`)){
        this.$store.dispatch("threadType/del",{
          uuid:data.uuid,
          fid:this.fid,
        })
      }
    },
    addMain() {
      this.dialogTitle = "添加主分类";
      this.parentUuid = [];
      this.params = {
        uuid: undefined,
        name: "",
        parentUuid: undefined,
        fid:this.fid,
      }
      this.dialogShow = true;
      this.$nextTick(function() {
        this.$refs.nameInput.select()
      })
    },

    submit(e){
      switch (this.dialogTitle) {
        case "添加主分类":
        case "添加子分类":
          this.$store.dispatch("threadType/add",this.params).then(()=>{
              this.$message.success("添加成功")
            if (e) {
              this.dialogShow = false;
            }else{
              this.$nextTick(function() {
                this.$refs.nameInput.select()
              })
            }
          })
          break;
        case "修改分类":
          this.$store.dispatch("threadType/update",this.params).then(()=>{
            this.$message.success("修改成功")
            this.dialogShow = false;
          })
          break;
      }
    }
  },
  mounted() {
    this.params.fid = this.fid;
    this.$store.dispatch("threadType/getAll",this.fid)
  },
  watch: {},
  props: {
    fid: {required: true}
  },
}

</script>

<style scoped>

</style>