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
          <div style="display:flex;margin-right:10px" v-if="s_show">
            <el-input
              v-model="search"
              style="border-radius:4px;width:400px;margin-right:10px"
              placeholder="输入关键字搜索"
            />
            <el-button @click="searchEnterFun()" type="primary"
              ><i class="el-icon-search"></i>搜索</el-button
            >
          </div>
          <div>
            <el-button
              @click="exportClientInfoExcel()"
              type="primary"
              size="medium"
              v-if="i_show"
              ><i class="el-icon-download"></i>导出</el-button
            >
          </div>
        </div>
        <el-table
          ref="filterTable"
          :data="tableData"
          @selection-change="selectionChangeHandle"
          @filter-change="fnFilterChangeInit"
          :row-key="getRowKey"
          style="width: 100%; margin:0 20px"
          border
          height="600"
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
              prop="materialModel"
              label="产品型号"
              align="center"
              width="150"
              :filter-multiple="false"
              :filters="materialModelGroup"
              :filter-method="filterTag"
              column-key="materialModel"
              filter-placement="bottom-end"
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
              v-if="unsed"
              prop="user"
              label="使用人 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="sex"
              label="性别 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="age"
              label="年龄 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="hospitalName"
              label="手术机构 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="hospitalAddress"
              label="机构地址 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              v-if="unsed"
              prop="appointmentDate"
              label="预约日期 "
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="cartonCode"
              label="箱码"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="activateCode"
              label="激活码"
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="lastSigner"
              label="签收单位"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="signTime"
              label="签收日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="activateStatus"
              label="激活状态"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              v-if="!unsed"
              prop="activateTime"
              label="激活日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="productId"
              label="操作"
              align="center"
              width="150"
              v-if="r_show"
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
      materialModelGroup: [],
      tableDataSelections: [],
      tableData: [],
      search: '',
      tabNames: [
        { label: '全部', name: 'wait' },
        { label: '已激活', name: 'backProduct' }
      ],
      activeName: 'wait',
      dialogVisible: false,
      stepGroups: [],
      s_show: false,
      i_show: false,
      r_show: false,
      key_index: '0',
      unsed: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {
      this.tableData = []
      this.searchAll(
        this.currentPage,
        this.limit,
        '/productTrace/listData',
        '&type=',
        this.key_index,
        '&value=',
        this.search,
        '',
        '',
        '',
        ''
      ).then(res => {
        console.log(res)
        this.tableData = res.data.object.list
        this.getDataList(res.data.object.total)
      })
    },

    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true
    },
    selectionChangeHandle(selection) {
      this.tableDataSelections = []
      // this.btnShow = false
      for (let i = 0; i < selection.length; i++) {
        this.tableDataSelections.push(selection[i].productId)
      }
      console.log(this.tableDataSelections)
    },
    getDataList(total) {
      this.total = total
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.initData()
    },

    handleClick(tab, event) {
      if (tab.index === '1') {
        this.key_index = '1'
        this.unsed = true
      } else {
        this.key_index = '0'
        this.unsed = false
      }
      this.initData()
    },
    fnFilterChangeInit(filter) {
      console.log(filter)
      const arr = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].materialModel === filter.materialModel[0]) {
          arr.push(this.tableData[i])
        }
      }
      this.tableData = arr
    },
    getRowKey(row) {
      return row.productId
    },
    getReport(row) {
      this.dialogVisible = true
      this.stepGroups = []
      this.sendId(row.productId, '/productTrace/generateReport').then(res => {
        for (let i = 0; i < res.data.object.length; i++) {
          if (res.data.object[i].productStatus === '已发出') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'el-icon-truck',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '发货时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          } else if (res.data.object[i].productStatus === '已签收') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'el-icon-circle-check',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '签收时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          } else if (res.data.object[i].productStatus === '已激活') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'el-icon-unlock',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '激活时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          } else if (res.data.object[i].productStatus === '已使用') {
            this.stepGroups.push({
              stepName: res.data.object[i].productStatus,
              iconType: 'el-icon-user',
              stepContent: res.data.object[i].opUser,
              stepTime:
                '使用时间：' +
                this.translateTime(res.data.object[i].createTime.time)
            })
          }
        }
        this.stepGroups.reverse()
        console.log(res.data.object)
      })
    },
    saveImg() {
      this.dialogVisible = false
      console.log('保存图片')
    },
    quitNow() {
      this.dialogVisible = false
      console.log('取消')
    },
    translateTime(times) {
      const date = new Date(times)
      const Y = date.getFullYear() + '-'
      const M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      const D = date.getDate() + ' '
      const h = date.getHours() + ':'
      const m = date.getMinutes() + ':'
      const s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '统计') {
          this.s_show = true
        } else if (item.rightName === '导出') {
          this.i_show = true
        } else if (item.rightName === '报告') {
          this.r_show = true
        }
      })
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
    searchEnterFun() {
      this.initData()
    },
    exportClientInfoExcel() {
      const ids = this.tableDataSelections.join(',')
      let names = ''
      if (this.key_index === '0') {
        names = '产品全部数据导出'
      } else {
        names = '产品已激活数据导出'
      }
      const that = this
      this.exportCompanyExcel(
        { productIds: ids, type: this.key_index },
        '/productTrace/export'
      ).then(response => {
        if (response.status === 200) {
          that.downloadFile(response.data, names)
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData()
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
.el-step {
  padding: 8px 100px;
}
.container {
  margin: 40px 60px;
  width: 1560px;
}
.find {
  width: 100%;
  background-color: #fff;
}
.btn_header {
  display: flex;
  justify-content: space-between;
  margin: 25px 20px;
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
