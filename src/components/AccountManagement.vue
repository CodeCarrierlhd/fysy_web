<!-- 账号管理 -->
<template>
  <div style="width: 100%;">
    <el-table
      ref="filterTable"
      :data="tableData"
      @filter-change="fnFilterChangeInit"
      @selection-change="selectionChangeHandle"
      @cell-dblclick="celledit"
      :row-key="getRowKey"
      style="width: 100%;margin:40px 60px;"
      border
    >
      <el-table-column class-name="t_header">
        <template
          slot="header"
          style="display:flex;justify-content: space-between;"
          header-align="center"
        >
          <div v-if="s_show" style="display:flex">
            <!-- <el-input
              v-model="search"
              prefix-icon="el-icon-search"
              maxlength="20"
              style="width:600px;border-radius:4px;margin-right:8px"
              placeholder="输入关键字搜索"
            /> -->
            <input
              type="text"
              class="newInput"
              placeholder="输入关键字搜索"
              v-model="search"
            />
            <el-button @click="searchEnterFun()" type="primary">搜索</el-button>
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
          prop="account"
          label="登录账号"
          edit="false"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.account.edit"
              ref="account"
              v-model="scope.row.account.value"
              @blur="scope.row.account.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.account.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户昵称"
          width="100"
          edit="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.username.edit"
              ref="'username'"
              v-model="scope.row.username.value"
              @blur="scope.row.username.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.username.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="roleType"
          label="角色类型"
          edit="false"
          align="center"
          width="160"
          :filter-multiple="false"
          :filters="roleTypeGroup"
          :filter-method="filterTag"
          column-key="roleType"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.roleType.value"
              v-if="scope.row.roleType.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.roleType.edit = false
                  changeCell(value, scope.row, scope.$index, 'roleType')
                }
              "
            >
              <el-option
                v-for="item in roleGroups"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.roleType.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
          edit="false"
          align="center"
          width="120"
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
          width="120"
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
              <el-option :key="''" :label="'全部'" :value="''"> </el-option>
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
          width="300"
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
          width="120"
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
          width="120"
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
        <el-table-column align="center" label="操作" width="260">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isSet"
              size="mini"
              @click="handleSave(scope.$index, scope.row)"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="changePassword(scope.$index, scope.row)"
              >密码重置</el-button
            >
            <el-button size="mini" @click="handleDelete(scope.row)"
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
    />
    <my-dialog
      :centerDialogVisible="centerDialogVisible"
      :headerText="headerText"
      :textName="textName"
      :changePwd="changePwd"
      :id="rowId"
    ></my-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import provinceCity from '../commont/js/cities.json'
import pagination from '../components/Pagenation'
import MyDialog from '../components/Dialog'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination, MyDialog },
  data() {
    // 这里存放数据
    return {
      tableData: [],
      options: {
        proTag: '',
        cityTag: '',
        typeTag: ''
      },
      search: '',
      roleGroups: [],
      roleTypeGroup: [],
      proviceGroup: [],
      cityGroup: [],
      cities: [],
      provinces: [],
      currentPage: 1,
      limit: 9,
      total: 0,
      centerDialogVisible: 0,
      headerText: '重置密码',
      textName: '确定重置密码，密码将变为初始密码：111111!',
      changePwd: true,
      rowId: 0,
      s_show: false,
      a_show: false,
      d_show: false,
      e_show: false,
<<<<<<< HEAD
      edit: false,
      tableDataSelections: []
=======
      tableDataSelections: [],
      edit: false
>>>>>>> 24fc3efb833d66bce1a2dda8ac31c199c199a5f0
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
      this.listData(this.currentPage, this.limit, '/user/listData').then(
        res => {
          this.initData(res)
        }
      )
    },
    formatData() {
      this.tableData.forEach(item => {
        for (const key in item) {
          if (key !== 'isSet' && key !== 'id' && key !== 'roleId') {
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
      if (filter.roleType) {
        console.log(filter.roleType[0])
        this.options.typeTag =
          filter.roleType[0] === undefined ? '' : filter.roleType[0]
      } else if (filter.province) {
        console.log(filter.province[0])
        this.getBeforeData()
        this.provinces.filter(item => {
          if (item.name === filter.province[0]) {
            this.cities = item.cities
          }
        })
        this.options.proTag =
          filter.province[0] === undefined ? '' : filter.province[0]
      } else if (filter.city) {
        console.log(filter.city[0])
        this.options.cityTag =
          filter.city[0] === undefined ? '' : filter.city[0]
      }
      this.init(this.options)
    },
    init(options) {
      console.log(options)
      console.log(this.tableData)
      // this.makeData()
      // const newData = []
      this.valueData(
        this.currentPage,
        this.limit,
        '/user/listData',
        this.search,
        this.options.proTag,
        this.options.cityTag,
        this.options.typeTag
      ).then(res => {
        this.initData(res)
      })
    },
    // 单元格双击事件
    celledit(row, column, cell, event) {
      this.edit = true
      if (this.e_show) {
        row.isSet = true
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
      console.log(value, item, index, type)
      if (type === 'province') {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === value) {
            this.cities = this.provinces[i].cities
          }
        }
      }
    },
    getDataList(total) {
      this.total = total
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.makeData()
      this.init(this.options)
    },

    // 表格新增行
    addRow() {
      this.provinces = provinceCity.provinces
      this.tableData.push({
        account: { value: '', edit: true },
        username: { value: '', edit: true },
        address: { value: '', edit: true },
        contact: { value: '', edit: true },
        mobile: { value: '', edit: true },
        province: { value: '', edit: true },
        city: { value: '', edit: true },
        roleType: { value: '', edit: true },
        id: 0,
        isSet: true
      })
    },
    // 删除选中数据（单纯实现前端删除）
    batchDelete(selections) {
      const ids = []
      for (let i = 0; i < this.tableDataSelections.length; i++) {
        ids.push(this.tableDataSelections[i].id)
      }
      const idArr = ids.join(',')
      this.delItem(idArr, 'user/delete').then(res => {
        if (res.data.code === 200) {
          this.makeData()
        }
      })
    },
    pwdChange(row, index) {
      console.log(row, index)
    },
    // 保存提交
    handleSave(index, row) {
      const a = {}
      console.log(row)

      for (const key in row) {
        if (key !== 'isSet') {
          a[key] = row[key].value
        }
      }
      if (row.id !== 0) {
        a.id = row.id
      }

      let nowload = ''
      if (this.edit) {
        nowload = 'user/update'
      } else {
        nowload = 'user/insert'
      }
      console.log(a)

      this.dataChange(a, nowload).then(res => {
        if (res.data.code === 200) {
          this.edit = false
        }
      })
      return (row.isSet = !row.isSet)
    },
    changePassword(index, row) {
      this.centerDialogVisible++
      this.rowId = row.id
    },
    getRowKey(row) {
      return row.id
    },
    searchEnterFun() {
      this.valueData(
        this.currentPage,
        this.limit,
        '/user/listData',
        this.search,
        '',
        '',
        ''
      ).then(res => {
        this.initData(res)
      })
    },
    clearSearch() {
      this.makeData()
    },
    handleDelete(row) {
      console.log(row)

      this.delItem(row.id, 'user/delete').then(res => {
        if (res.data.code === 200) {
          this.makeData()
        }
      })
    },
    getBeforeData() {
      this.searchData('user/getSearchData').then(res => {
        this.provinces = res.data.object.provinces
        this.proviceGroup = []
        for (let index = 0; index < this.provinces.length; index++) {
          this.proviceGroup.push({
            text: this.provinces[index].name,
            value: this.provinces[index].name
          })
        }
        const arr = []
        const brr = []
        for (let i = 0; i < res.data.object.roleList.length; i++) {
          const a = {}
          const b = {}
          a.text = res.data.object.roleList[i]
          a.value = res.data.object.roleList[i]
          b.label = res.data.object.roleList[i]
          b.value = res.data.object.roleList[i]
          arr.push(a)
          brr.push(b)
        }

        this.roleTypeGroup = arr
        this.roleGroups = brr
      })
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)

      btnArr.forEach(item => {
        if (item.rightName === '新增') {
          // this.$set(this.btnArr, 'a_show', true)
          this.a_show = true
        } else if (item.rightName === '删除') {
          this.d_show = true
        } else if (item.rightName === '修改') {
          this.e_show = true
        } else if (item.rightName === '查询') {
          this.s_show = true
        }
      })
    },
    changeValue(e) {
      this.$forceUpdate()
    },
    initData(res) {
      this.tableData = []
      const vdata = res.data.object.list
      for (let i = 0; i < vdata.length; i++) {
        this.tableData.push({
          username: vdata[i].username,
          address: vdata[i].address,
          account: vdata[i].account,
          roleType: vdata[i].roleType,
          province: vdata[i].province,
          city: vdata[i].city,
          mobile: vdata[i].mobile,
          contact: vdata[i].contact,
          id: vdata[i].id,
          roleId: vdata[i].roleId,
          isSet: false
        })
      }
      this.formatData()
      this.getDataList(res.data.object.total)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.makeData()
    this.initBtn()
    this.getBeforeData()
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
.newInput {
  width: 600px;
  border-radius: 4px;
  margin-right: 8px;
  padding: 0 30px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/* .el-table__row {
  height: 60px !important;
} */
</style>
