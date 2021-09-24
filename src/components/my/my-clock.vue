<template>

  <span>{{ time.format("yyyy-MM-dd hh:mm:ss") }}</span>

</template>

<script>
export default {
  name: "my-clock",
  data() {
    return {
      time: new Date(),
      internal: undefined,
    }
  },
  methods: {},
  mounted() {
    this.internal = setInterval(() => {
      this.time = new Date()
    }, 1000)
  },
  unmounted() {
    clearInterval(this.internal)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>