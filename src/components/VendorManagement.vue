<!-- 生产商管理 -->
<template>
  <div class="container">
    <div style="padding: 25px 20px;">
      <div class="t_header">
        <div v-if="s_show" style="display:flex;margin-right:10px">
          <el-input
            v-model="search"
            prefix-icon="el-icon-search"
            clearable
            style="width:400px;border-radius:4px;margin-right:8px"
            placeholder="输入关键字搜索"
            @clear="clearSearch"
          />
          <el-button @click="searchEnterFun()" type="primary"
            ><i class="el-icon-search"></i>搜索</el-button
          >
        </div>

        <div>
          <el-button @click="addRow()" type="primary" v-if="a_show"
            ><i class="el-icon-plus"></i> 新增</el-button
          >
          <el-button
            @click="batchDelete(tableDataSelections)"
            :type="defaultColr"
            v-if="d_show"
            :disabled="btnStatu"
            ><i class="el-icon-delete"></i>删除</el-button
          >
        </div>
      </div>

      <el-table
        ref="filterTable"
        :data="tableData.slice((currentPage - 1) * limit, currentPage * limit)"
        @filter-change="fnFilterChangeInit"
        @selection-change="selectionChangeHandle"
        @cell-dblclick="celledit"
        :row-key="getRowKey"
        :header-cell-style="{
          fontSize: '15px',
          color: '#000',
          fontWeight: 800,
          background: '#eef1f6',
          padding: '4px'
        }"
        border
        height="680"
        :cell-style="{ padding: '2px' }"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          width="100"
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          prop="producerCode"
          label="生产商编号"
          edit="false"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.producerCode.edit"
              ref="producerCode"
              v-model="scope.row.producerCode.value"
              @blur="scope.row.producerCode.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.producerCode.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="producerName"
          label="生产商名称"
          width="240"
          edit="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.producerName.edit"
              ref="'producerName'"
              v-model="scope.row.producerName.value"
              @blur="scope.row.producerName.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.producerName.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="province"
          label="省份"
          edit="false"
          align="center"
          width="160"
          :filter-multiple="false"
          column-key="province"
          :filters="proviceGroup"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.province.value"
              v-if="scope.row.province.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.province.edit = false
                  changeCell(value, scope.row, scope.$index, 'province')
                }
              "
            >
              <!-- <el-option :key="''" :label="'全部'" :value="''"> </el-option> -->
              <el-option
                v-for="item in provinces"
                :key="item.code"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.province.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市"
          edit="false"
          align="center"
          width="160"
          :filter-multiple="false"
          column-key="city"
          :filters="cityGroup"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.city.value"
              v-if="scope.row.city.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.city.edit = false
                  changeCell(value, scope.row, scope.$index, 'city')
                }
              "
            >
              <!-- <el-option :key="''" :label="'全部'" :value="''"> </el-option> -->
              <el-option
                v-for="item in cities"
                :key="item.code"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.city.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="address"
          label="详细地址"
          align="center"
          edit="false"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.address.edit"
              ref="address"
              v-model="scope.row.address.value"
              @blur="scope.row.address.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.address.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系人"
          edit="false"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.contact.edit"
              ref="contact"
              v-model="scope.row.contact.value"
              @blur="scope.row.contact.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.contact.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          edit="false"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.mobile.edit"
              ref="mobile"
              v-model="scope.row.mobile.value"
              @blur="scope.row.mobile.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.mobile.value }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isSet"
              size="mini"
              @click="handleSave(scope.$index, scope.row)"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="handleDelete(scope.row, scope.$index)"
              v-if="d_show"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :small="true"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        style="padding:10px 0"
      />
      <del-dialog
        :keyNumber="changeKey"
        @onLoadData="onLoadData"
        :headerTitle="`删除生产商`"
        :ids="delArr"
        :delPath="`producer/delete`"
        :delContent="`确定删除生产商，数据无法找回！`"
      >
      </del-dialog>
      <el-dialog
        title="错误提示"
        :visible.sync="errorVisible"
        width="400px"
        :before-close="handleClose"
      >
        <span>所有内容不能为空</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="errorVisible = false">取 消</el-button>
          <el-button type="primary" @click="errorVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import provinceCity from '../commont/js/cities.json'
import pagination from '../components/Pagenation'
import DelDialog from './DelDialog'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination, DelDialog },
  data() {
    // 这里存放数据
    return {
      tableData: [],
      options: {
        proTag: '',
        cityTag: ''
      },
      search: '',
      proviceGroup: [],
      cityGroup: [],
      cities: [],
      provinces: [],
      typeMark: '',
      currentPage: 1,
      limit: 10,
      total: 0,
      s_show: false,
      a_show: false,
      d_show: false,
      e_show: false,
      tableDataSelections: [],
      edit: false,
      changeKey: 0,
      delArr: '',
      btnStatu: true,
      defaultColr: 'info',
      errorVisible: false,
      addOne: true,
      loading: true
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    cities(val, oldVal) {
      this.cityGroup = []
      for (let index = 0; index < val.length; index++) {
        this.cityGroup.push({
          text: val[index].name,
          value: val[index].name
        })
      }
    }
  },
  // 方法集合
  methods: {
    makeData() {
      this.tableData = []
      this.listData(this.currentPage, this.limit, '/producer/listData').then(
        res => {
          if (res.status === 200) {
            this.loading = false
            const vdata = res.data.object.list
            for (let i = 0; i < vdata.length; i++) {
              this.tableData.push({
                producerName: vdata[i].producerName,
                address: vdata[i].address,
                producerCode: vdata[i].producerCode,
                province: vdata[i].province,
                city: vdata[i].city,
                mobile: vdata[i].mobile,
                contact: vdata[i].contact,
                isSet: false,
                id: vdata[i].id
              })
            }
            this.formatData()
            this.getDataList(res.data.object.total)
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }
      )
    },
    formatData() {
      this.tableData.forEach(item => {
        for (const key in item) {
          if (key !== 'isSet' && key !== 'id') {
            if (key === 'city') {
              item[key] = {
                value: item[key],
                edit: false,
                type: 'city'
              }
            } else {
              item[key] = {
                value: item[key],
                edit: false
              }
            }
          }
        }
      })
    },
    selectionChangeHandle(selection) {
      console.log(selection)

      this.tableDataSelections = []
      // this.btnShow = false
      for (let i = 0; i < selection.length; i++) {
        this.tableDataSelections.push(selection[i].id)
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
    // table 的方法
    // filter 的格式  obj { column-key: Array }
    // Array[0] 筛选的值
    fnFilterChangeInit(filter) {
      // this.makeData()
      console.log(filter)
      // do something
      if (filter.province) {
        console.log(filter.province[0])
        if (filter.province[0] === undefined) {
          this.cities = []
        } else {
          this.getBeforeData()
          this.provinces.filter(item => {
            if (item.name === filter.province[0]) {
              this.cities = item.cities
            }
          })
        }
        this.options.cityTag = ''
        this.$refs.filterTable.clearFilter()
        this.options.proTag =
          filter.province[0] === undefined ? '' : filter.province[0]
      } else if (filter.city) {
        console.log(filter.city.length)
        this.options.cityTag =
          filter.city[0] === undefined ? '' : filter.city[0]
      }
      this.init(this.options)
    },
    init(options) {
      // 筛选时 应请求一次数据接口拿到表单数据将以前的数据清空再进行条件筛选
      this.valueData(
        this.currentPage,
        this.limit,
        '/producer/listData',
        this.search,
        this.options.proTag,
        this.options.cityTag,
        this.options.typeTag
      ).then(res => {
        console.log(res)

        this.tableData = []
        const vdata = res.data.object.list
        for (let i = 0; i < vdata.length; i++) {
          this.tableData.push({
            producerName: vdata[i].producerName,
            address: vdata[i].address,
            producerCode: vdata[i].producerCode,
            province: vdata[i].province,
            city: vdata[i].city,
            mobile: vdata[i].mobile,
            contact: vdata[i].contact,
            isSet: false,
            id: vdata[i].id
          })
        }
        this.formatData()
        this.getDataList(res.data.object.total)
      })
    },
    // 单元格双击事件
    celledit(row, column, cell, event) {
      if (this.e_show) {
        row.isSet = true
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].id !== row.id) {
            for (const key in this.tableData[i]) {
              // this.tableData[i][key].edit = false
              if (key !== 'id' && key !== 'isSet') {
                // console.log(this.tableData[i][key].edit)
                this.tableData[i][key].edit = false
              } else {
                this.tableData[i].isSet = false
              }
            }
          }
        }
        this.provinces = provinceCity.provinces
        if (row[column.property].type === 'city') {
          for (let i = 0; i < this.provinces.length; i++) {
            if (this.provinces[i].name === row.province.value) {
              this.cities = this.provinces[i].cities
            }
          }
        }
        if (row[column.property]) {
          row[column.property].edit = true
        }
      }
    },
    changeCell(value, item, index, type) {
      for (let i = 0; i < this.provinces.length; i++) {
        if (value === this.provinces[i].name) {
          this.tableData[index].city.value = this.provinces[i].cities[0].name
        }
      }
      if (type === 'province') {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === value) {
            this.cities = this.provinces[i].cities
            // this.tableData[index].city.value = this.provinces[
            //   i
            // ].cities[0].name
          }
        }
      }
    },
    getDataList(total) {
      this.total = total
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentPage = 1
    },
    // 表格新增行
    addRow() {
      if (this.addOne) {
        console.log(this.tableData)

        this.addOne = false
        this.provinces = provinceCity.provinces
        const id = this.tableData[this.tableData.length - 1].id + 1
        this.edit = true
        this.tableData.unshift({
          producerCode: { value: '', edit: true },
          producerName: { value: '', edit: true },
          address: { value: '', edit: true },
          contact: { value: '', edit: true },
          mobile: { value: '', edit: true },
          province: { value: '', edit: true },
          city: { value: '', edit: true },
          id: id,
          isSet: true
        })
        for (let i = 1; i < this.tableData.length; i++) {
          for (const key in this.tableData[i]) {
            // this.tableData[i][key].edit = false
            if (key !== 'id' && key !== 'isSet') {
              // console.log(this.tableData[i][key].edit)
              this.tableData[i][key].edit = false
            } else {
              this.tableData[i].isSet = false
            }
          }
        }
      }
    },
    // 删除选中数据（单纯实现前端删除）
    batchDelete(selections) {
      this.changeKey++
      this.delArr = this.tableDataSelections.join(',')
    },
    pwdChange(row, index) {
      console.log(row, index)
    },
    // 保存提交
    handleSave(index, row) {
      console.log(this.edit)

      const a = {}
      for (const key in row) {
        if (key !== 'isSet') {
          a[key] = row[key].value
        }
      }
      if (row.id !== 0) {
        a.id = row.id
      }
      let nowload = ''
      if (!this.edit) {
        nowload = 'producer/update'
      } else {
        nowload = 'producer/insert'
      }
      for (const key in a) {
        if (a[key] === '') {
          this.errorVisible = true
        }
      }
      if (!this.errorVisible) {
        this.dataChange(a, nowload).then(res => {
          if (res.data.code === 200) {
            this.edit = false
            this.addOne = true
            this.makeData()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
        return (row.isSet = !row.isSet)
      }
    },
    getRowKey(row) {
      return row.id
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

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
    },
    getBeforeData() {
      this.searchData('producer/getSearchData').then(res => {
        // this.provinces = res.data.object.provinces
        // console.log(this.provinces)
        this.proviceGroup = []
        for (let index = 0; index < res.data.object.provinces.length; index++) {
          this.proviceGroup.push({
            text: res.data.object.provinces[index].name,
            value: res.data.object.provinces[index].name
          })
        }
      })
    },
    handleDelete(row, index) {
      if (row.id === this.tableData[this.tableData.length - 1].id + 1) {
        this.tableData.splice(index, 1)
      } else {
        this.changeKey++
        this.delArr = row.id.toString()
      }
      this.addOne = true
      this.edit = false
    },
    searchEnterFun() {
      this.valueData(
        this.currentPage,
        this.limit,
        '/producer/listData',
        this.search,
        '',
        '',
        ''
      ).then(res => {
        this.tableData = []
        const vdata = res.data.object.list
        for (let i = 0; i < vdata.length; i++) {
          this.tableData.push({
            producerName: vdata[i].producerName,
            address: vdata[i].address,
            producerCode: vdata[i].producerCode,
            province: vdata[i].province,
            city: vdata[i].city,
            mobile: vdata[i].mobile,
            contact: vdata[i].contact,
            isSet: false,
            id: vdata[i].id
          })
        }

        this.formatData()
        console.log('查询')
      })
    },
    clearSearch() {
      this.makeData()
    },
    onLoadData() {
      this.$refs.filterTable.clearSelection()
      this.makeData()
    },
    handleClose(done) {
      this.errorVisible = false
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.makeData()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initBtn()
    this.getBeforeData()
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
<style scope>
.cell {
  /* display: flex !important;
  justify-content: space-between; */
  /* padding: 25px 20px; */
  max-height: 46px !important;
}
.el-table-filter {
  max-height: 400px;
  overflow: auto;
}
.t_header {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  width: 100%;
  margin-bottom: 25px;
}

/* .el-table__row {
  height: 60px !important;
} */
</style>
