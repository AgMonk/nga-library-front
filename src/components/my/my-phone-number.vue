
<template>
  <el-link v-if="isLink" :href="`tel:`+phoneNumber">{{ phoneNumber }}</el-link>
  <span v-else>{{ phoneNumber }}</span>
</template>

<script>
export default {
  name: "my-phone-number",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    isLink: {
      type: Boolean,
      required: true,
    },
    phoneNumber: {
      type: String,
    }
  },
}

</script>

<style scoped>

</style>