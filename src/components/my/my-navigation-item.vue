
<template>
  <el-submenu v-if="route.name&&route.children" :index="path">
    <template #title>{{ route.name }}</template>
    <my-navigation-item v-for="(child,i) in route.children" :key="i" :route="child" :parent-path="path"/>
  </el-submenu>
  <el-menu-item v-else-if="route.name" :index="path">
    {{ route.name }}
  </el-menu-item>
</template>

<script>
export default {
  name: "my-navigation-item",
  data() {
    return {
      path:this.parentPath+(this.route.path.startsWith(`/`)?``:`/`)+this.route.path
    }
  },
  methods: {},
  mounted() {
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