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
        <div style="margin:10px 20px">
          <div class="btn_header">
            <div style="display:flex">
              <div style="display:flex;margin-right:10px">
                <el-input
                  v-model="search"
                  prefix-icon="el-icon-search"
                  clearable
                  style="border-radius:4px;width:400px;margin-right:10px"
                  placeholder="输入关键字搜索"
                />
                <el-button @click="searchEnterFun()" type="primary"
                  ><i class="el-icon-search"></i>搜索</el-button
                >
              </div>
              <el-button
                @click="exportClientInfoExcel()"
                :type="defaultColr"
                :disabled="btnStatu"
                size="medium"
                v-if="e_show"
                ><i class="el-icon-download"></i>导出</el-button
              >
              <el-button
                @click="exportAllExcel"
                type="primary"
                size="medium"
                v-if="exportAll && e_show"
                >一键导出</el-button
              >
            </div>
            <div v-if="add_show">
              <div style="display:flex">
                <el-button @click="addData" type="primary" v-show="s_show"
                  ><i class="el-icon-plus"></i> 新增</el-button
                >

                <el-button @click="sendPro" type="primary" v-if="!btnShow"
                  ><i class="el-icon-thumb"></i>确认退货</el-button
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
            :data="tableData"
            @selection-change="selectionChangeHandle"
            @filter-change="fnFilterChangeInit"
            :row-key="getRowKey"
            :header-cell-style="{
              fontSize: '15px',
              color: '#000',
              fontWeight: 800,
              background: '#eef1f6',
              padding: '4px'
            }"
            border
            height="660"
            :cell-style="{ padding: '2px' }"
            v-loading="loading"
          >
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
              width="140"
            >
            </el-table-column>

            <el-table-column
              prop="expiryDate"
              label="失效日期"
              align="center"
              width="140"
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
              width="350"
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
                <p v-if="scope.row.productStatus === '已拒绝'">
                  <el-button @click="restart(scope.row)" size="mini"
                    >重新发货</el-button
                  >
                  <el-button @click="interStorage(scope.row)" size="mini"
                    >收入库存</el-button
                  >
                </p>
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
          </el-table>

          <pagination
            :currentPage="currentPage"
            :total="total"
            :limit="limit"
            :small="true"
            @handleCurrentChange="handleCurrentChange"
          />
        </div>
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
            prefix-icon="el-icon-search"
            clearable
            style="border-radius:4px;width:400px;margin-right:10px"
            placeholder="输入关键字搜索"
          />
          <el-button @click="searchEnterFun1()" type="primary"
            ><i class="el-icon-search"></i>搜索</el-button
          >
        </div>

        <el-button @click="chosePro" type="primary"> 添加</el-button>
      </div>
      <el-table
        ref="getProducts"
        :data="newTableData"
        @filter-change="fnFilterChangeInit1"
        @selection-change="selectionChangeHandle1"
        :row-key="getRowKey1"
        :header-cell-style="{
          fontSize: '15px',
          color: '#000',
          fontWeight: 800,
          background: '#eef1f6',
          padding: '4px'
        }"
        border
        height="660"
        :cell-style="{ padding: '2px' }"
        v-loading="loading1"
      >
        <el-table-column
          type="selection"
          width="100"
          align="center"
          :reserve-selection="selectStatu"
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
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="materialModel"
          label="产品型号"
          align="center"
          width="150"
          column-key="materialModel"
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
          width="140"
        >
        </el-table-column>

        <el-table-column
          prop="expiryDate"
          label="失效日期"
          align="center"
          width="140"
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
          width="350"
        >
        </el-table-column>
      </el-table>
      <pagination
        :currentPage="currentPage1"
        :total="total1"
        :limit="limit1"
        :small="true"
        @handleCurrentChange="handleCurrentChange1"
      />
    </el-dialog>

    <el-dialog
      title="退货信息"
      :visible.sync="newDialogTableVisible"
      custom-class="sendPro"
      center
    >
      <ul class="sendContainer">
        <li>
          <span>退货原因：</span>
          <el-select
            v-model="reason"
            placeholder="请选择"
            @change="reasonChange"
          >
            <el-option
              v-for="item in reasonGroup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </li>
        <li>
          <div style="display:flex;">
            <span>其他原因：</span>
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              style="width:85%"
              v-model="loseReason"
            >
            </el-input>
          </div>
        </li>
        <li>
          <span>收货单位：</span>
          <el-select
            v-model="recived"
            filterable
            placeholder="请选择"
            @change="recivedChange"
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
            <el-table-column prop="materialType" label="产品类别">
            </el-table-column>
            <el-table-column prop="materialModel" label="产品型号">
            </el-table-column>
            <el-table-column prop="sp_size" label="规格"> </el-table-column>
            <el-table-column prop="sp_sum" label="数量/个"> </el-table-column>
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
          <span>退回单位：</span>
          <span>{{ sender.username }}</span>
        </li>
        <li>
          <span>单位地址：</span>
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
        { label: '退货', name: 'one' },
        { label: '待退货', name: 'two' },
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
      reason: '',
      reasonGroup: [],
      receiverList: [],
      reasonList: [],
      reciver: {},
      sender: {},
      order: {},
      recived: '',
      s_show: false,
      e_show: false,
      loseReason: '',
      key_index: '2',
      uid: 0,
      defaultColr: 'info',
      btnStatu: true,
      returnReasonType: 0,
      loading: true,
      loading1: true,
      middleSelection: [],
      clickSum: 0,
      selectStatu: true,
      exportAll: false,
      exportKey: '2',
      page_key: 0
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
        this.middleSelection.join(','),
        '&uid',
        '',
        '&value=',
        this.search1
      ).then(res => {
        if (res.status === 200) {
          this.loading1 = false
          this.newTableData = res.data.object.list
          // this.$refs.getProducts.clearSelection()
          this.getDataList1(res.data.object.total)
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
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
        this.defaultColr = 'primary'
        this.btnStatu = false
      } else {
        this.btnShow = true
        this.defaultColr = 'info'
        this.btnStatu = true
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
      this.loading = true
      this.currentPage = val
      console.log(this.key_index, this.uid)

      if (this.key_index === '2') {
        this.searchAll(
          this.currentPage,
          this.limit,
          '/inventory/listData',
          '&materialId=',
          '',
          '&selectedOpIds=',
          this.middleSelection.join(','),
          '&uid=',
          '',
          '&value=',
          this.search,
          '&pageType=',
          '2'
        ).then(res => {
          this.loading = false
          this.tableData = res.data.object.list
          this.getDataList(res.data.object.total)
        })
      } else {
        this.changeTab(this.key_index, this.uid)
      }
    },
    handleCurrentChange1(val) {
      this.loading1 = true
      this.currentPage1 = val
      this.initData1()
    },
    handleClick(tab, event) {
      this.middleSelection = []
      this.search = ''
      this.loading = true
      this.btnStatu = true
      this.defaultColr = 'info'
      this.page_key = tab.index
      if (tab.index === '2') {
        this.exportAll = true
        this.exportKey = '6'
        this.key_index = '4'
        this.$nextTick(() => {
          this.changeTab('4', this.uid)
          this.show_role = true
          this.add_show = false
          this.a_statu = true
          this.wait_pro = false
        })
      } else if (tab.index === '1') {
        this.exportAll = true
        this.exportKey = '5'
        this.key_index = '1'
        this.$nextTick(() => {
          this.changeTab('1', '')
          this.show_role = false
          this.add_show = false
          this.a_statu = false
          this.wait_pro = true
        })
      } else {
        this.exportKey = '2'
        this.loading = false
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
    },
    fnFilterChangeInit1(filter) {
      console.log(filter)
      this.loading1 = true
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
        this.search
      ).then(res => {
        console.log(res)
        this.loading1 = false
        this.newTableData = res.data.object.list
        this.getDataList1(res.data.object.total)
      })
    },
    getRowKey(row) {
      return row.opId
    },
    getRowKey1(row) {
      return row.opId
    },
    changRole(val) {
      this.loading = true
      this.uid = val
      this.changeTab('4', val)
    },
    addData() {
      this.newTableData = []
      this.search1 = ''
      this.initData1()
      this.dialogVisibleClassify = true
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
      for (let index = 0; index < this.tableDataSelections1.length; index++) {
        this.middleSelection.push(this.tableDataSelections1[index])
      }
      this.limit = this.middleSelection.length
      this.searchAll(
        this.currentPage,
        this.limit,
        '/inventory/listData',
        '&materialId=',
        '',
        '&selectedOpIds=',
        this.middleSelection.join(','),
        '&uid=',
        '',
        '&value=',
        this.search,
        '&pageType=',
        '2'
      ).then(res => {
        this.tableData = res.data.object.list
        this.$nextTick(() => {
          for (let i = 0; i < this.tableData.length; i++) {
            this.$refs.sendProFilterTable[0].toggleRowSelection(
              this.tableData[i],
              true
            )
          }
        })
        this.getDataList(res.data.object.total)
        this.$refs.getProducts.clearSelection()
      })
    },
    sendPro() {
      this.clickSum = 0
      this.newDialogTableVisible = true
      const ids = this.tableDataSelections.join(',')
      console.log(this.tableDataSelections)
      this.sendProducts(ids, '', '', '', '/return/generateOrderInfo').then(
        res => {
          console.log(res.data.object)
          this.reciveGroup = []
          for (let i = 0; i < res.data.object.receiverList.length; i++) {
            this.reciveGroup.push({
              value: res.data.object.receiverList[i].id,
              label: res.data.object.receiverList[i].username
            })
          }
          this.reasonGroup = []
          for (let i = 0; i < res.data.object.returnReasonList.length; i++) {
            this.reasonGroup.push({
              value: res.data.object.returnReasonList[i].value,
              label: res.data.object.returnReasonList[i].desc
            })
          }
          this.receiverList = res.data.object.receiverList
          this.reasonList = res.data.object.returnReasonList
          this.reason = res.data.object.returnReasonList[0].desc
          // this.recived = res.data.object.receiverList[0].id
          this.reciver = res.data.object.receiverList[0]
          // if (res.data.object.receiverList.length > 0) {
          //   this.recived = res.data.object.receiverList[0].username
          // }

          this.sender = res.data.object.sender
          this.order = res.data.object.order
          this.gridData = []
          for (let j = 0; j < res.data.object.goodsList.list.length; j++) {
            this.gridData.push({
              materialType: res.data.object.goodsList.list[j].materialType,
              materialModel: res.data.object.goodsList.list[j].materialModel,
              sp_size: res.data.object.goodsList.list[j].spec,
              sp_sum: res.data.object.goodsList.list[j].amount
            })
          }
        }
      )
    },
    quitSend() {
      this.newDialogTableVisible = false
      this.$refs.sendProFilterTable[0].clearSelection()
      console.log('退出')
    },
    reasonChange(val) {
      console.log(val)
      this.returnReasonType = val
    },
    recivedChange(val) {
      this.recived = val
      console.log(this.recived)
    },
    sendProduct() {
      this.newDialogTableVisible = false
      const ids = this.tableDataSelections.join(',')
      console.log(this.recived)

      if (this.clickSum === 0) {
        this.dataChange(
          {
            opIds: ids,
            orderNo: this.order.orderNo,
            orderTime: this.order.orderTime.replace(/-/g, '/'),
            receiver: this.recived,
            returnReason: this.loseReason,
            returnReasonType: this.returnReasonType
          },
          '/return/sureReturn'
        ).then(res => {
          if (res.data.code === 200) {
            this.clickSum++
            this.tableData = []
            this.$refs.sendProFilterTable[0].clearSelection()
            this.$notify({
              title: '退货状态',
              message: '产品退货成功',
              position: 'top-right',
              duration: 2000
            })
          }
        })
      }
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '退货') {
          this.s_show = true
        } else if (item.rightName === '导出') {
          this.e_show = true
        }
      })
    },
    searchEnterFun() {
      console.log(this.key_index)
      console.log(this.uid)
      this.loading = true
      let a = 0
      if (this.key_index === '4') {
        a = 4
        this.searchAll(
          this.currentPage,
          this.limit,
          '/return/listData',
          '&materialId=',
          '',
          '&uid=',
          this.uid,
          '&value=',
          this.search,
          '&status=',
          a
        ).then(res => {
          console.log(res)
          this.loading = false
          this.tableData = res.data.object.list
          this.getDataList(res.data.object.total)
        })
      } else if (this.key_index === '1') {
        a = 1
        this.searchAll(
          this.currentPage,
          this.limit,
          '/return/listData',
          '&materialId=',
          '',
          '&uid=',
          '',
          '&value=',
          this.search,
          '&status=',
          a
        ).then(res => {
          this.loading = false
          this.tableData = res.data.object.list
          this.getDataList(res.data.object.total)
        })
      } else {
        a = 2
        this.searchAll(
          this.currentPage,
          this.limit,
          '/inventory/listData',
          '&materialId=',
          '',
          '&selectedOpIds=',
          this.middleSelection.join(','),
          '&uid=',
          '',
          '&value=',
          this.search,
          '&pageType=',
          a
        ).then(res => {
          this.loading = false
          this.tableData = res.data.object.list
          this.getDataList(res.data.object.total)
        })
      }
    },
    searchEnterFun1() {
      this.searchAll(
        this.currentPage1,
        this.limit1,
        '/inventory/listData',
        '&materialId=',
        '',
        '&selectedOpIds=',
        this.middleSelection.join(','),
        '&uid=',
        this.uid,
        '&value=',
        this.search1,
        '&pageType=',
        '1'
      ).then(res => {
        this.newTableData = res.data.object.list
        this.getDataList1(res.data.object.total)
      })
      // this.changeTab(a, '')
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
        this.limit,
        '/return/listData',
        '&materialId=',
        '',
        '&status=',
        statu,
        '&uid=',
        uid,
        '&value=',
        this.search
      ).then(res => {
        if (res.status === 200) {
          this.loading = false
          this.tableData = res.data.object.list
          if (statu === '1') {
            this.$refs.sendProFilterTable[1].clearSelection()
          } else if (statu === '4') {
            this.$refs.sendProFilterTable[2].clearSelection()
          }
          this.getDataList(res.data.object.total)
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
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
        this.uid = res.data.object[0].id
        this.p_role = res.data.object[0].username
      })
    },
    restart(row) {
      this.loading = true
      this.dataChange({ opId: row.opId }, '/return/reSend').then(res => {
        if (res.data.code === 200) {
          this.changeTab('1', '')
        }
      })
    },
    interStorage(row) {
      this.loading = true
      this.dataChange({ opId: row.opId }, '/return/instock').then(res => {
        if (res.data.code === 200) {
          this.changeTab('1', '')
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
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel(
        { opIds: ids, pageType: this.exportKey },
        '/deliver/export'
      ).then(response => {
        if (response.status === 200) {
          loading.close()
          this.$refs.sendProFilterTable[this.page_key].clearSelection()
          that.downloadFile(response.data, names)
        }
      })
    },
    exportAllExcel() {
      let names = ''
      if (this.key_index === '2') {
        names = '发货数据导出'
      } else if (this.key_index === '3') {
        names = '待收货数据导出'
      } else {
        names = '发货完成数据导出'
      }
      const that = this
      const loading = that.$loading({
        lock: true,
        text: '正在导出,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.exportCompanyExcel(
        { uid: this.uid, pageType: this.exportKey, value: this.search },
        '/return/exportInAll'
      ).then(response => {
        if (response.status === 200) {
          loading.close()
          that.downloadFile(response.data, names)
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.loading = false
    this.initBtn()
    this.getType()
    this.getUid()
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
  margin: 25px 30px;
  width: 97%;
}
.find {
  width: 100%;
  background-color: #fff;
}
.btn_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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
