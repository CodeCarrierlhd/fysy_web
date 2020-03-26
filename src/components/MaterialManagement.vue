<!-- 物理管理 -->
<template>
  <el-table
    :data="tableData"
    border
    @selection-change="selectionChangeHandle"
    @cell-dblclick="celledit"
    style="width: 100%;margin:40px 60px;"
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
          <el-button @click="batchDelete(tableDataSelections)">删除</el-button>
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
        :filter-method="handleFilterChange"
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.type.edit"
            ref="type"
            v-model="scope.row.type.value"
            @blur="scope.row.type.edit = false"
          >
          </el-input>
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
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.p_manufacturer.edit"
            ref="p_manufacturer"
            v-model="scope.row.p_manufacturer.value"
            @blur="scope.row.p_manufacturer.edit = false"
          >
          </el-input>
          <span v-else>{{ scope.row.p_manufacturer.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        width="55"
        :filter-multiple="false"
        :column-key="'p_statu'"
        :filters="productStatus"
        :filter-method="filterTag"
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
            type="p_date"
            value-format="yyyy-MM-dd"
            @blur="scope.row.p_date.edit = false"
          >
          </el-date-picker>
          <span v-else>{{ scope.row.p_date.value }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table-column>
  </el-table>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      tableData: [
        {
          p_number: "232323232323232323",
          type: "鼻假体",
          p_model: "DY10-204K",
          p_specification: "1个",
          p_manufacturer: "上海东月医疗保健用品有限公司",
          p_date: "2019-12-28",
          p_statu: "上市"
        },
        {
          p_number: "232323232323232323",
          type: "鼻假体",
          p_model: "DY10-204K",
          p_specification: "1个",
          p_manufacturer: "上海东月医疗保健用品有限公司",
          p_date: "2019-12-28",
          p_statu: "上市"
        },
        {
          p_number: "232323232323232323",
          type: "下巴假体",
          p_model: "DY10-204K",
          p_specification: "1个",
          p_manufacturer: "上海东月医疗保健用品有限公司",
          p_date: "2019-12-28",
          p_statu: "已下市"
        }
      ],
      tableDataSelections: [], // 选中的表格数据
      search: "",
      filterStatus: [
        { text: "鼻假体", value: "鼻假体" },
        { text: "下巴假体", value: "下巴假体" }
      ],
      productStatus: [
        { text: "上市", value: "上市" },
        { text: "已下市", value: "已下市" }
      ]
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
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
      this.tableData.push({
        p_number: { value: "", edit: true },
        type: { value: "", edit: true },
        p_model: { value: "", edit: true },
        p_specification: { value: "", edit: true },
        p_manufacturer: { value: "", edit: true },
        p_date: { value: "", edit: true }
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
        setTimeout(() => {
          this.$refs[column.property].focus();
        }, 20);
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
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleFilterChange(value, row) {
      const arr = [];
      this.tableData.forEach(item => {
        if (item.type.value === value) {
          arr.push(item);
        }
      });
      this.tableData = arr;
    },
    filterTag(value, row) {
      const arr = [];
      this.tableData.forEach(item => {
        console.log(item);
        if (item.p_statu.value === value) {
          arr.push(item);
        }
      });
      console.log(arr);

      this.tableData = arr;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.formatData();
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
