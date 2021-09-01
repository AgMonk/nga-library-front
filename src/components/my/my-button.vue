
<template>
  <el-tooltip v-if="tooltip" :content="tooltip" effect="dark" placement="bottom">
    <el-button :size="size" :type="type" @click="$emit(`click`,$event)">{{ text }}</el-button>
  </el-tooltip>
  <el-button v-else :size="size" :type="type" @click="$emit(`click`,$event)">{{ text }}</el-button>

</template>

<script>
export default {
  name: "my-button",
  data() {
    return {
      myData: {}
    }
  },
  emits: ["click"],
  mounted() {
  },
  props: {
    type: {
      type: String,
      default: "primary"
    },
    size: {
      type: String,
      default: "medium"
    },
    text: {
      required: true,
      type: String,
    },
    tooltip: {
      type: String,
    },

  },
}

</script>

<style scoped>

</style>