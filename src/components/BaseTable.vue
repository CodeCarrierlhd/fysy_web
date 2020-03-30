<!-- 拥有table基本功能的组件 -->
<template>
  <div style="width: 97%;">
    <el-table
      :data="tableData.slice((currentPage - 1) * limit, currentPage * limit)"
      @selection-change="selectionChangeHandle"
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
          v-for="(item, index) in tableData[0].users"
          :key="index"
        >
          <template slot="header">
            {{ item.name }}
            <slot v-if="index === 2"></slot>
          </template>
          <template slot-scope="scope">{{
            scope.row.users[index].scores
          }}</template>
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
    // 表格新增行 直接使用父组件的方法
    addRow() {
      this.currentPage = Math.ceil(this.total / this.limit);
      // this.tableData.push({
      //   p_number: { value: "", edit: true },
      //   type: { value: "", edit: true },
      //   p_model: { value: "", edit: true },
      //   p_specification: { value: "", edit: true },
      //   p_manufacturer: { value: "", edit: true },
      //   p_date: { value: "", edit: true },
      //   p_statu: { value: "", edit: true }
      // });
      this.$emit("fatherMethod");
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
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // this.mockTableData1();
    this.getDataList();
    // this.addData();
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
