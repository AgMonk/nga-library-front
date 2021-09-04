<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button @click="add" type="primary">添加分类条件</el-button>
    </el-header>

    <el-main>
      <el-dialog v-model="dialogShow" :title="dialogTitle">
        aaa
      </el-dialog>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapState} from "vuex";

export default {
  name: "thread-type-condition-list",
  data() {
    return {
      dialogTitle:"",
      dialogShow: false,
      params:{
        postTimestampStart:{},
        postTimestampEnd:{},
      },
    }
  },
  computed: {
    ...mapState({
      types: state => state.threadType.types,
      conditions: state => state.threadTypeCondition.conditions,
    })
  },
  methods: {
    add(){
      this.dialogTitle = "添加分类";
      this.dialogShow = true;
      this.params = {
        postTimestampStart:{},
        postTimestampEnd:{},
      }
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    fid: {required: true}
  },
}

</script>

<style scoped>

</style>