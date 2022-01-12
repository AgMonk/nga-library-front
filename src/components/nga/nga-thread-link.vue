<template>
  <el-link  target="_blank" :type="type" :href="`https://bbs.nga.cn/read.php?tid=`+tid">
    <span :style="bold?`font-weight:bold`:``">
      {{ subject }}
    </span>
  </el-link>
</template>

<script>
import {unEscape} from "@/assets/js/utils";

export default {
  name: "nga-thread-link",
  data() {
    return {
      type: "primary",
      tid: 0,
      bold: false,
      subject: "",
      show:false,
    }
  },
  methods: {
    parse(e) {
      if (e) {
        this.tid = e.tid;
        this.subject = unEscape(e.subject);
        const {color, bold} = e;
        if (color) {
          switch (color) {
            case `灰色`:
              this.type = `info`;
              break;
            case `红色`:
              this.type = `danger`;
              break;
            case `绿色`:
              this.type = `success`;
              break;
            case `蓝色`:
              this.type = `primary`;
              break;
            case `棕色`:
              this.type = `warning`;
              break;
          }
        }
        this.bold = bold;

      }
    },
  },
  mounted() {
    this.parse(this.thread)
  },
  watch: {
    "thread": {
      handler: function (e) {
        this.parse(e)
      },
    }
  },
  props: {
    thread: {required: true}
  },
}

</script>

<style scoped>

</style>