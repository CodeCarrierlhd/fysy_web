<!-- 库存管理 -->
<template>
  <div class="container">
    <div style="padding:10px 20px">
      <div class="t_header">
        <div style="display:flex">
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
          <el-button
            @click="loseData"
            :type="defaultColr"
            :disabled="btnStatu"
            v-if="b_show"
            >拆解</el-button
          >
        </div>
        <div style="display:flex">
          <div style="margin-right: 10px;">
            <span style="margin-right: 10px;">账号</span>
            <el-select
              v-model="a_acount"
              placeholder="请选择"
              @change="acountChange"
            >
              <el-option
                v-for="item in acounts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <el-table
        ref="filterTable"
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
        height="700"
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
          align="center"
          label="序号"
          fixed
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
          column-key="p_model"
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
        <el-table-column prop="spec" label="规格 " align="center" width="60">
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
          prop="instockTime"
          label="入库时间"
          align="center"
          width="240"
        ></el-table-column>
        <el-table-column
          prop="producer"
          label="生产厂家"
          align="center"
          width="300"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="b_show" width="120">
          <template slot-scope="scope">
            <span class="loseContro" @click="loseContro(scope.row)">拆解</span>
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
      />
      <el-dialog
        title="拆解编码"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        center
        top="35vh"
        width="620px"
      >
        <div style="text-align:center">
          <p style="padding:0 0 45px 0">确定拆解编码，数据将无法找回！</p>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="breakPro">确 定</el-button>
        </div>
      </el-dialog>
    </div>
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
      tableDataSelections: [],
      dialogVisible: false,
      getId: 0,
      acounts: [],
      a_acount: '',
      btnShow: true,
      defaultColr: 'info',
      btnStatu: true,
      s_show: false,
      b_show: false,
      e_show: false,
      loading: true,
      currentRow: null
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {
      this.searchAll(
        this.currentPage,
        this.limit,
        '/inventory/listData',
        '&materialId=',
        '',
        '&selectedOpIds=',
        '',
        '&uid=',
        this.a_acount,
        '&value=',
        this.search,
        '&pageType=',
        '1'
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
    selectionChangeHandle(selection) {
      console.log(selection)
      this.numberSize = selection.length
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
    fnFilterChangeInit(filter) {
      console.log(filter)
      const arr = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].p_model === filter.p_model[0]) {
          arr.push(this.tableData[i])
        }
      }
      this.tableData = arr
      this.getDataList()
    },
    getRowKey(row) {
      return row.opId
    },
    loseContro(row) {
      this.dialogVisible = true
      this.getId = row.opId
    },
    breakPro() {
      this.loading = true
      this.productDone(this.getId, '', '/inventory/dismantle').then(res => {
        if (res.data.code === 200) {
          this.initData()
          this.$refs.filterTable.clearSelection()
          this.$notify({
            title: '状态',
            message: '产品拆解成功',
            position: 'top-right',
            duration: 2000
          })
          this.dialogVisible = false
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    loseData() {
      this.loading = true
      const ids = this.tableDataSelections.join(',')
      this.productDone(ids, '', '/inventory/dismantle').then(res => {
        if (res.data.code === 200) {
          this.initData()
          this.$refs.filterTable.clearSelection()
          this.$notify({
            title: '状态',
            message: '产品拆解成功',
            position: 'top-right',
            duration: 2000
          })
        }
      })
      console.log('多个拆解')
    },
    searchEnterFun() {
      this.loading = true
      this.searchAll(
        1,
        this.limit,
        '/inventory/listData',
        '&materialId=',
        '',
        '&selectedOpIds=',
        '',
        '&uid=',
        this.a_acount,
        '&value=',
        this.search,
        '&pageType=',
        '1'
      ).then(res => {
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
    getAcounts() {
      this.getSums('/user/selfAndChild').then(res => {
        for (let i = 0; i < res.data.object.length; i++) {
          this.acounts.push({
            label: res.data.object[i].username,
            value: res.data.object[i].id
          })
        }
        this.a_acount = res.data.object[0].id
        this.initData()
      })
    },
    acountChange(val) {
      this.loading = true
      this.a_acount = val
      this.initData()
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '查询') {
          this.s_show = true
        } else if (item.rightName === '导出') {
          this.e_show = true
        } else if (item.rightName === '拆解') {
          this.b_show = true
        }
      })
    },
    exportClientInfoExcel() {
      const ids = this.tableDataSelections.join(',')
      const that = this
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel({ opIds: ids }, '/inventory/export').then(
        response => {
          if (response.status === 200) {
            loading.close()
            this.$refs.filterTable.clearSelection()
            that.downloadFile(response.data, '库存数据导出')
          }
        }
      )
    },
    exportAllExcel() {
      const that = this
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel(
        { uid: that.a_acount, value: that.search },
        '/inventory/exportInAll'
      ).then(response => {
        if (response.status === 200) {
          loading.close()
          that.downloadFile(response.data, '库存数据导出')
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getType()
    this.getAcounts()
    this.initBtn()
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
  background-color: #fff;
}

.loseContro {
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(30, 114, 247, 1);
  cursor: pointer;
}
.t_header {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 10px;
}
</style>
