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
              @click="exportClientInfoExcel()"
              type="primary"
              size="medium"
              v-if="e_show"
              ><i class="el-icon-download"></i>导出</el-button
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
          :data="tableData"
          @filter-change="fnFilterChangeInit"
          @selection-change="selectionChangeHandle"
          :row-key="getRowKey"
          style="width: 100%;margin:10px 20px;"
          border
          height="600"
        >
          <el-table-column class-name="t_header">
            <el-table-column
              type="selection"
              width="100"
              align="center"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column
              prop="materialType"
              label="产品类别"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="materialCode"
              label="产品编号"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="materialModel"
              label="产品型号"
              align="center"
              width="150"
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
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="batchNo"
              label="产品批号 "
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="spec"
              label="规格 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="produceDate"
              label="生产日期 "
              align="center"
              width="100"
            >
            </el-table-column>

            <el-table-column
              prop="expiryDate"
              label="失效日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="cartonCode"
              label="箱码"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="activateCode"
              label="激活码"
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="opUser"
              label="退货人"
              align="center"
              width="200"
              v-if="mark"
            ></el-table-column>
            <el-table-column
              prop="opUser"
              label="操作账户"
              align="center"
              width="100"
              v-else
            ></el-table-column>
            <el-table-column
              prop="returnReason"
              label="退货原因"
              align="center"
              width="200"
              v-if="mark"
            ></el-table-column>

            <el-table-column
              prop="receiver"
              label="接收账户"
              align="center"
              width="100"
              v-else
            ></el-table-column>
            <el-table-column
              prop="opTime"
              label="操作时间"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="producer"
              label="生产厂家"
              align="center"
              width="150"
            >
            </el-table-column>
            <!-- <el-table-column label="取消关联" align="center">
              <span class="loseContro">解绑</span>
            </el-table-column> -->
          </el-table-column>
        </el-table>

        <pagination
          :currentPage="currentPage"
          :total="total"
          :limit="limit"
          :small="true"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
          style="margin:15px 50px;"
        />
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
      key_index: '0'
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

        this.tableData = res.data.object.list
        this.getDataList(res.data.object.total)
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
      this.currentPage = val
      this.initData()
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentPage = 1
    },
    handleClick(tab, event) {
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
      console.log(111)

      this.initData()
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
      this.exportCompanyExcel(
        { opIds: ids, status: this.key_index },
        '/stock/export'
      ).then(response => {
        if (response.status === 200) {
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
  margin: 40px 60px;
  width: 95%;
}
.find {
  width: 100%;
  background-color: #fff;
}
.btn_header {
  display: flex;
  justify-content: space-between;
  margin: 10px 20px;
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
