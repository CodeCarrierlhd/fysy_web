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
          <div style="display:flex">
            <div style="display:flex;margin-right:10px">
              <el-input
                v-model="search"
                style="border-radius:4px;width:400px;margin-right:10px"
                placeholder="输入关键字搜索"
              />
              <el-button @click="searchEnterFun()" type="primary"
                >搜索</el-button
              >
            </div>
            <el-button
              @click="exportClientInfoExcel()"
              type="primary"
              size="medium"
              v-if="e_show"
              >导出</el-button
            >
          </div>
          <div v-if="add_show">
            <el-button
              @click="addData"
              v-if="btnShow"
              type="primary"
              v-show="s_show"
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
          @selection-change="selectionChangeHandle"
          @filter-change="fnFilterChangeInit"
          :row-key="getRowKey"
          max-height="660"
          style="width: 96%; margin:10px 0"
          border
        >
          <el-table-column class-name="t_header">
            <el-table-column
              type="selection"
              width="150"
              align="center"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column
              prop="materialType"
              label="产品类别"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="materialCode"
              label="产品编号"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="materialModel"
              label="产品型号"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="productNo"
              label="序列号 "
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="batchNo"
              label="产品批号 "
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="spec"
              label="规格 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="produceDate"
              label="生产日期 "
              align="center"
              width="100"
            >
            </el-table-column>

            <el-table-column
              prop="expiryDate"
              label="失效日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="cartonCode"
              label="箱码"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="activateCode"
              label="激活码"
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="producer"
              label="生产厂家"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column
              v-if="a_statu"
              prop="opUser"
              label="操作账户"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              v-if="a_statu"
              prop="receiver"
              label="接收账户"
              align="center"
              width="100"
            ></el-table-column>
            <el-table-column
              v-if="wait_pro"
              prop="receiver"
              label="收货人"
              align="center"
              width="150"
            >
            </el-table-column>
            <!-- <el-table-column
              v-if="wait_pro"
              prop="productStatus"
              label="状态"
              align="center"
              width="150"
              :filter-multiple="false"
              :filters="p_statuGroup"
              :filter-method="filterTag"
              column-key="productStatus"
              key="p_statu"
              filter-placement="bottom-end"
            ></el-table-column> -->
            <el-table-column
              v-if="wait_pro"
              prop="productStatus"
              label="状态"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="150"
              v-if="wait_pro"
            >
              <template slot-scope="scope">
                <span
                  @click="restart(scope.row)"
                  v-if="scope.row.productStatus === '已拒绝'"
                  class="loseContro"
                  >重新发货</span
                >
                <span v-else>------</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="productStatus"
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
          style="margin:15px 50px;"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisibleClassify"
      center
      width="90%"
      top="10vh"
    >
      <div class="new_header">
        <div style="display:flex;margin-right:10px">
          <el-input
            v-model="search1"
            style="border-radius:4px;width:400px;margin-right:10px"
            placeholder="输入关键字搜索"
          />
          <el-button @click="searchEnterFun1()" type="primary">搜索</el-button>
        </div>

        <el-button @click="chosePro" type="primary"
          ><i class="el-icon-plus"></i> 添加</el-button
        >
      </div>
      <el-table
        ref="getProducts"
        :data="newTableData"
        @filter-change="fnFilterChangeInit1"
        @selection-change="selectionChangeHandle1"
        :row-key="getRowKey"
        height="600"
        style="margin:10px 0;width:100%"
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
            prop="materialType"
            label="产品类别"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="materialCode"
            label="产品编号"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="materialModel"
            label="产品型号"
            align="center"
            width="150"
            :filter-multiple="false"
            :filters="materialModelGroup"
            :filter-method="filterTag"
          >
          </el-table-column>
          <el-table-column
            prop="productNo"
            label="序列号 "
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="batchNo"
            label="产品批号 "
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column prop="spec" label="规格 " align="center" width="80">
          </el-table-column>
          <el-table-column
            prop="produceDate"
            label="生产日期 "
            align="center"
            width="100"
          >
          </el-table-column>

          <el-table-column
            prop="expiryDate"
            label="失效日期"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="cartonCode"
            label="箱码"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="activateCode"
            label="激活码"
            align="center"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="producer"
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
        style="margin:15px 50px;"
      />
    </el-dialog>

    <el-dialog
      title="发货信息"
      :visible.sync="newDialogTableVisible"
      custom-class="sendPro"
      center
      width="620px"
    >
      <ul class="sendContainer">
        <li>
          <span>收货单位：</span>
          <el-select
            v-model="recived"
            placeholder="请选择"
            @change="reciverChange"
          >
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
          <span>{{ reciver.address }}</span>
        </li>
        <li>
          <span>联系人：</span>
          <span>{{ reciver.username }}</span>
        </li>
        <li>
          <span>联系电话：</span>
          <span>{{ reciver.mobile }}</span>
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
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="smaterialType"
              label="产品类别"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="smaterialModel"
              label="产品型号"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="sp_size" label="规格" align="center">
            </el-table-column>
            <el-table-column prop="sp_sum" label="数量/个" align="center">
            </el-table-column>
          </el-table>
        </li>
        <li>
          <span>订单编号：</span>
          <span>{{ order.orderNo }}</span>
        </li>
        <li>
          <span>订单时间：</span>
          <span>{{ order.orderTime }}</span>
        </li>
        <li>
          <span>发件单位：</span>
          <span>{{ sender.username }}</span>
        </li>
        <li>
          <span>发件地址：</span>
          <span>{{ sender.address }}</span>
        </li>
        <li>
          <span>联系人：</span>
          <span>{{ sender.contact }}</span>
        </li>
        <li>
          <span>联系电话：</span>
          <span>{{ sender.mobile }}</span>
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
import pagination from '../components/Pagenation'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      currentPage: 1,
      limit: 100,
      total: 0,
      currentPage1: 1,
      limit1: 100,
      total1: 0,
      materialModelGroup: [],
      p_statuGroup: [
        { text: '已拒绝', value: '已拒绝' },
        { text: '等待签收', value: '等待签收' }
      ],
      tableData: [],
      newTableData: [],
      search: '',
      search1: '',
      tabNames: [
        { label: '发货', name: 'one' },
        { label: '待收货', name: 'two' },
        { label: '已完成', name: 'third' }
      ],
      roleGroups: [],
      p_role: '',
      activeName: 'one',
      tableDataSelections: [],
      tableDataSelections1: [],
      mark: false,
      btnShow: true,
      wait_pro: false,
      a_statu: false,
      add_show: true,
      show_role: false,
      newDialogTableVisible: false,
      dialogVisibleClassify: false, // 弹窗是否显示
      gridData: [],
      reciveGroup: [],
      receiverList: [],
      reciver: {},
      sender: {},
      order: {},
      recived: '',
      s_show: false,
      e_show: false,
      key_index: '2'
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {},
    initData1() {
      this.searchAll(
        this.currentPage1,
        this.limit1,
        '/inventory/listData',
        '&materialId=',
        '',
        '&selectedOpIds=',
        '',
        '&uid=',
        '',
        '&value=',
        this.search
      ).then(res => {
        this.newTableData = []
        this.newTableData = res.data.object.list
        console.log(res.data.object.total)

        this.getDataList1(res.data.object.total)
      })
    },
    selectionChangeHandle(selection) {
      console.log(selection)

      this.tableDataSelections = []
      // this.btnShow = false
      for (let i = 0; i < selection.length; i++) {
        this.tableDataSelections.push(selection[i].opId)
      }
      if (selection.length > 0) {
        this.btnShow = false
      } else {
        this.btnShow = true
      }
      console.log(this.tableDataSelections)
    },
    selectionChangeHandle1(selection) {
      console.log(selection)

      this.tableDataSelections1 = []
      for (let i = 0; i < selection.length; i++) {
        this.tableDataSelections1.push(selection[i].opId)
      }
    },
    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true
    },
    getDataList(total) {
      this.total = total
    },
    getDataList1(total) {
      this.total1 = total
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val
      this.initData1()
    },
    handleClick(tab, event) {
      this.key_index = '4'
      if (tab.index === '2') {
        this.$nextTick(() => {
          this.getUid()
          this.show_role = true
          this.add_show = false
          this.a_statu = true
          this.wait_pro = false
        })
      } else if (tab.index === '1') {
        this.key_index = '3'
        this.$nextTick(() => {
          this.changeTab('0', '')
          this.show_role = false
          this.add_show = false
          this.a_statu = false
          this.wait_pro = true
        })
      } else {
        this.key_index = '2'
        this.tableData = []
        this.getDataList(0)
        this.show_role = false
        this.add_show = true
        this.a_statu = false
        this.wait_pro = false
      }
    },
    fnFilterChangeInit(filter) {
      console.log(filter)
      // const reduceArray = this.tableData.reduce((acc, current) => {
      //   // acc 是累计的值
      //   // current 是当前遍历的值
      //   console.log(current.productStatus === filter.productStatus[0])

      //   if (current.productStatus === filter.productStatus[0]) {
      //     acc.push(current)
      //   }
      //   // 相当于 acc = acc
      //   // 最后 return 的就是 最终的acc的值
      //   return acc
      // }, [])
      // this.tableData = reduceArray
    },
    fnFilterChangeInit1(filter) {
      console.log(filter)
      this.searchAll(
        this.currentPage1,
        this.limit1,
        '/inventory/listData',
        '&materialId=',
        filter.materialModel[0],
        '&selectedOpIds=',
        '',
        '&uid',
        '',
        '&value=',
        this.search,
        '',
        ''
      ).then(res => {
        console.log(res)

        this.newTableData = res.data.object.list
        this.getDataList1(res.data.object.total)
      })
    },
    getRowKey(row) {
      return row.opId
    },
    changRole(val) {
      this.changeTab('3', val)
      console.log('角色改变', val)
    },
    addData() {
      this.newTableData = []
      this.initData1()
      this.dialogVisibleClassify = true
    },
    n_addPro() {
      console.log('重新发货')
    },
    delData() {
      console.log('删除', this.tableDataSelections)
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableDataSelections.length; j++) {
          if (this.tableDataSelections[j] === this.tableData[i].opId) {
            this.tableData.splice(i, 1)
          }
        }
      }
      this.$refs.sendProFilterTable[0].clearSelection()
    },
    chosePro() {
      this.dialogVisibleClassify = false
      const ids = this.tableDataSelections1.join(',')
      this.searchAll(
        this.currentPage,
        this.limit,
        '/inventory/listByOpIdArray',
        '&opIds=',
        ids,
        '',
        '',
        '',
        '',
        '',
        ''
      ).then(res => {
        console.log(res)
        for (let i = 0; i < res.data.object.length; i++) {
          this.tableData.push(res.data.object[i])
        }
        this.getDataList(this.tableData.length)
        this.$refs.getProducts.clearSelection()
      })
    },
    sendPro() {
      this.newDialogTableVisible = true
      const ids = this.tableDataSelections.join(',')
      console.log(this.tableDataSelections)
      this.sendProducts(ids, '', '', '', '/deliver/generateOrderInfo').then(
        res => {
          console.log(res.data.object)
          for (let i = 0; i < res.data.object.receiverList.length; i++) {
            this.reciveGroup.push({
              value: res.data.object.receiverList[i].id,
              label: res.data.object.receiverList[i].address
            })
          }
          this.receiverList = res.data.object.receiverList
          this.reciver = res.data.object.receiverList[0]
          if (res.data.object.receiverList.length > 0) {
            this.recived = res.data.object.receiverList[0].username
          }

          this.sender = res.data.object.sender
          this.order = res.data.object.order
          for (let j = 0; j < res.data.object.goodsList.list.length; j++) {
            this.gridData.push({
              smaterialType: res.data.object.goodsList.list[j].materialType,
              smaterialModel: res.data.object.goodsList.list[j].materialModel,
              sp_size: res.data.object.goodsList.list[j].spec,
              sp_sum: res.data.object.goodsList.list[j].amount
            })
          }
        }
      )
    },
    reciverChange(val) {
      for (let index = 0; index < this.receiverList.length; index++) {
        if (val === this.receiverList[index].id) {
          this.reciver = this.receiverList[index]
        }
      }
    },
    refreshData() {
      console.log('刷新')
    },
    quitSend() {
      this.newDialogTableVisible = false
      console.log('退出')
    },
    sendProduct() {
      this.newDialogTableVisible = false
      const ids = this.tableDataSelections.join(',')
      this.sendProducts(
        ids,
        this.order.orderNo,
        this.order.orderTime.replace(/-/g, '/'),
        this.reciver.id,
        '/deliver/sureSend'
      ).then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tableDataSelections.length; j++) {
              if (this.tableDataSelections[j] === this.tableData[i].opId) {
                this.tableData.splice(i, 1)
              }
            }
          }
          this.$refs.sendProFilterTable[0].clearSelection()
          this.$notify({
            title: '发货状态',
            message: '产品发货成功',
            position: 'top-right',
            duration: 2000
          })
        }
      })
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '发货') {
          this.s_show = true
        } else if (item.rightName === '导出') {
          this.e_show = true
        }
      })
    },
    searchEnterFun() {
      // this.initData()
    },
    getType() {
      this.getSums('/material/listAboutSelf').then(res => {
        for (let i = 0; i < res.data.object.length; i++) {
          this.materialModelGroup.push({
            text: res.data.object[i].materialModel,
            value: res.data.object[i].id
          })
        }
      })
    },
    changeTab(statu, uid) {
      this.searchAll(
        this.currentPage,
        8,
        '/deliver/listData',
        '&materialId=',
        '',
        '&status=',
        statu,
        '&uid=',
        uid,
        '&value=',
        this.search
      ).then(res => {
        console.log(res)
        this.tableData = res.data.object.list
        this.getDataList(res.data.object.total)
      })
    },
    getUid() {
      this.getSums('/user/selfAndChild').then(res => {
        console.log(res)
        for (let i = 0; i < res.data.object.length; i++) {
          this.roleGroups.push({
            value: res.data.object[i].id,
            label: res.data.object[i].username
          })
        }
        this.changeTab('3', res.data.object[0].id)
      })
    },
    restart(row) {
      this.dataChange({ opId: row.opId }, '/deliver/reSend').then(res => {
        if (res.data.code === 200) {
          this.changeTab('0', '')
        }
      })
    },
    exportClientInfoExcel() {
      const ids = this.tableDataSelections.join(',')
      let names = ''
      if (this.key_index === '2') {
        names = '发货数据导出'
      } else if (this.key_index === '3') {
        names = '待收货数据导出'
      } else {
        names = '发货完成数据导出'
      }
      const that = this
      this.exportCompanyExcel(
        { opIds: ids, status: this.key_index },
        '/deliver/export'
      ).then(response => {
        if (response.status === 200) {
          that.downloadFile(response.data, names)
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initBtn()
    this.getType()
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
<style scoped>
.el-dialog {
  margin-top: 0 !important;
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
.sendContainer li {
  margin-bottom: 24px;
}
</style>
