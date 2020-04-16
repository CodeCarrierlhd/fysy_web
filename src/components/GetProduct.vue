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
            <el-button @click="searchEnterFun()" type="primary">搜索</el-button>
          </div>
          <div>
            <el-button
              @click="exportData()"
              type="primary"
              size="medium"
              v-if="i_show"
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
              prop="lastSigner"
              label="签收单位"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="signTime"
              label="签收日期"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="activateStatus"
              label="激活状态"
              align="center"
              width="100"
            >
            </el-table-column>
            <el-table-column
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
      limit: 11,
      total: 0,
      materialModelGroup: [],
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
      nowStatu: '0'
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
        this.nowStatu,
        '&value=',
        this.search,
        '',
        '',
        '',
        ''
      ).then(res => {
        console.log(res)
        this.tableData = res.data.object.list
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].id = i
        }
        this.getDataList(res.data.object.total)
      })
    },

    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true
    },
    getDataList(total) {
      this.total = total
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },

    handleClick(tab, event) {
      if (tab.index === '1') {
        this.nowStatu = '1'
      } else {
        this.nowStatu = '0'
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
      return row.id
    },
    getReport(row) {
      this.dialogVisible = true
      this.stepGroups = []
      this.sendId(row.productId, '/productTrace/generateReport').then(res => {
        //  {
        //   stepName: '已发出',
        //   iconType: 'el-icon-truck',
        //   stepContent: '激活单位：上海美莱医疗美容整形医院',
        //   stepTime: '2020.02.03 10:00:31'
        // },
        // {
        //   stepName: '已签收',
        //   iconType: 'el-icon-circle-check',
        //   stepContent: '签收单位：上海美莱医疗美容整形医院',
        //   stepTime: '2020.02.03 10:00:31'
        // },
        // {
        //   stepName: '已激活',
        //   iconType: 'el-icon-unlock',
        //   stepContent: '激活单位：上海美莱美容整形医院',
        //   stepTime: '2020.02.03 10:00:31'
        // },
        // {
        //   stepName: '已使用',
        //   iconType: 'el-icon-user',
        //   stepContent: '使用单位：上海美莱美',
        //   stepTime: '2020.02.03 10:00:31'
        // }
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
      /**
 1. 下面是获取时间日期的方法，需要什么样的格式自己拼接起来就好了
 2. 更多好用的方法可以在这查到 -> http://www.w3school.com.cn/jsref/jsref_obj_date.asp
 */
      // date.getFullYear() // 获取完整的年份(4位,1970)
      // date.getMonth() // 获取月份(0-11,0代表1月,用的时候记得加上1)
      // date.getDate() // 获取日(1-31)
      // date.getTime() // 获取时间(从1970.1.1开始的毫秒数)
      // date.getHours() // 获取小时数(0-23)
      // date.getMinutes() // 获取分钟数(0-59)
      // date.getSeconds() // 获取秒数(0-59)

      // 例如：
      // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
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
