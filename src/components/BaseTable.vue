<!-- 拥有table基本功能的组件 -->
<template>
  <div style="width: 100%;">
    <el-table
      :data="tableData.slice((currentPage - 1) * limit, currentPage * limit)"
      border
      @selection-change="selectionChangeHandle"
      @cell-dblclick="celledit"
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
          prop="type"
          label="产品类别"
          edit="false"
          align="center"
          :filter-multiple="false"
          :column-key="'type'"
          :filters="filterStatus"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.type.value"
              v-if="scope.row.type.edit"
              placeholder="请选择"
              @change="
                value => {
                  changeCell(value, scope.row, scope.$index, 'type');
                }
              "
            >
              <el-option
                v-for="item in typeGroups"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.type.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="p_model"
          label="产品型号"
          edit="false"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.p_model.edit"
              ref="p_model"
              v-model="scope.row.p_model.value"
              @blur="scope.row.p_model.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.p_model.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="p_specification"
          label="规格"
          edit="false"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.p_specification.edit"
              ref="p_specification"
              v-model="scope.row.p_specification.value"
              @blur="scope.row.p_specification.edit = false"
            >
            </el-input>
            <span v-else>{{ scope.row.p_specification.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="p_manufacturer"
          label="生产商"
          edit="false"
          align="center"
          width="450"
          :filter-multiple="false"
          :column-key="'p_manufacturer'"
          :filters="manufacturers"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.p_manufacturer.value"
              v-if="scope.row.p_manufacturer.edit"
              placeholder="请选择"
              @change="
                value => {
                  scope.row.p_manufacturer.edit = false;
                  changeCell(value, scope.row, scope.$index, 'p_manufacturer');
                }
              "
            >
              <el-option
                v-for="item in manufacturerGroups"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.p_manufacturer.value }}</span>
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
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="p_date" label="上市日期" align="center">
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
export default {
  props: {
    tableData: {
      required: true
    }
  },
  // import引入的组件需要注入到对象中才能使用
  components: {
    pagination
  },
  data() {
    // 这里存放数据
    return {
      tableDataSelections: [], // 选中的表格数据
      search: "",
      // 类别
      filterStatus: [
        { text: "鼻假体", value: "鼻假体" },
        { text: "下巴假体", value: "下巴假体" }
      ],
      // 状态
      status: [
        { text: "上市", value: "上市" },
        { text: "已下市", value: "已下市" }
      ],
      // 厂商
      manufacturers: [
        {
          text: "上海东月医疗保健用品有限公司",
          value: "上海东月医疗保健用品有限公司"
        },
        { text: "上海医疗保健用品", value: "上海医疗保健用品" }
      ],
      typeGroups: [
        {
          value: "1",
          label: "鼻假体"
        },
        {
          value: "2",
          label: "下巴假体"
        }
      ],
      manufacturerGroups: [
        {
          value: "3",
          label: "上海东月医疗保健用品有限公司"
        },
        {
          value: "4",
          label: "上海医疗保健用品"
        }
      ],
      currentPage: 1,
      limit: 10,
      total: 0
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    mockTableData1() {
      for (let i = 0; i < 30; i++) {
        this.tableData.push({
          p_number: Math.floor(Math.random() * 10000 + 1),
          type: i % 2 === 0 ? "鼻假体" : "下巴假体",
          p_model: "DY10-204K" + i,
          p_specification: i + "个",
          p_manufacturer:
            i % 2 === 0 ? "上海东月医疗保健用品有限公司" : "上海东月医疗",
          p_date: "2019-12-" + i,
          p_statu: i % 2 === 0 ? "上市" : "已下市"
        });
      }
      this.formatData();
    },
    formatData() {
      this.tableData.forEach(item => {
        for (const key in item) {
          item[key] = {
            value: item[key],
            edit: false
          };
        }
      });
    },
    // 表格新增行
    addRow() {
      this.currentPage = Math.ceil(this.total / this.limit);
      this.tableData.push({
        p_number: { value: "", edit: true },
        type: { value: "", edit: true },
        p_model: { value: "", edit: true },
        p_specification: { value: "", edit: true },
        p_manufacturer: { value: "", edit: true },
        p_date: { value: "", edit: true },
        p_statu: { value: "", edit: true }
      });
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
              break;
            }
          }
        }
      }
    },
    // 单元格双击事件
    celledit(row, column, cell, event) {
      if (row[column.property]) {
        row[column.property].edit = true;
        // setTimeout(() => {
        //   this.$refs[column.property].focus();
        // }, 20);
      }
    },
    getStatu() {
      this.tableData.map(item => {
        if (item.p_statu.value === "上市") {
          this.$set(item, "isCheck", true); // 这里，给对象添加属性，用$set方法。
        } else {
          this.$set(item, "isCheck", false); // 这里，给对象添加属性，用$set方法。
        }
        return item;
      });
    },
    filterHandler(value, row, column) {
      const property = column.property;
      return row[property].value === value;
    },
    changeCell(value, item, index, type) {
      this.$nextTick(() => {
        this.tableData[index].type.edit = false;
      });
    },
    getDataList() {
      // let json = {
      //   limit: this.limit,
      //   page: this.currentPage
      // };
      // // 调用后端接口，这里是封装过的
      // invokeApi(json).then(res => {
      //   this.dataList = res.list;
      //   this.total = res.total;
      // });
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
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.mockTableData1();

    this.getDataList();
    // this.addData();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getStatu();
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
  max-height: 50px !important;
}
.t_header > .cell {
  display: flex !important;
  justify-content: space-between;
}
</style>
