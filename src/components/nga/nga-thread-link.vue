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
        if (e.hasOwnProperty("titleFont") && e.titleFont.length === 4) {
          const color = e.titleFont.substring(0, 2);
          const bold = e.titleFont.substring(2, 4);
          this.bold = bold === `加粗`;
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