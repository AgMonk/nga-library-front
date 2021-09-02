<template>
  <el-sub-menu v-if="route&&route.children" :index="path">
    <!--suppress HtmlUnknownAttribute -->
    <template #title>{{ route.name }}</template>
    <my-navigation-item v-for="(child,i) in route.children" :key="i" :route="child" :parent-path="path"/>
  </el-sub-menu>
  <el-menu-item v-else-if="route" :index="path">
    {{ route.name }}
  </el-menu-item>
</template>

<script>
export default {
  name: "my-navigation-item",
  data() {
    return {
      path: this.parentPath + (this.route.path.startsWith(`/`) ? `` : `/`) + this.route.path
    }
  },
  methods: {},
  mounted() {
    console.log(this.route.children)
  },
  props: {
    route: {
      required: true
    },
    parentPath: {
      type: String,
    }
  },
}

</script>

<style scoped>

</style>