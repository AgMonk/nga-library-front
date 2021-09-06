<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>

    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "NgaAccount",
  data() {
    return {}
  },
  methods: {
    ...mapActions(`ngaAccount`,[
        `add`,
        `del`,
        `getAll`,
    ])
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