<!-- 激活码管理 -->
<template>
  <div class="container">
    <div style="display:flex;justify-content: space-between;margin-bottom:45px">
      <el-card class="box-card" v-for="(item, index) in dataArr" :key="index">
        <div class="header">
          <img :src="item.img" />
          <p style="margin-right:0">
            <span>{{ item.sumArr[0] }}</span
            ><span>/</span><span>{{ item.sumArr[1] }}</span>
          </p>
        </div>
        <p class="sumFont">
          <span>{{ item.cardName }}</span
          ><span>{{ item.percentage }}%</span>
        </p>
        <el-progress
          :percentage="item.percentage"
          :show-text="false"
        ></el-progress>
      </el-card>
    </div>
    <div class="sumForm">
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
        class="find"
      >
        <el-tab-pane
          :name="item.name"
          v-for="(item, index) in tabNames"
          :key="index"
          :label="item.label"
        >
          <el-table
            :data="
              tableData.slice((currentPage - 1) * limit, currentPage * limit)
            "
            style="width: 96%;margin:20px"
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
                  placeholder="搜索"
                />
                <div>
                  <el-button @click="importData()" type="primary"
                    >导入</el-button
                  >
                  <el-button @click="updateData()" type="primary"
                    >刷新</el-button
                  >
                </div>
              </template>
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="150"
              >
              </el-table-column>
              <el-table-column prop="a_code" label="激活码" align="center">
              </el-table-column>
              <el-table-column prop="a_date" label="生成日期" align="center">
              </el-table-column>
              <el-table-column prop="a_status" label="状态" align="center">
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
        </el-tab-pane>
        <!-- <el-tab-pane label="库存" name="havenProduct">配置管理</el-tab-pane>
        <el-tab-pane label="已使用" name="hasUsed">角色管理</el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import pagination from "../components/Pagenation";

export default {
  // import引入的组件需要注入到对象中才能使用
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      dataArr: [
        {
          sumArr: ["600", "1000"],
          img: require("../assets/imgs/active_left.png"),
          percentage: 60,
          cardName: "外箱码库存量"
        },
        {
          sumArr: ["200", "1000"],
          img: require("../assets/imgs/active_right.png"),
          percentage: 20,
          cardName: "激活码库存量"
        }
      ],
      activeName: "allProduct",
      tableData: [],
      currentPage: 1,
      limit: 5,
      total: 0,
      search: "",
      tabNames: [
        { label: "全部", name: "allProduct" },
        { label: "库存", name: "havenProduct" },
        { label: "未使用", name: "havenUsed" }
      ]
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {
      for (let i = 0; i < 30; i++) {
        this.tableData.push({
          a_code: i + "MKNY23MKNY",
          a_date: "2020.03." + i + "  13:56:34",
          a_status: i % 2 === 0 ? "未使用" : "已使用"
        });
      }
    },
    handleClick(tab, event) {
      const arr = [];
      if (tab.index === "1") {
        // 这里需要请求后台接口拿数据
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].a_status === "已使用") {
            arr.push(this.tableData[i]);
          }
        }
      } else if (tab.index === "2") {
        // 这里需要请求后台接口拿数据
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].a_status === "未使用") {
            arr.push(this.tableData[i]);
          }
        }
      }
      this.tableData = arr;
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
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDataList();
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
<style>
.el-tabs__item {
  width: 200px !important;
  text-align: center;
  border-bottom: 0;
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-top: 3px solid #2a426e;
}
</style>

<style scoped>
.container {
  width: 100%;
  padding: 40px 60px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 700px;
  height: 200px;
}
.header {
  display: flex;
  width: 100%;
}
.header img {
  width: 80px;
  height: 80px;
  display: block;
}
.header p span {
  font-size: 36px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 54px;
}
.el-card__body {
  width: 100% !important;
}
.sumFont {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.sumForm {
  background-color: #fff;
  flex: 1;
}
</style>
