<!-- 入仓管理 -->
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
        <div style="margin:10px 25px">
          <div class="btn_header">
            <div style="display:flex;">
              <div style="display:flex;margin-right:10px">
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
              <el-button
                @click="exportClientInfoExcel"
                :type="defaultColr"
                :disabled="btnStatu"
                size="medium"
                v-if="e_show"
                ><i class="el-icon-download"></i>导出</el-button
              >
              <el-button
                @click="exportAllExcel"
                type="primary"
                size="medium"
                v-if="e_show"
                >一键导出</el-button
              >
            </div>
            <div v-if="i_show">
              <el-button
                @click="makeSure"
                :type="defaultColr"
                :disabled="btnStatu"
                >确认入库</el-button
              >
              <el-button
                @click="refusedProduct"
                :type="defaultColr"
                :disabled="btnStatu"
                >拒绝入库</el-button
              >
            </div>
          </div>
          <el-table
            ref="filterTable"
            v-loading="loading"
            :data="tableData"
            @filter-change="fnFilterChangeInit"
            @selection-change="selectionChangeHandle"
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
          >
            <el-table-column
              type="selection"
              width="60"
              fixed
              align="center"
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
              prop="materialCode"
              label="产品编号"
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
              width="180"
            >
            </el-table-column>

            <el-table-column
              prop="expiryDate"
              label="失效日期"
              align="center"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="cartonCode"
              label="箱码"
              align="center"
              width="240"
            >
            </el-table-column>
            <el-table-column
              prop="activateCode"
              label="激活码"
              align="center"
              width="240"
            ></el-table-column>
            <el-table-column
              prop="opUser"
              label="退货人"
              align="center"
              width="300"
              v-if="mark"
            ></el-table-column>
            <el-table-column
              prop="opUser"
              label="操作账户"
              align="center"
              width="300"
              v-else
            ></el-table-column>
            <el-table-column
              prop="returnReason"
              label="退货原因"
              align="center"
              width="300"
              v-if="mark"
            ></el-table-column>

            <el-table-column
              prop="receiver"
              label="接收账户"
              align="center"
              width="300"
              v-else
            ></el-table-column>
            <el-table-column
              prop="opTime"
              label="操作时间"
              align="center"
              width="240"
            >
            </el-table-column>
            <el-table-column
              prop="producer"
              label="生产厂家"
              align="center"
              width="300"
            >
            </el-table-column>
          </el-table>

          <pagination
            :currentPage="currentPage"
            :total="total"
            :limit="limit"
            :small="true"
            :numberSize="numberSize"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import pagination from '../components/Pagenation'

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
      tableData: [],
      search: '',
      tabNames: [
        { label: '待入仓', name: 'wait' },
        { label: '退货受理', name: 'backProduct' }
      ],
      activeName: 'wait',
      showBtns: false,
      tableDataSelections: [],
      defaultColr: 'info',
      btnStatu: true,
      mark: false,
      i_show: false,
      e_show: false,
      key_index: '0',
      loading: true
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {
      this.codeData(
        this.currentPage,
        this.limit,
        '/stock/listData',
        this.search,
        this.key_index,
        '',
        ''
      ).then(res => {
        console.log(res.data.object)
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
    selectionChangeHandle(selection) {
      console.log(selection)
      this.numberSize = selection.length
      this.tableDataSelections = []
      for (let i = 0; i < selection.length; i++) {
        this.tableDataSelections.push(selection[i].opId)
      }
      if (selection.length > 0) {
        this.defaultColr = 'primary'
        this.btnStatu = false
      } else {
        this.defaultColr = 'info'
        this.btnStatu = true
      }
    },
    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true
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
      this.numberSize = 0
      this.loading = true
      if (tab.index === '1') {
        this.key_index = '1'
        this.mark = true
      } else {
        this.key_index = '0'
        this.mark = false
      }
      this.initData()
    },
    fnFilterChangeInit(filter) {
      console.log(filter.materialModel[0])
      this.codeData(
        this.currentPage,
        this.limit,
        '/stock/listData',
        this.search,
        this.key_index,
        '',
        filter.materialModel[0]
      ).then(res => {
        this.tableData = res.data.object.list
        this.getDataList(res.data.object.total)
      })
    },
    getRowKey(row) {
      return row.opId
    },
    makeSure() {
      console.log(this.key_index)
      this.loading = true
      const ids = this.tableDataSelections.join(',')
      let opStatu = ''
      if (this.key_index === '0') {
        opStatu = '3'
      } else {
        opStatu = '4'
      }
      this.productDone(ids, opStatu, '/stock/sureOrReject').then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$notify({
            title: '已入库',
            message: '产品入库成功',
            position: 'top-right',
            duration: 2000
          })
          this.initData()
          if (this.key_index === '1') {
            this.$refs.filterTable[1].clearSelection()
          } else {
            this.$refs.filterTable[0].clearSelection()
          }
        }
      })
    },
    refusedProduct() {
      this.loading = true
      const ids = this.tableDataSelections.join(',')
      let opStatu = ''
      if (this.key_index === '0') {
        opStatu = '2'
      } else {
        opStatu = '5'
      }
      this.productDone(ids, opStatu, '/stock/sureOrReject').then(res => {
        if (res.data.code === 200) {
          this.$notify({
            title: '已拒绝',
            message: '产品入库失败',
            position: 'top-right',
            duration: 2000
          })
          this.initData()
          if (this.key_index === '1') {
            this.$refs.filterTable[1].clearSelection()
          } else {
            this.$refs.filterTable[0].clearSelection()
          }
        }
      })
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '入仓') {
          this.i_show = true
        } else if (item.rightName === '导出') {
          this.e_show = true
        }
      })
    },
    searchEnterFun() {
      this.codeData(
        1,
        this.limit,
        '/stock/listData',
        this.search,
        this.key_index,
        '',
        ''
      ).then(res => {
        console.log(res.data.object)
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
    exportClientInfoExcel() {
      const ids = this.tableDataSelections.join(',')
      let names = ''
      if (this.key_index === '0') {
        names = '待入仓数据导出'
      } else {
        names = '退货数据导出'
      }
      const that = this
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel(
        { opIds: ids, pageType: this.key_index },
        '/stock/export'
      ).then(response => {
        if (response.status === 200) {
          loading.close()
          that.$refs.filterTable[Number(that.key_index)].clearSelection()
          that.downloadFile(response.data, names)
        }
      })
    },
    exportAllExcel() {
      let names = ''
      if (this.key_index === '0') {
        names = '待入仓数据导出'
      } else {
        names = '退货数据导出'
      }
      const that = this
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel(
        { value: this.search, pageType: this.key_index },
        '/stock/exportInAll'
      ).then(response => {
        if (response.status === 200) {
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
/* .el-tabs >>> .el-tabs__content {
  width: 96% !important;
} */
</style>
