<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="addRepost">添加转发</el-button>
      <el-button type="primary" @click="refresh">刷新</el-button>
      <div>
        <my-clock/>
      </div>
    </el-header>
    <el-main>
      <el-pagination
          v-model:currentPage="params.page"
          :page-size="params.size"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="pageChange">
      </el-pagination>


      <el-table v-if="reposts[JSON.stringify(params)]" :data="reposts[JSON.stringify(params)].data.records">
        <el-table-column label="操作" width="80">
          <template #default="s">
            <i class="el-icon-edit" style="cursor: pointer" @click="edit(s.row.uuid)"/>
            &nbsp;
            <i class="el-icon-delete" style="cursor:pointer" @click="deleteRepost(s.row.uuid)"/>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="150px"/>
        <el-table-column label="重试次数" prop="retry" width="80px"/>
        <el-table-column label="计划发布" prop="time" width="150px">
          <template #default="s">
            {{ new Date(s.row.time * 1000).format("yyyy-MM-dd hh:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="实际发布" prop="time" width="150px">
          <template #default="s">
            <span v-if="s.row.executeTime">{{ new Date(s.row.executeTime * 1000).format("yyyy-MM-dd hh:mm:ss") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="回复主题" prop="tid" width="120px">
          <template #default="s">
            <el-link :href="`https://bbs.nga.cn/read.php?tid=`+s.row.tid" target="_blank">{{ s.row.tid }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="回复地址" prop="pid" width="120px">
          <template #default="s">
            <el-link v-if="s.row.pid" :href="`https://bbs.nga.cn/read.php?pid=`+s.row.pid" target="_blank">{{ s.row.pid }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="发布账号" width="160px">
          <template #default="s">
            <el-link v-if="accounts.filter(item=>item.uid===s.row.accountId).length===1" :href="`https://bbs.nga.cn/nuke.php?func=ucp&uid=`+s.row.accountId" target="_blank">
              {{ accounts.filter(item => item.uid === s.row.accountId)[0].username }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>


      <el-dialog v-model="dialogShow" :title="dialogTitle">
        <el-form :model="data" inline>
          <el-form-item label="发布时间">
            <el-date-picker
                v-model="data.time"
                placeholder="选择时间"
                type="datetime"
                @change="setHeader"
                value-format="X">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发布账号">
            <el-select v-model="data.accountId">
              <el-option v-for="(item,i) in accounts" :key="i" :label="item.username" :value="item.uid"/>
            </el-select>
          </el-form-item>
          <el-form-item label="目标主题TID">
            <el-input v-model="data.tid" placeholder="目标主题TID"/>
          </el-form-item>
        </el-form>
        <el-form :model="data">
          <el-form-item label="回复模板">
            <el-input v-model="data.template" :autosize="{ minRows: 3, maxRows: 10}" clearable placeholder="回复模板" type="textarea" @change="parseParams"/>
            <el-form-item v-for="(item,i) in data.params" :key="i" :label="`模板参数:`+i">
              <el-input v-model="data.params[i]" clearable/>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="dialogTitle===`修改转发`" label="上传图片">
            <div v-if="data.images && data.images.length>0">
              <span v-for="(item,i) in data.images"
                    :key="i">
                <el-image
                    :preview-src-list="data.images"
                    :src="item"
                    style="width: 100px; height: 100px"
                />
                <i class="el-icon-delete" style="cursor: pointer" @click="deleteImg(data.uuid,item)"/></span>
            </div>


            <el-upload
                :action="`/api/Repost/upload?uuid=`+data.uuid"
                :on-success="onSuccess"
                class="upload-demo"
                drag
                multiple
                with-credentials
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";
import MyClock from "@/components/my/my-clock";

export default {
  name: "Repost",
  components: {MyClock},
  data() {
    return {
      dialogShow: false,
      dialogTitle: "添加转发",
      data: {},
      accounts: [],
      params: {page: 1, size: 10,},
      total: 10,
    }
  },
  methods: {
    ...mapActions(`repost`, [`add`, `update`, `del`, `get`, `getPage`, `getNextTime`, `page`, `deleteFile`]),
    ...mapActions(`ngaAccount`, {
      getAllAccount: `getAll`
    }),
    findPage() {
      return this.getPage(this.params).then(res => {
        this.total = res.total
      })
    },
    pageChange(e) {
      this.params.page = e;
      this.findPage()
    },
    refresh() {
      this.page().then(res => {
        this.$message.success("刷新成功")
        this.total = res.total
      })
    },
    onSuccess(response, file, fileList) {
      console.log(1)
      this.getOne(this.data.uuid).then(() => this.parseSource())

    },
    parseSource() {
      if (!this.data.images || this.data.images.length === 0) {
        return;
      }
      const name = this.data.images[0]
      console.log(`解析文件名:${name}`)
      //判断是否为pixiv图片
      const pixiv_pattern = /(\d+)_p\d+/
      let m1 = pixiv_pattern.exec(name)
      if (m1) {
        this.data.params.source = `pix:${m1[1]}`
        this.update(this.data)
      }
      //判断是否为推特图片
      const twitter_pattern = /(\d{19})/
      let m2 = twitter_pattern.exec(name)
      if (m2) {
        this.data.params.source = `twi:${m2[1]}`
        this.update(this.data)
      }
    },
    deleteImg(uuid, fileName) {
      if (confirm("确认删除?")) {
        this.deleteFile({uuid, fileName}).then(res => {
          this.$message.success(res.message)
          this.getOne(uuid)
        })
      }
    },
    addRepost() {
      this.dialogShow = true;
      this.dialogTitle = `添加转发`;
      this.data = {}
      this.getNextTime().then(res => {
        const data = copyObj(res.data)
        data.template = "${header}\n[quote]\n[collapse=${title}]\n来源：${source}\n${content}\n[/collapse]\n[/quote]"
        data.time = (data.time).toString();
        this.data = data;
        this.parseParams()
        this.setHeader()
      })
    },
    deleteRepost(uuid) {
      if (confirm("确认删除?")) {
        this.del(uuid)
      }
    },
    setHeader() {
      const date = new Date(this.data.time * 1000);
      const hours = date.getHours();
      if (hours >= 0 && hours <= 5) {
        this.data.params.header = `这就是凌晨${hours}点的水楼吗[img]./mon_201901/11/-klbw3Q5-6fo2KdT8S2s-2s.png[/img]`
      } else if (hours >= 6 && hours <= 7) {
        this.data.params.header = `早起冠军！[img]./mon_201901/11/-klbw3Q5-24c5KcT8S2s-2s.png[/img]`
      } else if (hours >= 12 && hours <= 13) {
        let eat = [
          "[img]./mon_201901/11/-klbw3Q5-7ogmK4T8S2s-2s.jpg[/img]",
          "[img]./mon_201901/11/-klbw3Q5-k393K4T8S2s-2s.jpg[/img]",
          "[img]./mon_201901/11/-klbw3Q5-h5jqKfT8S2s-2s.png[/img]"
        ]
        let i = Math.floor(Math.random() * eat.length);
        this.data.params.header = `恰饭了吗？` + eat[i];
      } else {
        this.data.params.header = `整点se图`;
      }
      this.data.params.title = `折叠`;
    },
    getOne(uuid) {
      return this.get(uuid).then(res => {
        this.data = res;
        this.parseParams()
      })
    },
    edit(uuid) {
      this.dialogShow = true;
      this.dialogTitle = `修改转发`;
      this.getOne(uuid)
    },
    parseParams() {
      //  解析模板中的占位符
      const pattern = /\${\S+}/g;
      const params = {}
      let key;
      while (key = pattern.exec(this.data.template)) {
        let k = key[0].substring(2, key[0].length - 1);
        if (this.data.params && this.data.params.hasOwnProperty(k) && this.data.params[k]) {
          params[k] = this.data.params[k];
        } else {
          params[k] = ``;
        }
      }
      this.data.params = params;
      console.log(this.data.params)
    },
    submit() {
      if (this.dialogTitle === `添加转发`) {
        this.add(this.data).then(res => {
          this.dialogTitle = `修改转发`
          this.$message.success("添加成功");
          this.data = res
          this.refresh()
        }).catch(reason => {
          this.$message.warning(reason.join(" & "))
        })
      } else if (this.dialogTitle === `修改转发`) {
        this.update(this.data).then(res => {
          this.$message.success("修改成功");
          this.dialogShow = false;
          this.data = res;
          this.refresh()
        }).catch(reason => {
          this.$message.warning(reason.join(" & "))
        })
      }

    },
  },
  computed: {
    ...mapState(`repost`, [`reposts`]),
  },
  mounted() {
    this.findPage()
    this.getAllAccount().then(res => {
      this.accounts = res
      console.log(this.accounts)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>