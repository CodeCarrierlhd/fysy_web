<!-- 发货管理 -->
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
          <div>
            <el-input
              v-model="search"
              style="width:300px;border-radius:4px;padding-right:15px"
              placeholder="输入关键字搜索"
            />
            <el-button @click="exportData()" type="primary" size="medium"
              >导出</el-button
            >
            <el-button @click="refreshData()" type="primary" size="medium"
              >刷新</el-button
            >
          </div>
          <div v-if="add_show">
            <el-button @click="addData" v-if="btnShow" type="primary"
              ><i class="el-icon-plus"></i> 新增</el-button
            >
            <div v-else>
              <el-button @click="delData" type="primary"
                ><i class="el-icon-delete"></i>删除</el-button
              >
              <el-button @click="sendPro" type="primary"
                ><i class="el-icon-thumb"></i>确认发货</el-button
              >
            </div>
          </div>
          <el-select
            v-model="p_role"
            placeholder="请选择账号"
            v-if="show_role"
            label="账号"
            @change="changRole"
          >
            <el-option
              v-for="item in roleGroups"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-table
          ref="sendProFilterTable"
          :data="
            tableData.slice((currentPage - 1) * limit, currentPage * limit)
          "
          @filter-change="fnFilterChangeInit"
          @selection-change="selectionChangeHandle"
          :row-key="getRowKey"
          style="width: 100%; padding:10px 60px"
          border
        >
          <el-table-column class-name="t_header">
            <el-table-column
              type="selection"
              width="100"
              align="center"
              :reserve-selection="true"
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
              prop="vendor"
              label="生产厂家"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column
              v-if="a_statu"
              prop="u_acount"
              label="操作账户"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              v-if="a_statu"
              prop="r_acount"
              label="接收账户"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              v-if="wait_pro"
              prop="g_people"
              label="收货人"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column
              v-if="wait_pro"
              prop="p_statu"
              label="状态"
              align="center"
              width="150"
              :filter-multiple="false"
              :filters="p_statuGroup"
              :filter-method="filterTag"
              column-key="p_statu"
              filter-placement="bottom-end"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="150"
              v-if="wait_pro"
            >
              <template slot-scope="scope">
                <span
                  @click="restart"
                  v-if="scope.row.p_statu === '已拒绝'"
                  class="loseContro"
                  >重新发货</span
                >
                <span v-else>------</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="c_statu"
              label="状态"
              align="center"
              width="150"
              v-if="a_statu"
            ></el-table-column>
            <!-- <el-table-column label="取消关联" align="center">
              <span class="loseContro">解绑</span>
            </el-table-column> -->
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
      :close-on-click-modal="false"
      :visible.sync="dialogVisibleClassify"
      center
      width="1500px"
    >
      <div class="new_header">
        <el-input
          v-model="search1"
          style="width:600px;border-radius:4px;padding-right:15px"
          placeholder="输入关键字搜索"
        />

        <el-button @click="chosePro" type="primary"
          ><i class="el-icon-plus"></i> 添加</el-button
        >
      </div>
      <el-table
        ref="filterTable1"
        :data="
          newTableData.slice((currentPage1 - 1) * limit1, currentPage1 * limit1)
        "
        @filter-change="fnFilterChangeInit1"
        @selection-change="selectionChangeHandle1"
        :row-key="getRowKey"
        style="width: 100%; padding:10px 60px"
        border
      >
        <el-table-column class-name="t_header">
          <el-table-column
            type="selection"
            width="100"
            align="center"
            :reserve-selection="true"
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
            prop="vendor"
            label="生产厂家"
            align="center"
            width="150"
          >
          </el-table-column>

          <!-- <el-table-column label="取消关联" align="center">
              <span class="loseContro">解绑</span>
            </el-table-column> -->
        </el-table-column>
      </el-table>
      <pagination
        :currentPage="currentPage1"
        :total="total1"
        :limit="limit1"
        :small="true"
        @handleCurrentChange="handleCurrentChange1"
        @handleSizeChange="handleSizeChange1"
        style="margin:15px 50px;"
      />
    </el-dialog>

    <el-dialog
      title="发货信息"
      :visible.sync="newDialogTableVisible"
      custom-class="sendPro"
      center
    >
      <ul class="sendContainer">
        <li>
          <span>收货单位：</span>
          <el-select v-model="recived" placeholder="请选择">
            <el-option
              v-for="item in reciveGroup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </li>
        <li>
          <span>收件地址：</span>
          <span>广东省珠海市天煞大道888号</span>
        </li>
        <li>
          <span>货物清单：</span>
          <el-table
            :data="gridData"
            show-summary
            style="width: 100%;margin-top:10px"
            :cell-style="{ padding: '6px' }"
            :header-cell-style="{ background: '#E5E5E5', color: '#333333' }"
          >
            <el-table-column type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column prop="sp_type" label="产品类别"> </el-table-column>
            <el-table-column prop="sp_model" label="产品型号">
            </el-table-column>
            <el-table-column prop="sp_size" label="规格"> </el-table-column>
            <el-table-column prop="sp_sum" label="数量/个"> </el-table-column>
          </el-table>
        </li>
        <li>
          <span>订单编号：</span>
          <span>123456789012345</span>
        </li>
        <li>
          <span>订单时间：</span>
          <span>2020.03.09 12:34:32</span>
        </li>
        <li>
          <span>收件地址：</span>
          <span>广东省珠海市天煞大道888号</span>
        </li>
        <li>
          <span>发件单位：</span>
          <span>大族三维科技有限公司</span>
        </li>
        <li>
          <span>发件地址：</span>
          <span>广东省深圳市天天大道888号</span>
        </li>
        <li>
          <span>联系人：</span>
          <span>胡小笼</span>
        </li>
        <li>
          <span>联系电话：</span>
          <span>15365521111</span>
        </li>
      </ul>
      <div style="text-align: center;">
        <el-button @click="sendProduct" type="primary" plain>确定</el-button>
        <el-button @click="quitSend" type="primary" plain>返回</el-button>
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
      limit: 9,
      total: 0,
      currentPage1: 1,
      limit1: 8,
      total1: 0,
      p_modelGroup: [
        { text: "DY10-204K", value: "DY10-204K" },
        { text: "DY10-204", value: "DY10-204" }
      ],
      p_statuGroup: [
        { text: "已拒绝", value: "已拒绝" },
        { text: "等待验收", value: "等待验收" }
      ],
      tableData: [],
      newTableData: [],
      search: "",
      search1: "",
      tabNames: [
        { label: "发货", name: "one" },
        { label: "待收货", name: "two" },
        { label: "已完成", name: "third" }
      ],
      roleGroups: [
        {
          value: "系统管理员",
          label: "系统管理员"
        },
        {
          value: "普通管理员",
          label: "普通管理员"
        },
        {
          value: "用户",
          label: "用户"
        }
      ],
      p_role: "",
      activeName: "one",
      tableDataSelections: [],
      tableDataSelections1: [],
      mark: false,
      btnShow: true,
      a_statu: false,
      wait_pro: false,
      add_show: true,
      show_role: false,
      newDialogTableVisible: false,
      dialogVisibleClassify: false, // 弹窗是否显示
      gridData: [
        {
          id: "12987122",
          sp_type: "王小虎",
          sp_model: "DY10-204K",
          sp_size: "3",
          sp_sum: 10
        },
        {
          id: "12987122",
          sp_type: "王小虎",
          sp_model: "DY10-204K",
          sp_size: "3",
          sp_sum: 33
        },
        {
          id: "12987122",
          sp_type: "王小虎",
          sp_model: "DY10-204K",
          sp_size: "2",
          sp_sum: 22
        },
        {
          id: "12987122",
          sp_type: "王小虎",
          sp_model: "DY10-204K",
          sp_size: "5",
          sp_sum: 15
        },
        {
          id: "12987122",
          sp_type: "王小虎",
          sp_model: "DY10-204K",
          sp_size: "2",
          sp_sum: 12
        }
      ],
      reciveGroup: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      recived: ""
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
          p_statu: i % 3 === 0 ? "已拒绝" : "等待验收",
          batch_number: "232323232" + i,
          order_number: "2323232323232" + i,
          numbers: i + "个",
          d_date: "2019.12." + i,
          e_date: "2019.1." + i,
          b_code: "232323236667" + i,
          e_code: "54645482215" + i,
          vendor: i % 2 === 0 ? "上海东月医疗" : "南京新创",
          u_acount: "李" + i,
          r_acount: "王" + i,
          u_date: "2019.3." + i,
          g_reason: "没" + i,
          p_id: i,
          c_statu: "已完成",
          g_people: "刘" + i
        });
      }
      this.getDataList();
    },
    initData1() {
      this.newTableData = [];
      for (let i = 0; i < 30; i++) {
        this.newTableData.push({
          p_type: i % 3 === 0 ? "鼻假体" : "下巴假体",
          p_number: "23232323232323" + i,
          p_model: i % 2 === 0 ? "DY10-204K" : "DY10-204",
          p_statu: i % 3 === 0 ? "已拒绝" : "等待验收",
          batch_number: "232323232" + i,
          order_number: "2323232323232" + i,
          numbers: i + "个",
          d_date: "2019.12." + i,
          e_date: "2019.1." + i,
          b_code: "232323236667" + i,
          e_code: "54645482215" + i,
          vendor: i % 2 === 0 ? "上海东月医疗" : "南京新创",
          u_acount: "李" + i,
          r_acount: "王" + i,
          u_date: "2019.3." + i,
          g_reason: "没" + i,
          p_id: i,
          c_statu: "已完成",
          g_people: "刘" + i
        });
      }
      this.getDataList1();
    },
    selectionChangeHandle(selection, row) {
      this.tableDataSelections = selection;
      if (selection.length > 0) {
        this.btnShow = false;
      } else {
        this.btnShow = true;
      }
    },
    selectionChangeHandle1(selection, row) {
      this.tableDataSelections1 = selection;
    },
    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true;
    },
    getDataList() {
      this.total = this.tableData.length;
    },
    getDataList1() {
      this.total1 = this.newTableData.length;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
    },
    handleSizeChange1(val) {
      this.limit1 = val;
      this.currentPage1 = 1;
    },
    handleClick(tab, event) {
      if (tab.index === "2") {
        this.initData();
        this.show_role = true;
        this.add_show = false;
        this.a_statu = true;
        this.wait_pro = false;
        this.btnShow = true;
      } else if (tab.index === "1") {
        this.initData();
        this.show_role = false;
        this.add_show = false;
        this.a_statu = false;
        this.wait_pro = true;
        this.btnShow = true;
      } else {
        this.tableData = [];
        this.getDataList();
        this.show_role = false;
        this.add_show = true;
        this.a_statu = false;
        this.wait_pro = false;
      }
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
    fnFilterChangeInit1(filter) {
      console.log(filter);
      const arr = [];
      for (let i = 0; i < this.newTableData.length; i++) {
        if (this.newTableData[i].p_model === filter.p_model[0]) {
          arr.push(this.newTableData[i]);
        }
      }
      this.newTableData = arr;
      this.getDataList1();
    },
    getRowKey(row) {
      return row.p_id;
    },

    restart() {
      console.log(2);
    },
    changRole(val) {
      console.log("角色改变", val);
    },
    addData() {
      if (this.newTableData.length === 0) {
        this.initData1();
      }
      this.dialogVisibleClassify = true;
    },
    n_addPro() {
      console.log("重新发货");
    },
    delData() {
      console.log("删除");
    },
    chosePro() {
      this.dialogVisibleClassify = false;
      // const arr = [];
      for (let i = 0; i < this.newTableData.length; i++) {
        for (let j = 0; j < this.tableDataSelections1.length; j++) {
          if (this.newTableData[i].p_id === this.tableDataSelections1[j].p_id) {
            // arr.push(this.newTableData[i]);
            this.newTableData.splice(i, 1);
          }
        }
      }
      // this.newTableData = arr;
      this.getDataList1();
      for (let m = 0; m < this.tableDataSelections1.length; m++) {
        this.tableData.push(this.tableDataSelections1[m]);
      }
      this.$refs.filterTable1.clearSelection();
    },
    sendPro() {
      this.newDialogTableVisible = true;
    },
    refreshData() {
      console.log("刷新");
    },
    quitSend() {
      this.newDialogTableVisible = false;
      console.log("退出");
    },
    sendProduct() {
      this.newDialogTableVisible = false;
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableDataSelections.length; j++) {
          if (this.tableData[i].p_id === this.tableDataSelections[j].p_id) {
            // arr.push(this.newTableData[i]);
            this.tableData.splice(i, 1);
          }
        }
      }
      this.$refs.sendProFilterTable[0].clearSelection();
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
.new_header {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
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
.sendPro {
  text-align: center;
}
.sendContainer {
  margin: 0 35px;
}
.sendContainer li {
  margin-bottom: 15px;
}
</style>
