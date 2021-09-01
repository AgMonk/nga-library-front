
<template>
  <el-tag :size="size" :type="type">{{ text }}</el-tag>
</template>

<script>
export default {
  name: "my-tag",
  props: {
    type: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "medium"
    },
    text: {
      required: true,
      type: String,
    },
  },
}

</script>

<style scoped>

</style>