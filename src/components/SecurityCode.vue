<!-- 激活码管理 -->
<template>
  <div style="margin:40px 60px;width:93%">
    <div
      style="display:flex;justify-content: space-between;margin-bottom:45px;"
      v-if="s_show"
    >
      <el-card class="box-card" style="margin-right:30px">
        <div class="header">
          <img :src="imgs.a_img" />
          <p style="margin-right:0">
            <span>{{ dataArr.useOuterFwCode }}</span
            ><span>/</span><span>{{ dataArr.unUseOuterFwCode }}</span>
          </p>
        </div>
        <p class="sumFont">
          <span>外盒防伪码库存量</span><span>{{ c_number }}%</span>
        </p>
        <el-progress :percentage="c_number" :show-text="false"></el-progress>
      </el-card>
      <el-card class="box-card">
        <div class="header">
          <img :src="imgs.c_img" />
          <p style="margin-right:0">
            <span>{{ dataArr.useCardFwCode }}</span
            ><span>/</span><span>{{ dataArr.unUseCardFwCode }}</span>
          </p>
        </div>
        <p class="sumFont">
          <span>卡片防伪码库存量</span><span>{{ a_number }}%</span>
        </p>
        <el-progress :percentage="a_number" :show-text="false"></el-progress>
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
          <div
            style="display: flex;width: 96%;justify-content: space-around;margin:25px 20px;"
          >
            <div style="display:flex;width:100%;">
              <el-input
                v-model="search"
                prefix-icon="el-icon-search"
                clearable
                style="border-radius:4px;width:400px;height: 90%;margin-right:10px"
                placeholder="输入关键字搜索"
              />
              <el-button @click="searchEnterFun()" type="primary"
                ><i class="el-icon-search"></i>搜索</el-button
              >
            </div>
            <div>
              <el-button @click="importData()" type="primary" v-if="i_show"
                ><i class="el-icon-download"></i>生成并导出</el-button
              >
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%;margin:0 20px"
            :header-cell-style="{
              fontSize: '15px',
              color: '#000',
              fontWeight: 800,
              background: '#eef1f6'
            }"
            v-loading="loading"
            border
            height="280"
            @filter-change="fnFilterChangeInit"
          >
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="150"
            >
            </el-table-column>
            <el-table-column prop="code" label="防伪码" align="center">
            </el-table-column>
            <el-table-column
              prop="codeType"
              label="类型"
              align="center"
              width="160"
              :filter-multiple="false"
              :filters="codeTypeGroup"
              :filter-method="filterTag"
              column-key="codeType"
              filter-placement="bottom-end"
            >
            </el-table-column>
            <el-table-column prop="createTime" :label="dateName" align="center">
            </el-table-column>
            <el-table-column prop="status" :label="statusName" align="center">
            </el-table-column>
            <!-- <el-table-column
                prop="status"
                label="状态"
                align="center"
                v-if="sumCount"
              >
              </el-table-column>
              <el-table-column
                prop="queryCount"
                label="激活次数"
                align="center"
                v-else
              > -->
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
    <el-dialog
      title="导出数据"
      :visible.sync="newDialogTableVisible"
      custom-class="sendPro"
      center
      width="620px"
    >
      <div class="fileContent">
        <p>类型：卡片防伪码</p>
        <div>
          <span>导出数量：</span>
          <el-input
            v-model="sums"
            style="width:300px;margin:20px 15px"
          ></el-input>
        </div>
        <div style="margin-bottom:30px">
          <span>导出文件：</span>
          <el-input
            v-model="exportFileName"
            style="width:300px;margin:20px 15px"
          ></el-input>
        </div>
        <div style="text-align: center;">
          <el-button @click="exportClientInfoExcel()" type="primary"
            >确认导出</el-button
          >
        </div>
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
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      dataArr: [],
      activeName: 'unUsed',
      tableData: [],
      currentPage: 1,
      limit: 100,
      total: 0,
      search: '',
      tabNames: [
        { label: '未使用', name: 'unUsed' },
        { label: '使用', name: 'havenUsed' }
      ],
      codeTypeGroup: [
        { text: '外盒防伪码', value: '外盒码' },
        { text: '卡片防伪码', value: '卡片码' }
      ],
      dateName: '生成日期',
      statusName: '状态',
      s_show: false,
      i_show: false,
      nowPage: '0',
      typeNumber: '4',
      imgs: {
        c_img: require('../assets/imgs/kpm.png'),
        a_img: require('../assets/imgs/whm.png')
      },
      c_number: 0,
      a_number: 0,
      newDialogTableVisible: false,
      sums: 0,
      sumCount: true,
      exportFileName: '',
      loading: true
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
      this.codeData(
        this.currentPage,
        this.limit,
        '/serveCode/fwCode/listData',
        this.search,
        this.nowPage,
        this.typeNumber
      ).then(res => {
        console.log(res)
        for (let i = 0; i < res.data.object.list.length; i++) {
          this.tableData.push({
            code: res.data.object.list[i].code,
            createTime: res.data.object.list[i].createTime,
            codeType: res.data.object.list[i].codeType,
            status: res.data.object.list[i].status
          })
        }
        this.getDataList(res.data.object.total)
      })
    },
    initSums() {
      this.getSums('/serveCode/fwCode/useCondition').then(res => {
        console.log(res)
        this.dataArr = res.data.object
        if (
          (this.dataArr.useOuterFwCode / this.dataArr.unUseOuterFwCode).toFixed(
            2
          ) * 100
        ) {
          this.c_number =
            (
              this.dataArr.useOuterFwCode / this.dataArr.unUseOuterFwCode
            ).toFixed(2) * 100
        }
        if (
          (this.dataArr.useCardFwCode / this.dataArr.unUseCardFwCode).toFixed(
            2
          ) * 100
        ) {
          this.a_number =
            (this.dataArr.useCardFwCode / this.dataArr.unUseCardFwCode).toFixed(
              2
            ) * 100
        }
      })
    },
    handleClick(tab, event) {
      if (tab.index === '1') {
        // 这里需要请求后台接口拿数据
        this.dateName = '最近查询日期'
        this.statusName = '已查询次数'
        this.nowPage = '1'
        this.codeData(
          this.currentPage,
          this.limit,
          '/serveCode/fwCode/listData',
          this.search,
          this.nowPage,
          this.typeNumber
        ).then(res => {
          this.tableData = []
          for (let i = 0; i < res.data.object.list.length; i++) {
            this.tableData.push({
              code: res.data.object.list[i].code,
              createTime: res.data.object.list[i].createTime,
              codeType: res.data.object.list[i].codeType,
              status: res.data.object.list[i].queryCount
            })
          }
          this.getDataList(res.data.object.total)
        })
      } else {
        this.dateName = '生成日期'
        this.statusName = '状态'
        this.nowPage = '0'
        this.initData()
      }
    },
    getDataList(toatl) {
      this.total = toatl
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // this.getDataList();
      this.initData()
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentPage = 1
      // this.getDataList();
    },
    filterTag(value, row, column) {
      return true
    },
    fnFilterChangeInit(filter) {
      console.log(filter)
      if (filter.codeType[0] === '外盒码') {
        this.typeNumber = '2'
      } else if (filter.codeType[0] === '卡片码') {
        this.typeNumber = '3'
      } else {
        this.typeNumber = '4'
      }
      this.initData()
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '统计') {
          this.s_show = true
        } else if (item.rightName === '生成并导出') {
          this.i_show = true
        }
      })
    },
    searchEnterFun() {
      this.codeData(
        this.currentPage,
        this.limit,
        '/serveCode/fwCode/listData',
        this.search,
        this.nowPage,
        '',
        ''
      ).then(res => {
        console.log(res)
        this.tableData = []
        for (let i = 0; i < res.data.object.list.length; i++) {
          this.tableData.push({
            code: res.data.object.list[i].code,
            createTime: res.data.object.list[i].createTime,
            status: res.data.object.list[i].status
          })
        }
        this.getDataList(res.data.object.total)
      })
    },
    importData() {
      this.newDialogTableVisible = true
      this.exportFileName = '卡片防伪码' + Date.parse(new Date())
      this.sums = 1
    },
    exportClientInfoExcel() {
      const that = this
      this.exportCompanyExcel(
        { number: that.sums },
        '/serveCode/fwCode/createAndExport'
      ).then(response => {
        if (response.status === 200) {
          that.downloadFile(response.data, this.exportFileName)
          this.newDialogTableVisible = false
          this.sums = 0
          this.initSums()
          this.initData()
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData()
    this.initBtn()
    this.initSums()
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
<style>
.el-tabs__item {
  width: 200px !important;
  text-align: center;

  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-top: 3px solid #2a426e;
}
::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
</style>

<style scoped>
.container {
  width: 1560px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 765px;
  height: 220px;
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
.fileContent {
  padding: 40px 60px;
}
</style>
