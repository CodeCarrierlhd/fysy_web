<!-- 产品追踪 -->
<template>
  <div class="container">
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      class="find"
    >
      <el-tab-pane
        :name="item.name"
        v-for="(item, index) in tabNames"
        :key="index"
        :label="item.label"
      >
        <div style="margin:10px 20px">
          <div class="btn_header">
            <div style="display:flex;margin-right:10px" v-if="s_show">
              <el-input
                v-model="search"
                prefix-icon="el-icon-search"
                clearable
                style="border-radius:4px;width:400px;margin-right:10px"
                placeholder="输入关键字搜索"
              />
              <el-button @click="searchEnterFun()" type="primary"
                ><i class="el-icon-search"></i>搜索</el-button
              >
            </div>
            <div>
              <el-button
                @click="exportClientInfoExcel()"
                :type="defaultColr"
                :disabled="btnStatu"
                size="medium"
                v-if="i_show"
                ><i class="el-icon-download"></i>导出</el-button
              >
              <el-button
                @click="exportAllExcel"
                type="primary"
                size="medium"
                v-if="i_show"
                >一键导出</el-button
              >
            </div>
          </div>
          <el-table
            ref="filterTable"
            :data="tableData"
            @selection-change="selectionChangeHandle"
            @filter-change="fnFilterChangeInit"
            :row-key="getRowKey"
            :header-cell-style="{
              fontSize: '15px',
              color: '#000',
              fontWeight: 800,
              background: '#eef1f6',
              padding: '4px'
            }"
            border
            height="660"
            :cell-style="{ padding: '2px' }"
            v-loading="loading"
          >
            <el-table-column
              type="selection"
              width="60"
              align="center"
              fixed
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column
              type="index"
              width="60"
              fixed
              align="center"
              label="序号"
            >
            </el-table-column>
            <el-table-column
              prop="materialType"
              label="产品类别"
              align="center"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="materialModel"
              label="产品型号"
              align="center"
              width="120"
              :filter-multiple="false"
              :filters="materialModelGroup"
              :filter-method="filterTag"
              column-key="materialModel"
              filter-placement="bottom-end"
            >
            </el-table-column>
            <el-table-column
              prop="productNo"
              label="序列号 "
              align="center"
              width="240"
            >
            </el-table-column>
            <el-table-column
              prop="batchNo"
              label="产品批号 "
              align="center"
              width="240"
            >
            </el-table-column>
            <el-table-column
              prop="spec"
              label="规格 "
              align="center"
              width="60"
            >
            </el-table-column>
            <el-table-column
              prop="produceDate"
              label="生产日期 "
              align="center"
              width="120"
            >
            </el-table-column>

            <el-table-column
              prop="expiryDate"
              label="失效日期"
              align="center"
              width="120"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="user"
              label="使用人 "
              align="center"
              width="300"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="sex"
              label="性别 "
              align="center"
              width="60"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="age"
              label="年龄 "
              align="center"
              width="60"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="hospitalName"
              label="手术机构 "
              align="center"
              width="300"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="hospitalAddress"
              label="机构地址 "
              align="center"
              width="420"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="appointmentDate"
              label="预约日期 "
              align="center"
              width="240"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="cartonCode"
              label="箱码"
              align="center"
              width="240"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="activateCode"
              label="激活码"
              align="center"
              width="240"
            ></el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="lastSigner"
              label="签收单位"
              align="center"
              width="300"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="signTime"
              label="签收日期"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="price"
              label="单价"
              align="center"
              width="60"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.price === '' ? '---' : scope.row.price
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="activateStatus"
              label="激活状态"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="activateTime"
              label="激活日期"
              align="center"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="productId"
              label="操作"
              align="center"
              width="120"
              v-if="r_show"
            >
              <template slot-scope="scope">
                <span class="loseContro" @click="getReport(scope.row)"
                  >生成报告</span
                >
              </template>
            </el-table-column>
          </el-table>

          <pagination
            :currentPage="currentPage"
            :total="total"
            :limit="limit"
            :small="true"
            :numberSize="numberSize"
            @handleCurrentChange="handleCurrentChange"
            style="margin:15px 50px;"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="追踪报告"
      :visible.sync="dialogVisible"
      center
      width="620px"
    >
      <div ref="cutImageBox" class="cutImg" style="display:block">
        <el-steps direction="vertical">
          <el-step
            v-for="(item, index) in stepGroups"
            :title="item.stepName"
            :icon="item.iconType"
            :key="index"
          >
            <template slot="description">
              <div>
                <div v-if="item.stepName === '已使用'">
                  <p>{{ item.user }}</p>
                  <p>{{ item.address }}</p>
                </div>

                <p>{{ item.stepContent }}</p>
                <p>{{ item.stepTime }}</p>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>

      <div style="text-align: center;">
        <el-button @click="saveImg" type="primary" plain>保存</el-button>
        <el-button @click="quitNow" type="primary" plain>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import pagination from '../components/Pagenation'
import html2Canvas from 'html2canvas'
import '../assets/icon/iconfont.css'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      currentPage: 1,
      limit: 100,
      total: 0,
      numberSize: 0,
      materialModelGroup: [],
      tableDataSelections: [],
      tableData: [],
      search: '',
      tabNames: [
        { label: '全部', name: 'wait' },
        { label: '已激活', name: 'backProduct' }
      ],
      activeName: 'wait',
      dialogVisible: false,
      stepGroups: [],
      s_show: false,
      i_show: false,
      r_show: false,
      key_index: '0',
      unsed: false,
      materialId: '',
      loading: true,
      defaultColr: 'info',
      btnStatu: true
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {
      this.tableData = []
      this.searchAll(
        this.currentPage,
        this.limit,
        '/productTrace/listData',
        '&type=',
        this.key_index,
        '&value=',
        this.search,
        '&materialId=',
        this.materialId,
        '',
        ''
      ).then(res => {
        console.log(res)

        if (res.status === 200) {
          this.loading = false
          this.tableData = res.data.object.list
          this.getDataList(res.data.object.total)
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },

    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true
    },
    selectionChangeHandle(selection) {
      this.tableDataSelections = []
      this.numberSize = selection.length
      // this.btnShow = false
      for (let i = 0; i < selection.length; i++) {
        this.tableDataSelections.push(selection[i].productId)
      }
      if (selection.length > 0) {
        this.defaultColr = 'primary'
        this.btnStatu = false
      } else {
        this.defaultColr = 'info'
        this.btnStatu = true
      }
    },
    getDataList(total) {
      this.total = total
    },
    handleCurrentChange(val) {
      this.loading = true
      this.currentPage = val
      this.initData()
    },

    handleClick(tab, event) {
      this.loading = true
      if (tab.index === '1') {
        this.key_index = '1'
        this.unsed = true
      } else {
        this.key_index = '0'
        this.unsed = false
      }
      this.initData()
    },
    fnFilterChangeInit(filter) {
      console.log(filter)
      this.materialId = filter.materialModel[0]
      this.initData()
    },
    getRowKey(row) {
      return row.productId
    },
    getReport(row) {
      this.dialogVisible = true
      this.stepGroups = []
      this.sendId(row.productId, '/productTrace/generateReport').then(res => {
        console.log(res)

        for (let i = 0; i < res.data.object.length; i++) {
          if (res.data.object[i].productStatus === '已发货') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'iconfont icon-report_yfc',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '发货时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          } else if (res.data.object[i].productStatus === '已退货') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'iconfont icon-report_yth',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '退货时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          } else if (res.data.object[i].productStatus === '已签收') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'iconfont icon-report_yqs',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '签收时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          } else if (res.data.object[i].productStatus === '已激活') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'iconfont icon-report_yjh',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '激活时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          } else if (res.data.object[i].productStatus === '已使用') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'iconfont icon-repoort_used',
              stepContent: res.data.object[i].opUser,
              stepTime: '使用时间：' + res.data.object[i].createTime,
              user: res.data.object[i].user,
              address: res.data.object[i].address
              // this.translateTime(res.data.object[i].createTime.time)
            })
          }
        }
        this.stepGroups.reverse()
        console.log(res.data.object)
      })
    },
    saveImg() {
      this.$prompt(
        '请输入图片名称',
        { inputValue: '追踪报告' + Date.parse(new Date()) },
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: '', // 校验正则
          inputErrorMessage: '' // 错误提示信息
        }
      )
        .then(({ value }) => {
          html2Canvas(this.$refs.cutImageBox, {
            allowTaint: true,
            taintTest: false,
            backgroundColor: '#fff',
            scale: 1.5 // 缩放
          }).then(canvas => {
            const image = canvas
              .toDataURL('image/png')
              .replace('image/png', 'image/octet-stream')
            const userAgent = navigator.userAgent
            // 兼容ie
            if (userAgent.includes('Trident')) {
              const arr = image.split(',')
              const mime = arr[0].match(/:(.*?);/)[1]
              const bstr = atob(arr[1])
              let n = bstr.length
              const u8arr = new Uint8Array(n)
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
              }
              window.navigator.msSaveBlob(
                new Blob([u8arr], { type: mime }),
                `${value}.jpg`
              )
            } else {
              const imgData = canvas.toDataURL('image/jpeg')
              this.fileDownload(imgData, value)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      // this.dialogVisible = false
    },
    // 下载截图图片
    fileDownload(downloadUrl, downloadName) {
      const aLink = document.createElement('a')
      aLink.style.display = 'none'
      aLink.href = downloadUrl
      aLink.download = `${downloadName}.jpg`
      document.body.appendChild(aLink)
      aLink.click()
      document.body.removeChild(aLink)
    },
    quitNow() {
      this.dialogVisible = false
      console.log('取消')
    },
    translateTime(times) {
      const date = new Date(times)
      const Y = date.getFullYear() + '-'
      const M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '统计') {
          this.s_show = true
        } else if (item.rightName === '导出') {
          this.i_show = true
        } else if (item.rightName === '报告') {
          this.r_show = true
        }
      })
    },
    getType() {
      this.getSums('/material/listAboutSelf').then(res => {
        for (let i = 0; i < res.data.object.length; i++) {
          this.materialModelGroup.push({
            text: res.data.object[i].materialModel,
            value: res.data.object[i].id
          })
        }
      })
    },
    searchEnterFun() {
      this.loading = true
      this.initData()
    },
    exportClientInfoExcel() {
      const ids = this.tableDataSelections.join(',')
      let names = ''
      if (this.key_index === '0') {
        names = '产品全部数据导出'
      } else {
        names = '产品已激活数据导出'
      }
      const that = this
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel(
        { productIds: ids, type: this.key_index },
        '/productTrace/export'
      ).then(response => {
        if (response.status === 200) {
          console.log(response.data)
          loading.close()
          this.$refs.filterTable[Number(this.key_index)].clearSelection()
          that.downloadFile(response.data, names)
        }
      })
    },
    exportAllExcel() {
      let names = ''
      if (this.key_index === '0') {
        names = '产品全部数据导出'
      } else {
        names = '产品已激活数据导出'
      }
      const that = this
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel(
        { value: this.search, type: this.key_index },
        '/productTrace/exportInAll'
      ).then(response => {
        if (response.status === 200) {
          console.log(response.data)
          loading.close()
          that.downloadFile(response.data, names)
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData()
    this.initBtn()
    this.getType()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
.el-step {
  padding: 5px 100px;
}
.container {
  margin: 25px 30px;
  width: 97%;
}
.find {
  width: 100%;
  background-color: #fff;
}
.btn_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.btngroups {
  text-align: center;
}
.btngroups button {
  margin: 15px 20px;
}
.loseContro {
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(30, 114, 247, 1);
  cursor: pointer;
}
</style>
