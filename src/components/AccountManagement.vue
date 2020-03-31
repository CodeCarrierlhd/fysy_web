<!-- 账号管理 -->
<template>
  <div style="width: 100%;">
    <el-table
      :data="tableData.slice((currentPage - 1) * limit, currentPage * limit)"
      border
      @selection-change="selectionChangeHandle"
      @cell-dblclick="celledit"
      @filter-change="statuChange"
      style="width: 95%;margin:40px 60px;"
    >
      <el-table-column class-name="t_header">
        <template
          slot="header"
          style="display:flex;justify-content: space-between;"
          header-align="center"
        >
          <el-input
            v-model="search"
            style="width:600px;border-radius:4px;"
            placeholder="输入关键字搜索"
          />
          <div>
            <el-button @click="addRow()">新增</el-button>
            <el-button @click="batchDelete(tableDataSelections)"
              >删除</el-button
            >
          </div>
        </template>
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="u_account"
          label="登录账号"
          edit="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.u_account.edit"
              ref="u_account"
              v-model="scope.row.u_account.value"
              @blur="scope.row.u_account.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.u_account.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="u_name"
          label="用户昵称"
          edit="false"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.u_name.edit"
              ref="u_name"
              v-model="scope.row.u_name.value"
              @blur="scope.row.u_name.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.u_name.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="u_type"
          label="角色类型 "
          edit="false"
          align="center"
          width="180"
          :filter-multiple="false"
          :column-key="'u_type'"
          :filters="roles"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.u_type.value"
              v-if="scope.row.u_type.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.u_type.edit = false;
                  changeCell(value, scope.row, scope.$index, 'u_type');
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
            <span v-else>{{ scope.row.u_type.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="u_provice"
          label="省份"
          edit="false"
          align="center"
          width="180"
          :filter-multiple="false"
          :column-key="'u_provice'"
          :filters="proviceGroup"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.u_provice.value"
              v-if="scope.row.u_provice.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.u_provice.edit = false;
                  changeCell(value, scope.row, scope.$index, 'u_provice');
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
            <span v-else>{{ scope.row.u_provice.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="u_city"
          label="城市"
          edit="false"
          align="center"
          width="180"
          :filter-multiple="false"
          :column-key="'u_city'"
          :filters="cityGroup"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.u_city.value"
              v-if="scope.row.u_city.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.u_city.edit = false;
                  changeCell(value, scope.row, scope.$index, 'u_city');
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
            <span v-else>{{ scope.row.u_city.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="u_address"
          label="详细地址"
          edit="false"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.u_address.edit"
              ref="u_address"
              v-model="scope.row.u_address.value"
              @blur="scope.row.u_address.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.u_address.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="u_concat"
          label="联系人"
          edit="false"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.u_concat.edit"
              ref="u_concat"
              v-model="scope.row.u_concat.value"
              @blur="scope.row.u_concat.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.u_concat.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="u_phone"
          label="电话"
          edit="false"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.u_phone.edit"
              ref="u_phone"
              v-model="scope.row.u_phone.value"
              @blur="scope.row.u_phone.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.u_phone.value }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="saveStatu"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="changePassword(scope.$index, scope.row)"
              >密码重置</el-button
            >
            <el-button
              v-if="!saveStatu"
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
import pagination from "../components/Pagenation";

import provinceCity from "../commont/js/cities.json";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    pagination
  },
  data() {
    // 这里存放数据
    return {
      tableData: [
        {
          u_account: "12",
          u_name: "222",
          u_address: "223232",
          u_concat: "21321321",
          u_phone: "3213213212321",
          u_provice: "天津市",
          u_city: "天津",
          u_type: "省级管理员"
        }
      ],
      tableDataSelections: [], // 选中的表格数据
      search: "",
      currentPage: 1,
      limit: 10,
      total: 0,
      provinces: [],
      cities: [],
      proviceGroup: [],
      cityGroup: [],
      getFilter: "",
      saveStatu: false,
      roles: [
        {
          value: "全国管理员",
          text: "全国管理员"
        },
        {
          value: "省级管理员",
          text: "省级管理员"
        }
      ],
      roleGroups: [
        {
          value: "全国管理员",
          label: "全国管理员"
        },
        {
          value: "省级管理员",
          label: "省级管理员"
        }
      ]
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    getFilter(val) {
      console.log(val);
      this.cityGroup = [];
      const nowArr = [];
      for (let index = 0; index < this.tableData.length; index++) {
        if (this.tableData[index].u_provice.value === val) {
          nowArr.push(this.tableData[index]);
        } else if (this.tableData[index].u_type.value === val) {
          nowArr.push(this.tableData[index]);
        }
      }
      console.log(nowArr);

      this.total = nowArr.length;
      this.currentPage = Math.ceil(this.total / this.limit);
      for (let i = 0; i < this.provinces.length; i++) {
        if (this.provinces[i].name === val) {
          this.cities = this.provinces[i].cities;
        }
      }
      for (let j = 0; j < this.cities.length; j++) {
        this.cityGroup.push({
          text: this.cities[j].name,
          value: this.cities[j].name
        });
      }
    }
  },
  // 方法集合
  methods: {
    mockTableData1() {
      for (let i = 0; i < 30; i++) {
        this.tableData.push({
          u_account: Math.floor(Math.random() * 10000 + 1),
          u_name: "DY10-204K" + i,
          u_address: i + "个",
          u_concat: i + "a",
          u_phone: "111111" + i,
          u_provice: this.provinces[i + 1].name,
          u_city: this.provinces[i + 1].cities[0].name,
          u_type: i % 2 === 0 ? "全国管理员" : "省级管理员"
        });
      }
      this.formatData();
    },
    formatData() {
      this.tableData.forEach(item => {
        for (const key in item) {
          if (key === "u_provice") {
            item[key] = {
              value: item[key],
              edit: false,
              mark: "provice"
            };
          } else if (key === "u_city") {
            item[key] = {
              value: item[key],
              edit: false,
              mark: "city"
            };
          } else {
            item[key] = {
              value: item[key],
              edit: false
            };
          }
        }
      });
    },
    // 表格新增行
    addRow() {
      this.currentPage = Math.ceil(this.total / this.limit);
      this.saveStatu = true;
      this.tableData.push({
        u_account: { value: "", edit: true },
        u_name: { value: "", edit: true },
        u_address: { value: "", edit: true },
        u_concat: { value: "", edit: true },
        u_phone: { value: "", edit: true },
        u_provice: { value: "", edit: true },
        u_city: { value: "", edit: true },
        u_type: { value: "", edit: true }
      });
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      console.log(val);
      this.tableDataSelections = val;
    },
    // 删除选中数据（单纯实现前端删除）
    batchDelete(selections) {
      console.log(selections);
      if (selections.length > 0) {
        for (let i = 0; i < selections.length; i++) {
          for (let y = 0; y < this.tableData.length; y++) {
            if (this.tableData[y] === selections[i]) {
              this.tableData.splice(y, 1);
              this.getDataList();
              break;
            }
          }
        }
      }
    },
    // 单元格双击事件
    celledit(row, column, cell, event) {
      if (row[column.property]) {
        this.saveStatu = true;
        row[column.property].edit = true;
      }
    },

    filterHandler(value, row, column) {
      // this.getFilter = value;
      // const property = column.property;
      // console.log(row[property].value === value);
      // return row[property].value === value;
      // console.log(this.tableData);
      // for (const key in this.tableData) {
      //   console.log(key);
      //   // if () {
      //   // }
      // }
    },

    changeCell(value, item, index, type) {
      this.cityGroup = [];
      if (type === "u_provice") {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === value) {
            this.cities = this.provinces[i].cities;
            this.tableData[index].u_city.value = this.provinces[
              i
            ].cities[0].name;
          }
        }
      } else {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === item.u_provice.value) {
            this.cities = this.provinces[i].cities;
            for (let j = 0; j < this.cities.length; j++) {
              this.cityGroup.push({
                text: this.cities[j].name,
                value: this.cities[j].name
              });
            }
          }
        }
      }
    },
    getDataList() {
      this.total = this.tableData.length;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.getDataList();
    },
    statuChange(filters) {
      console.log(filters);
      if (filters.u_provice) {
        if (filters.u_provice.length === 0) {
          this.getDataList();
          this.cityGroup = [];
          this.cities = [];
          this.total = this.tableData.length;
        } else {
          this.getCheckData(filters.u_provice[0]);
        }
      } else if (filters.u_type) {
        if (filters.u_type.length === 0) {
          this.total = this.tableData.length;
        }
      } else {
        console.log(filters);
      }
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.tableData.splice(index, 1);
      this.getDataList();
    },
    handleEdit(index, row) {
      console.log(row);

      this.saveStatu = false;
      // for (let index = 0; index < row.length; index++) {
      //   console.log(row[index]);
      // }
      row.u_provice.edit = false;
      row.u_city.edit = false;
      row.u_account.edit = false;
      row.u_name.edit = false;
      row.u_address.edit = false;
      row.u_concat.edit = false;
      row.u_phone.edit = false;
      row.u_type.edit = false;
    },
    changePassword(index, row) {
      console.log(row);
    },
    getCheckData(type) {
      console.log(type);
      // console.log(this.tableData[0].type.value);
      // // const nowData = [];
      // for (let index = 0; index < this.tableData.length; index++) {
      //   if (this.tableData[index].type.value === value[0]) {
      //     console.log(this.tableData[index].type.value);
      //   }
      //   // console.log(nowData);
      //   // this.tableData = nowData;
      // }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.provinces = provinceCity.provinces;
    this.mockTableData1();
    this.getDataList();
    // this.addData();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    for (let index = 0; index < this.provinces.length; index++) {
      this.proviceGroup.push({
        text: this.provinces[index].name,
        value: this.provinces[index].name,
        type: "provice"
      });
    }
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
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
.el-table__row {
  height: 60px !important;
}
</style>
