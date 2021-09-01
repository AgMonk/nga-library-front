
<template>
  <el-divider content-position="left"><b>{{ text }}</b>
    <slot/>
  </el-divider>
</template>

<script>
export default {
  name: "my-divider",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    text: {
      type: String,
    }
  },
}

</script>

<style scoped>

</style>