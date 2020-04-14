<!-- 产品追踪 -->
<template>
  <div class="container">
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
        <div class="btn_header">
          <el-input
            v-model="search"
            style="width:500px;border-radius:4px;padding-right:15px"
            placeholder="输入关键字搜索"
          />
          <div>
            <el-button @click="exportData()" type="primary" size="medium"
              >导出</el-button
            >
            <el-button @click="refreshData()" type="primary" size="medium"
              >刷新</el-button
            >
          </div>
        </div>
        <el-table
          ref="filterTable"
          :data="
            tableData.slice((currentPage - 1) * limit, currentPage * limit)
          "
          @filter-change="fnFilterChangeInit"
          :row-key="getRowKey"
          style="width: 100%; padding:10px 60px"
          border
        >
          <el-table-column class-name="t_header">
            <el-table-column
              type="index"
              width="100"
              align="center"
              label="序号"
            ></el-table-column>
            <el-table-column
              prop="p_type"
              label="产品类别"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="p_number"
              label="产品编号"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="p_model"
              label="产品型号"
              align="center"
              width="150"
              :filter-multiple="false"
              :filters="p_modelGroup"
              :filter-method="filterTag"
              column-key="p_model"
              filter-placement="bottom-end"
            >
            </el-table-column>
            <el-table-column
              prop="order_number"
              label="序列号 "
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="batch_number"
              label="产品批号 "
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="numbers"
              label="规格 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="d_date"
              label="生产日期 "
              align="center"
              width="100"
            >
            </el-table-column>

            <el-table-column
              prop="e_date"
              label="失效日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="b_code"
              label="箱码"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="e_code"
              label="激活码"
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="recive"
              label="签收单位"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="r_date"
              label="签收日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="r_statu"
              label="激活状态"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="a_date"
              label="激活日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="p_id"
              label="操作"
              align="center"
              width="150"
            >
              <template slot-scope="scope">
                <span class="loseContro" @click="getReport(scope.row)"
                  >生成报告</span
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
          style="margin:15px 50px;"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="追踪报告"
      :visible.sync="dialogVisible"
      center
      width="620px"
    >
      <el-steps direction="vertical">
        <el-step
          v-for="(item, index) in stepGroups"
          :title="item.stepName"
          :icon="item.iconType"
          :key="index"
        >
          <template slot="description">
            <div>
              <p>{{ item.stepContent }}</p>
              <p>{{ item.stepTime }}</p>
            </div>
          </template>
        </el-step>
      </el-steps>
      <div style="text-align: center;">
        <el-button @click="saveImg" type="primary" plain>确定</el-button>
        <el-button @click="quitNow" type="primary" plain>返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import pagination from "../components/Pagenation";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      currentPage: 1,
      limit: 11,
      total: 0,
      p_modelGroup: [
        { text: "DY10-204K", value: "DY10-204K" },
        { text: "DY10-204", value: "DY10-204" }
      ],
      tableData: [],
      search: "",
      tabNames: [
        { label: "全部", name: "wait" },
        { label: "已激活", name: "backProduct" }
      ],
      activeName: "wait",
      dialogVisible: false,
      stepGroups: [
        {
          stepName: "已发出",
          iconType: "el-icon-truck",
          stepContent: "激活单位：上海美莱医疗美容整形医院",
          stepTime: "2020.02.03 10:00:31"
        },
        {
          stepName: "已签收",
          iconType: "el-icon-circle-check",
          stepContent: "签收单位：上海美莱医疗美容整形医院",
          stepTime: "2020.02.03 10:00:31"
        },
        {
          stepName: "已激活",
          iconType: "el-icon-unlock",
          stepContent: "激活单位：上海美莱美容整形医院",
          stepTime: "2020.02.03 10:00:31"
        },
        {
          stepName: "已使用",
          iconType: "el-icon-user",
          stepContent: "使用单位：上海美莱美",
          stepTime: "2020.02.03 10:00:31"
        }
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
      this.tableData = [];
      for (let i = 0; i < 30; i++) {
        this.tableData.push({
          p_type: i % 3 === 0 ? "鼻假体" : "下巴假体",
          p_number: "23232323232323" + i,
          p_model: i % 2 === 0 ? "DY10-204K" : "DY10-204",
          batch_number: "232323232" + i,
          order_number: "2323232323232" + i,
          numbers: i + "个",
          d_date: "2019.12." + i,
          e_date: "2019.1." + i,
          b_code: "232323236667" + i,
          e_code: "54645482215" + i,
          r_statu: i % 2 === 0 ? "已签收" : "正在运输",
          recive: "上海东岳",
          r_date: "2019.3." + i,
          a_date: "2019.5." + i,
          p_id: i
        });
      }
      this.getDataList();
    },

    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true;
    },
    getDataList() {
      this.total = this.tableData.length;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
    },
    handleClick(tab, event) {
      console.log(tab.index === "1");
      // if (tab.index === "1") {
      //   this.initData();
      //   this.mark = true;
      // } else {
      //   this.mark = false;
      // }
    },
    fnFilterChangeInit(filter) {
      console.log(filter);
      const arr = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].p_model === filter.p_model[0]) {
          arr.push(this.tableData[i]);
        }
      }
      this.tableData = arr;
      this.getDataList();
    },
    getRowKey(row) {
      return row.p_id;
    },
    getReport(row) {
      this.dialogVisible = true;
      console.log("生成报告", row);
    },
    saveImg() {
      this.dialogVisible = false;
      console.log("保存图片");
    },
    quitNow() {
      this.dialogVisible = false;
      console.log("取消");
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData();
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
<style scoped>
.el-step {
  padding: 8px 100px;
}
.container {
  margin: 40px 60px;
  width: 95%;
}
.find {
  width: 100%;
  background-color: #fff;
}
.btn_header {
  display: flex;
  justify-content: space-between;
  margin: 10px 60px;
}
.btngroups {
  text-align: center;
}
.btngroups button {
  margin: 15px 20px;
}
.loseContro {
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(30, 114, 247, 1);
  cursor: pointer;
}
</style>
