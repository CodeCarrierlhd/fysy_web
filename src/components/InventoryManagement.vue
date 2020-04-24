<!-- 库存管理 -->
<template>
  <div class="container">
    <div class="t_header">
      <div style="display:flex">
        <div style="display:flex;margin-right:10px" v-if="s_show">
          <el-input
            v-model="search"
            style="border-radius:4px;width:400px;margin-right:10px"
            placeholder="输入关键字搜索"
          />
          <el-button @click="searchEnterFun()" type="primary">搜索</el-button>
        </div>
        <el-button
          @click="exportClientInfoExcel()"
          type="primary"
          size="medium"
          v-if="e_show"
          >导出</el-button
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

        <el-button @click="loseData" type="primary" v-if="b_show"
          >拆解</el-button
        >
      </div>
    </div>
    <el-table
      ref="filterTable"
      :data="tableData"
      @filter-change="fnFilterChangeInit"
      @selection-change="selectionChangeHandle"
      :row-key="getRowKey"
      style="width: 100%;"
      border
      height="700"
    >
      <el-table-column>
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
          column-key="p_model"
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
        <el-table-column prop="spec" label="规格 " align="center" width="80">
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
          prop="producer"
          label="生产厂家"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="b_show">
          <span class="loseContro">拆解</span>
        </el-table-column>
      </el-table-column>
    </el-table>

    <pagination
      :currentPage="currentPage"
      :total="total"
      :limit="limit"
      :small="true"
      @handleCurrentChange="handleCurrentChange"
      style="margin:15px 50px;"
    />
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
      tableDataSelections: [],

      acounts: [],
      a_acount: '',
      btnShow: true,
      s_show: false,
      b_show: false,
      e_show: false,
      columns: [
        { title: '产品类别', key: 'materialType' },
        { title: '产品编号', key: 'materialCode' },
        { title: '产品型号', key: 'materialModel' },
        { title: '序列号', key: 'productNo' },
        { title: '产品批号', key: 'batchNo' },
        { title: '规格', key: 'spec' },
        { title: '生产日期', key: 'produceDate' },
        { title: '失效日期', key: 'expiryDate' },
        { title: '箱码', key: 'cartonCode' },
        { title: '激活码', key: 'activateCode' },
        { title: '生产厂家', key: 'producer' }
      ]
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
        this.tableData = res.data.object.list
        this.getDataList(res.data.object.total)
      })
    },
    selectionChangeHandle(selection, row) {
      console.log(selection)
      for (let i = 0; i < selection.length; i++) {
        this.tableDataSelections.push(selection[i].opId)
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
    loseContro() {
      console.log('解绑')
    },
    loseData() {
      const ids = this.tableDataSelections.join(',')
      console.log(ids)

      this.productDone(ids, '', '/inventory/dismantle').then(res => {
        console.log(res)

        if (res.data.code === 200) {
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tableDataSelections.length; j++) {
              if (this.tableDataSelections[j] === this.tableData[i].opId) {
                this.tableData.splice(i, 1)
              }
            }
          }
          this.$refs.filterTable.clearSelection()
          this.$notify({
            title: '发货状态',
            message: '产品发货成功',
            position: 'top-right',
            duration: 2000
          })
        }
      })
      console.log('多个拆解')
    },
    searchEnterFun() {
      console.log(888)

      this.initData()
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
      this.exportCompanyExcel({ opIds: ids }, '/inventory/export').then(
        response => {
          if (response.status === 200) {
            that.downloadFile(response.data, '库存数据导出')
          }
        }
      )
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
  margin: 40px 60px;
  width: 95%;
}

.btn_header {
  display: flex;
  justify-content: space-between;
  margin: 10px 60px;
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
.t_header {
  display: flex;
  justify-content: space-between;
  padding: 25px 60px;
  background-color: #fff;
}
</style>
