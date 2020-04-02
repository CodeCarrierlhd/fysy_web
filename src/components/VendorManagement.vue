<!-- 账号管理 -->
<template>
  <div style="width: 100%;">
    <el-table
      ref="filterTable"
      :data="tableData.slice((currentPage - 1) * limit, currentPage * limit)"
      @filter-change="fnFilterChangeInit"
      @selection-change="selectionChangeHandle"
      @cell-dblclick="celledit"
      style="width: 95%;margin:40px 60px;"
      border
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
          prop="v_name"
          label="生产商名称"
          width="140"
          edit="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.v_name.edit"
              ref="'v_name'"
              v-model="scope.row.v_name.value"
              @blur="scope.row.v_name.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.v_name.value }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="u_provice"
          label="省份"
          edit="false"
          align="center"
          width="160"
          :filter-multiple="false"
          column-key="u_provice"
          :filters="proviceGroup"
          :filter-method="filterTag"
          filter-placement="bottom-end"
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
          width="160"
          :filter-multiple="false"
          column-key="u_city"
          :filters="cityGroup"
          :filter-method="filterTag"
          filter-placement="bottom-end"
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
              <el-option :key="''" :label="'全部'" :value="''"> </el-option>
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
          prop="v_adress"
          label="详细地址"
          align="center"
          width="220"
          edit="false"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.v_adress.edit"
              ref="v_adress"
              v-model="scope.row.v_adress.value"
              @blur="scope.row.v_adress.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.v_adress.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="v_concat"
          label="联系人"
          edit="false"
          width="160"
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
          width="180"
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
import provinceCity from "../commont/js/cities.json";
import pagination from "../components/Pagenation";

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
      search: "",
      roleGroups: [
        {
          value: "全国管理员",
          label: "全国管理员"
        },
        {
          value: "省级管理员",
          label: "省级管理员"
        }
      ],
      u_typeGroup: [
        { text: "全国管理员", value: "全国管理员" },
        { text: "省级管理员", value: "省级管理员" }
      ],
      proviceGroup: [],
      cityGroup: [],
      cities: [],
      provinces: [],
      typeMark: "",
      proviceMark: "",
      cityMark: "",
      currentPage: 1,
      limit: 10,
      total: 0
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    cities(val, oldVal) {
      this.cityGroup = [];
      for (let index = 0; index < val.length; index++) {
        this.cityGroup.push({
          text: val[index].name,
          value: val[index].name
        });
      }
    }
  },
  // 方法集合
  methods: {
    init(options) {
      console.log(options, this.typeMark, this.cityMark, this.proviceMark);
      const newData = [];
      // 筛选时 应请求一次数据接口拿到表单数据将以前的数据清空再进行条件筛选
      this.tableData = [];
      this.makeData();
      if (this.options.tag) {
        this.tableData.filter(item => {
          if (item.u_type.value === this.options.tag) {
            newData.push(item);
          } else if (item.u_provice.value === this.options.tag) {
            newData.push(item);
          } else if (item.u_city.value === this.options.tag) {
            newData.push(item);
          }
        });
        this.tableData = newData;
        this.getDataList();
        // this.currentPage = Math.ceil(this.total / this.limit);
      }
    },
    makeData() {
      for (let i = 0; i < 30; i++) {
        this.tableData.push({
          v_name: "a" + i,
          v_adress: "DY10-204K" + i,
          v_number: Math.floor(Math.random() * 10000 + 1),
          u_type: i % 2 === 0 ? "全国管理员" : "省级管理员",
          u_provice: this.provinces[i].name,
          u_city: this.provinces[i].cities[0].name,
          v_phone: Math.floor(Math.random() * 100888888880 + 1),
          v_concat: "cc" + i,
          isSet: false
        });
      }
      this.formatData();
      this.getDataList();
    },
    formatData() {
      this.tableData.forEach(item => {
        for (const key in item) {
          if (key !== "isSet") {
            if (key === "u_city") {
              item[key] = {
                value: item[key],
                edit: false,
                type: "city"
              };
            } else {
              item[key] = {
                value: item[key],
                edit: false
              };
            }
          }
        }
      });
    },
    selectionChangeHandle(val) {
      console.log(val);
      this.tableDataSelections = val;
    },
    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true;
    },
    // table 的方法
    // filter 的格式  obj { column-key: Array }
    // Array[0] 筛选的值
    fnFilterChangeInit(filter) {
      console.log(filter);
      // do something
      if (filter.u_type) {
        console.log(filter.u_type[0]);
        if (filter.u_type.length > 0) {
          this.typeMark = filter.u_type[0];
        } else {
          this.typeMark = "";
        }
        this.options.tag =
          filter.u_type[0] === undefined ? "" : filter.u_type[0];
      } else if (filter.u_provice) {
        console.log(filter.u_provice[0]);
        if (filter.u_provice.length > 0) {
          this.proviceMark = filter.u_provice[0];
        } else {
          this.proviceMark = "";
        }
        this.provinces.filter(item => {
          if (item.name === filter.u_provice[0]) {
            this.cities = item.cities;
          }
        });
        this.options.tag =
          filter.u_provice[0] === undefined ? "" : filter.u_provice[0];
      } else if (filter.u_city) {
        console.log(filter.u_city.length);
        if (filter.u_city.length > 0) {
          this.cityMark = filter.u_city[0];
        } else {
          this.cityMark = "";
        }
        this.options.tag =
          filter.u_city[0] === undefined ? "" : filter.u_city[0];
      }
      this.init(this.options);
    },
    // 单元格双击事件
    celledit(row, column, cell, event) {
      if (row[column.property].type === "city") {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === row.u_provice.value) {
            this.cities = this.provinces[i].cities;
          }
        }
      }
      if (row[column.property]) {
        this.saveStatu = true;
        row[column.property].edit = true;
      }
    },
    changeCell(value, item, index, type) {
      console.log(value, item, index, type);
      if (type === "u_provice") {
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.provinces[i].name === value) {
            this.cities = this.provinces[i].cities;
            this.tableData[index].u_city.value = this.provinces[
              i
            ].cities[0].name;
          }
        }
      }
    },
    getDataList() {
      this.total = this.tableData.length;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.getDataList();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      // this.getDataList();
    },
    // 表格新增行
    addRow() {
      this.tableData.push({
        v_number: { value: "", edit: true },
        v_name: { value: "", edit: true },
        v_adress: { value: "", edit: true },
        v_concat: { value: "", edit: true },
        v_phone: { value: "", edit: true },
        u_provice: { value: "", edit: true },
        u_city: { value: "", edit: true },
        u_type: { value: "", edit: true },
        isSet: true
      });

      this.getDataList();
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
    pwdChange(row, index) {
      console.log(row, index);
    },
    // 保存提交
    handleSave(index, row) {
      console.log(index, row);
      return (row.isSet = !row.isSet);
    }
    // rowClassName({ row, rowIndex }) {
    //   // 把每一行的索引放进row
    //   row.index = rowIndex;
    //   console.log(row);
    // }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.provinces = provinceCity.provinces;
    this.makeData();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    for (let index = 0; index < this.provinces.length; index++) {
      this.proviceGroup.push({
        text: this.provinces[index].name,
        value: this.provinces[index].name
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
