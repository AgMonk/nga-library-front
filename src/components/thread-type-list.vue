<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->

    <el-main>
      <el-tree
          v-if="types[fid]"
          :data="types[fid].data"
          node-key="uuid"
          @node-click="nodeClick"
          :expand-on-click-node="false">
        <!--suppress HtmlUnknownAttribute -->
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ data.name }}</span>
          &nbsp;
          &nbsp;
          &nbsp;
          <span>
            <i class="el-icon-plus"/>
          &nbsp;
          &nbsp;
            <i class="el-icon-delete"/>
          </span>
        </span>
        </template>
      </el-tree>

      <el-dialog v-model="showDialog" :title="dialogTitle">
        <el-form :model="params" label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="params.name"/>
          </el-form-item>
          <el-form-item label="上级分类">
            <el-cascader
                clearable
                style="width:100%"
                v-model="cascaderValue"
                :options="types[fid].data"
                :props="{ expandTrigger: 'hover',label:`name`,value:`uuid` }"
                @change="nodeChange"
            ></el-cascader>
          </el-form-item>

        </el-form>
      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "thread-type-list",
  data() {
    return {
      cascaderValue: [],
      dialogTitle:"",
      showDialog: false,
      params: this.$store.state.threadType.params,
      types: this.$store.state.threadType.types,
    }
  },
  methods: {
    nodeChange(e) {
      if(e){
        this.params.parentUuid = e[e.length - 1];
      }else{
        this.params.parentUuid = undefined;
      }
      console.log(this.params)
    },
    nodeClick(data, node) {
      this.dialogTitle = "修改分类";
      // 写分类路径
      let findPath = (node) => {
        let uuid = node.data.uuid;
        if (node.parent && node.parent.data.uuid) {
          return [...findPath(node.parent), uuid]
        }
        return [uuid]
      }
      this.cascaderValue = findPath(node);

      this.params.uuid = data.uuid;
      this.params.name = data.name;
      this.params.parentUuid = data.parentUuid;
      this.params.fid = data.fid;
      this.showDialog = true;
    }
  },
  mounted() {
    this.params.fid = this.fid;
    this.$store.dispatch("threadType/getAll")
  },
  watch: {},
  props: {
    fid: {required: true}
  },
}

</script>

<style scoped>

</style>