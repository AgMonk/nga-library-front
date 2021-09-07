<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="addForum">添加</el-button>
    </el-header>

    <el-main>
      <div>
        <el-tag v-for="(item,i) in forums" :key="i" closable style="cursor: pointer" @click="edit(item)" @close="delForum(item)"><b>{{ item.name }}</b></el-tag>
      </div>


      <el-dialog v-model="dialogShow" :title="dialogTitle">
        <el-form :model="params" label-width="80px">
          <el-form-item label="版面ID">
            <el-input ref="nameInput" v-model="params.fid" :clearable="dialogTitle===`添加版面`" :disabled="dialogTitle===`修改版面`"/>
          </el-form-item>
          <el-form-item label="版面名称">
            <el-input v-model="params.name" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "Forum",
  data() {
    return {
      dialogShow: false,
      dialogTitle: ``,
      params: {},
    }
  },
  methods: {
    ...mapActions(`forum`, [
      `add`,
      `del`,
      `update`,
      `getAll`,
    ]),
    addForum() {
      this.params = {fid: ``, name: ``};
      this.dialogShow = true;
      this.dialogTitle = `添加版面`
    },
    edit({fid, name}) {
      this.params = {fid, name};
      this.dialogShow = true;
      this.dialogTitle = `修改版面`
    },
    delForum({fid, name}) {
      if (confirm(`确认删除版面：${name}?`)) {
        this.del(fid).then(() => {
          this.$message.success("删除成功")
        })
      }
    },
    submit() {
      switch (this.dialogTitle) {
        case "添加版面":
          this.add(this.params).then(() => {
            this.$message.success("添加成功")
            this.dialogShow = false;
          })
          break;
        case "修改版面":
          this.update(this.params).then(() => {
            this.$message.success("修改成功")
            this.dialogShow = false;
          })
          break;
      }
    }
  },
  computed: {
    ...mapState(`forum`, [
      `forums`
    ]),
  },
  mounted() {
    this.getAll()
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>