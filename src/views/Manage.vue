<template>
  <router-view/>
</template>

<script>
export default {
  name: "Manage",
  data() {
    return {}
  },
  methods: {},
  mounted() {
    this.$store.dispatch("library/getAll")
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>