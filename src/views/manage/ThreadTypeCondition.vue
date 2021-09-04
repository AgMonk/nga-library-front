<!--主题分类条件-->
<template>
  <el-container direction="vertical">
    <el-main>
      <el-tabs v-model="library.currentLibrary">
        <el-tab-pane v-for="(item,i) in libraries" :label="item.name" :name="item.fid" :key="i">
          <thread-type-condition-list :fid="item.fid" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import {mapState} from "vuex";
import ThreadTypeConditionList from "@/components/thread-type-condition-list";

export default {
  name: "ThreadTypeCondition",
  components: {ThreadTypeConditionList},
  data() {
    return {
      library: this.$store.state.library
    }
  },
  computed: {
    ...mapState({
      libraries: state => state.library.libraries,
    })
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>