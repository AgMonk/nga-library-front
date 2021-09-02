<template>
  <el-container direction="vertical">
    <el-main>
      <el-tabs v-model="library.currentLibrary">
        <el-tab-pane v-for="(item,i) in libraries" :label="item.name" :name="item.fid" :key="i">
          <thread-list :fid="item.fid" v-if="library.currentLibrary===item.fid"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import {mapState} from "vuex";
import ThreadList from "@/components/thread-list";

export default {
  name: 'Home',
  components: {ThreadList},
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

  mounted() {
    this.$store.dispatch("library/getAll")
  }
}
</script>
