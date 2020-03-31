<!-- 生产商管理 -->
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
          prop="v_number"
          label="生产商编号"
          edit="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.v_number.edit"
              ref="v_number"
              v-model="scope.row.v_number.value"
              @blur="scope.row.v_number.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.v_number.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="v_provice"
          label="省份"
          edit="false"
          align="center"
          width="180"
          :filter-multiple="false"
          :column-key="'v_provice'"
          :filters="proviceGroup"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.v_provice.value"
              v-if="scope.row.v_provice.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.v_provice.edit = false;
                  changeCell(value, scope.row, scope.$index, 'v_provice');
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
            <span v-else>{{ scope.row.v_provice.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="v_city"
          label="城市"
          edit="false"
          align="center"
          width="180"
          :filter-multiple="false"
          :column-key="'v_city'"
          :filters="cityGroup"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.v_city.value"
              v-if="scope.row.v_city.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.v_city.edit = false;
                  changeCell(value, scope.row, scope.$index, 'v_city');
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
            <span v-else>{{ scope.row.v_city.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="v_name"
          label="生产商名称"
          edit="false"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.v_name.edit"
              ref="v_name"
              v-model="scope.row.v_name.value"
              @blur="scope.row.v_name.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.v_name.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="v_address"
          label="详细地址"
          edit="false"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.v_address.edit"
              ref="v_address"
              v-model="scope.row.v_address.value"
              @blur="scope.row.v_address.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.v_address.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="v_concat"
          label="联系人"
          edit="false"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.v_concat.edit"
              ref="v_concat"
              v-model="scope.row.v_concat.value"
              @blur="scope.row.v_concat.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.v_concat.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="v_phone"
          label="电话"
          edit="false"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.v_phone.edit"
              ref="v_phone"
              v-model="scope.row.v_phone.value"
              @blur="scope.row.v_phone.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.v_phone.value }}</span>
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
          v_number: "12",
          v_name: "222",
          v_address: "223232",
          v_concat: "21321321",
          v_phone: "3213213212321",
          v_provice: "天津市",
          v_city: "天津"
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
      saveStatu: false
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    getFilter(val) {
      this.cityGroup = [];
      const proviceArr = [];
      for (let index = 0; index < this.tableData.length; index++) {
        if (this.tableData[index].v_provice.value === val) {
          proviceArr.push(this.tableData[index]);
        }
      }
      this.total = proviceArr.length;
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
          v_number: Math.floor(Math.random() * 10000 + 1),
          v_name: "DY10-204K" + i,
          v_address: i + "个",
          v_concat: i + "a",
          v_phone: "111111" + i,
          v_provice: this.provinces[i + 1].name,
          v_city: this.provinces[i + 1].cities[0].name
        });
      }
      this.formatData();
    },
    formatData() {
      this.tableData.forEach(item => {
        for (const key in item) {
          if (key === "v_provice") {
            item[key] = {
              value: item[key],
              edit: false,
              mark: "provice"
            };
          } else if (key === "v_city") {
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
        v_number: { value: "", edit: true },
        v_name: { value: "", edit: true },
        v_address: { value: "", edit: true },
        v_concat: { value: "", edit: true },
        v_phone: { value: "", edit: true },
        v_provice: { value: "", edit: true },
        v_city: { value: "", edit: true }
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
      this.getFilter = value;
      const property = column.property;
      return row[property].value === value;
    },

    changeCell(value, item, index, type) {
      this.cityGroup = [];
      if (type === "v_provice") {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === value) {
            this.cities = this.provinces[i].cities;
            this.tableData[index].v_city.value = this.provinces[
              i
            ].cities[0].name;
          }
        }
      } else {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === item.v_provice.value) {
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
      if (filters.v_provice) {
        if (filters.v_provice.length === 0) {
          this.getDataList();
          this.cityGroup = [];
          this.cities = [];
          this.total = this.tableData.length;
        }
      } else {
        console.log(2);
      }
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.tableData.splice(index, 1);
      this.getDataList();
    },
    handleEdit(index, row, column) {
      console.log(row);

      this.saveStatu = false;
      // for (let index = 0; index < row.length; index++) {
      //   console.log(row[index]);
      // }
      row.v_provice.edit = false;
      row.v_city.edit = false;
      row.v_number.edit = false;
      row.v_name.edit = false;
      row.v_address.edit = false;
      row.v_concat.edit = false;
      row.v_phone.edit = false;
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
