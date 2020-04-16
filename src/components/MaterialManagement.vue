<!-- 物料管理 -->
<template>
  <div style="width: 100%;">
    <el-table
      ref="filterTable"
      :data="tableData.slice((currentPage - 1) * limit, currentPage * limit)"
      @filter-change="fnFilterChangeInit"
      @selection-change="selectionChangeHandle"
      @cell-dblclick="celledit"
      :row-key="getRowKey"
      style="width: 95%;margin:40px 60px;"
      border
    >
      <el-table-column class-name="t_header">
        <template
          slot="header"
          style="display:flex;justify-content: space-between;"
          header-align="center"
        >
          <div v-if="s_show">
            <el-input
              v-model="search"
              style="width:600px;border-radius:4px;margin-right:8px"
              placeholder="输入关键字搜索"
            />
            <el-button @click="searchEnterFun()" type="primary"
              ><i class="el-icon-search"></i> 搜索</el-button
            >
          </div>

          <div>
            <el-button @click="addRow()" type="primary" v-if="a_show"
              ><i class="el-icon-plus"></i> 新增</el-button
            >
            <el-button
              @click="batchDelete(tableDataSelections)"
              type="primary"
              v-if="d_show"
              ><i class="el-icon-delete"></i>删除</el-button
            >
          </div>
        </template>
        <el-table-column
          type="selection"
          width="100"
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          prop="p_number"
          label="产品编号"
          edit="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.p_number.edit"
              ref="p_number"
              v-model="scope.row.p_number.value"
              @blur="scope.row.p_number.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.p_number.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="p_type"
          label="产品类别"
          edit="false"
          align="center"
          width="160"
          :filter-multiple="false"
          :filters="p_typeGroup"
          :filter-method="filterTag"
          column-key="p_type"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.p_type.value"
              v-if="scope.row.p_type.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.p_type.edit = false
                  changeCell(value, scope.row, scope.$index, 'p_type')
                }
              "
            >
              <el-option
                v-for="item in productGroups"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.p_type.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="p_model"
          label="产品型号"
          width="100"
          edit="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.p_model.edit"
              ref="'p_model'"
              v-model="scope.row.p_model.value"
              @blur="scope.row.p_model.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.p_model.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="p_size"
          label="规格 "
          align="center"
          width="160"
          edit="false"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.p_size.edit"
              ref="p_size"
              v-model="scope.row.p_size.value"
              @blur="scope.row.p_size.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.p_size.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="p_vendor"
          label="生产商"
          edit="false"
          align="center"
          width="260"
          :filter-multiple="false"
          :filters="p_vendorGroup"
          :filter-method="filterTag"
          column-key="p_vendor"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.p_vendor.value"
              v-if="scope.row.p_vendor.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.p_vendor.edit = false
                  changeCell(value, scope.row, scope.$index, 'p_vendor')
                }
              "
            >
              <el-option
                v-for="item in vendorGroups"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.p_vendor.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="p_statu"
          align="center"
          label="状态"
          width="85"
          :filter-multiple="false"
          :column-key="'p_statu'"
          :filters="status"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="p_date"
          label="上市日期"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-if="scope.row.p_date.edit"
              v-model="scope.row.p_date.value"
              ref="p_date"
              type="date"
              value-format="yyyy-MM-dd"
              @blur="scope.row.p_date.edit = false"
            >
            </el-date-picker>
            <span v-else>{{ scope.row.p_date.value }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isSet"
              size="mini"
              @click="handleSave(scope.$index, scope.row)"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination
      :currentPage="currentPage"
      :total="total"
      :limit="limit"
      :small="true"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
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
      tableData: [],
      options: {
        tag: undefined
      },
      search: '',
      productGroups: [
        {
          value: '鼻假体',
          label: '鼻假体'
        },
        {
          value: '下巴假体',
          label: '下巴假体'
        }
      ],
      p_typeGroup: [
        { text: '鼻假体', value: '鼻假体' },
        { text: '下巴假体', value: '下巴假体' }
      ],
      p_vendorGroup: [
        { text: '上海东月医疗', value: '上海东月医疗' },
        {
          text: '上海东月医疗保健用品有限公司',
          value: '上海东月医疗保健用品有限公司'
        }
      ],
      vendorGroups: [
        {
          value: '上海东月医疗',
          label: '上海东月医疗'
        },
        {
          value: '上海东月医疗保健用品有限公司',
          label: '上海东月医疗保健用品有限公司'
        }
      ],
      // 状态
      status: [
        { text: '上市', value: '上市' },
        { text: '已下市', value: '已下市' }
      ],
      currentPage: 1,
      limit: 10,
      total: 0,
      isCheck: true,
      s_show: false,
      a_show: false,
      d_show: false,
      e_show: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    init(options) {
      console.log(options)
      const newData = []
      // 筛选时 应请求一次数据接口拿到表单数据将以前的数据清空再进行条件筛选
      this.tableData = []
      this.makeData()
      if (this.options.tag) {
        this.tableData.filter(item => {
          if (item.p_type.value === this.options.tag) {
            newData.push(item)
          } else if (item.p_vendor.value === this.options.tag) {
            newData.push(item)
          } else if (item.p_statu.value === this.options.tag) {
            newData.push(item)
          }
        })
        this.tableData = newData
        this.getStatu()
        this.getDataList()
        // this.currentPage = Math.ceil(this.total / this.limit);
      }
    },
    makeData() {
      for (let i = 0; i < 30; i++) {
        this.tableData.push({
          p_model: 'a' + i,
          p_size: 'DY10-204K' + i,
          p_number: Math.floor(Math.random() * 10000 + 1),
          p_type: i % 2 === 0 ? '鼻假体' : '下巴假体',
          p_vendor:
            i % 3 === 0 ? '上海东月医疗' : '上海东月医疗保健用品有限公司',
          p_date: '2019-12=' + i,
          p_statu: i % 2 === 0 ? '上市' : '已下市',
          isSet: false
        })
      }
      this.formatData()
      this.getDataList()
    },
    formatData() {
      this.tableData.forEach(item => {
        for (const key in item) {
          if (key !== 'isSet') {
            item[key] = {
              value: item[key],
              edit: false
            }
          }
        }
      })
    },
    selectionChangeHandle(val) {
      console.log(val)
      this.tableDataSelections = val
    },
    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true
    },
    // table 的方法
    // filter 的格式  obj { column-key: Array }
    // Array[0] 筛选的值
    fnFilterChangeInit(filter) {
      console.log(filter)
      // do something
      if (filter.p_type) {
        this.options.tag =
          filter.p_type[0] === undefined ? '' : filter.p_type[0]
      } else if (filter.p_vendor) {
        console.log(filter.p_vendor[0])
        this.options.tag =
          filter.p_vendor[0] === undefined ? '' : filter.p_vendor[0]
      } else if (filter.p_statu) {
        console.log(filter.p_statu)
        this.options.tag =
          filter.p_statu[0] === undefined ? '' : filter.p_statu[0]
      }
      this.init(this.options)
    },
    // 单元格双击事件
    celledit(row, column, cell, event) {
      row.isSet = true
      if (row[column.property]) {
        row[column.property].edit = true
      }
    },
    changeCell(value, item, index, type) {
      console.log(value, item, index, type)
    },
    getDataList() {
      this.total = this.tableData.length
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // this.getDataList();
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentPage = 1
      // this.getDataList();
    },
    // 表格新增行
    addRow() {
      this.tableData.push({
        p_number: { value: '', edit: true },
        p_model: { value: '', edit: true },
        p_size: { value: '', edit: true },
        p_statu: { value: '', edit: true },
        p_vendor: { value: '', edit: true },
        p_date: { value: '', edit: true },
        p_type: { value: '', edit: true },
        isSet: true
      })

      this.getDataList()
    },
    // 删除选中数据（单纯实现前端删除）
    batchDelete(selections) {
      console.log(selections)
      if (selections.length > 0) {
        for (let i = 0; i < selections.length; i++) {
          for (let y = 0; y < this.tableData.length; y++) {
            if (this.tableData[y] === selections[i]) {
              this.tableData.splice(y, 1)
              this.getDataList()
              break
            }
          }
        }
      }
    },
    pwdChange(row, index) {
      console.log(row, index)
    },
    // 保存提交
    handleSave(index, row) {
      console.log(index, row)
      return (row.isSet = !row.isSet)
    },
    changePassword(index, row) {
      this.centerDialogVisible++
    },
    getStatu() {
      this.tableData.map(item => {
        if (item.p_statu.value === '上市') {
          this.$set(item, 'isCheck', true) // 这里，给对象添加属性，用$set方法。
        } else {
          this.$set(item, 'isCheck', false) // 这里，给对象添加属性，用$set方法。
        }
        return item
      })
    },
    getRowKey(row) {
      return row.p_id
    },
    searchEnterFun() {
      console.log('搜索')
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      btnArr.forEach(item => {
        if (item.rightName === '新增') {
          // this.$set(this.btnArr, 'a_show', true)
          this.a_show = true
        } else if (item.rightName === '删除') {
          this.d_show = true
        } else if (item.rightName === '编辑') {
          this.e_show = true
        } else if (item.rightName === '查询') {
          this.s_show = true
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.makeData()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getStatu()
    this.initBtn()
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style>
.el-table__header .el-table-column--selection .cell .el-checkbox:after {
  content: '全选';
}
</style>
<style scope>
.cell {
  /* display: flex !important;
  justify-content: space-between; */
  /* padding: 25px 20px; */
  max-height: 110px !important;
}
.t_header > .cell {
  display: flex !important;
  justify-content: space-between;
}
.el-table-filter {
  max-height: 400px;
  overflow: auto;
}
/* .el-table__row {
  height: 60px !important;
} */
</style>
