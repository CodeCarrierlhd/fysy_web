<!-- 激活码管理 -->
<template>
  <div class="container">
    <div
      style="display:flex;justify-content: space-between;margin-bottom:45px"
      v-if="s_show"
    >
      <el-card class="box-card">
        <div class="header">
          <img :src="imgs.a_img" />
          <p style="margin-right:0">
            <span>{{ dataArr.useCarton }}</span
            ><span>/</span><span>{{ dataArr.unUseCarton }}</span>
          </p>
        </div>
        <p class="sumFont">
          <span>外箱码库存量</span><span>{{ c_number }}%</span>
        </p>
        <el-progress :percentage="c_number" :show-text="false"></el-progress>
      </el-card>
      <el-card class="box-card">
        <div class="header">
          <img :src="imgs.c_img" />
          <p style="margin-right:0">
            <span>{{ dataArr.useActiviate }}</span
            ><span>/</span><span>{{ dataArr.unUseActiviate }}</span>
          </p>
        </div>
        <p class="sumFont">
          <span>激活码库存量</span><span>{{ a_number }}%</span>
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
            style="display: flex;width: 96%;justify-content: space-around;margin:20px 25px;"
          >
            <div style="display:flex;width:100%;">
              <el-input
                v-model="search"
                style="border-radius:4px;width:400px;height: 90%;margin-right:10px"
                placeholder="输入关键字搜索"
              />
              <el-button @click="searchEnterFun()" type="primary"
                ><i class="el-icon-search"></i>搜索</el-button
              >
            </div>
            <div>
              <el-button @click="importData()" type="primary" v-if="i_show"
                ><i class="el-icon-upload2"></i> 导入</el-button
              >
            </div>
          </div>

          <el-table
            :data="
              tableData.slice((currentPage - 1) * limit, currentPage * limit)
            "
            style="width: 96%;padding:0 20px;"
            border
            height="300"
          >
            <el-table-column class-name="t_header">
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="150"
              >
              </el-table-column>
              <el-table-column prop="code" label="激活码" align="center">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="生成日期"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="status" label="状态" align="center">
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
    <el-dialog
      title="导入数据"
      :visible.sync="newDialogTableVisible"
      custom-class="sendPro"
      center
      width="620px"
    >
      <el-radio-group v-model="radio">
        <el-radio :label="0">激活码</el-radio>
        <el-radio :label="1">箱码</el-radio>
      </el-radio-group>
      <el-upload
        :multiple="false"
        :show-file-list="false"
        :http-request="handleChange"
        accept=".xls,.xlsx"
        action="string"
      >
        <el-button size="medium" type="primary">上传文件</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import pagination from '../components/Pagenation'
import axios from 'axios'

export default {
  // import引入的组件需要注入到对象中才能使用
  // eslint-disable-next-line vue/no-unused-components
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      activeName: '0',
      tableData: [],
      currentPage: 1,
      limit: 100,
      total: 0,
      search: '',
      nowPage: '-1',
      s_show: false,
      i_show: false,
      tabNames: [
        { label: '未使用', name: '0' },
        { label: '已使用', name: '1' }
      ],
      imgs: {
        c_img: require('../assets/imgs/active_left.png'),
        a_img: require('../assets/imgs/active_right.png')
      },
      dataArr: [],
      c_number: 0,
      a_number: 0,
      radio: 0,
      newDialogTableVisible: false
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
        'serveCode/activateCode/listData',
        this.search,
        this.nowPage,
        ''
      ).then(res => {
        console.log(res)

        for (let i = 0; i < res.data.object.list.length; i++) {
          this.tableData.push({
            code: res.data.object.list[i].code,
            createTime: res.data.object.list[i].createTime,
            status: res.data.object.list[i].status,
            queryCount: res.data.object.list[i].queryCount
          })
        }
        this.getDataList(res.data.object.total)
      })
    },
    initSums() {
      this.getSums('/serveCode/activateCode/useCondition').then(res => {
        console.log(res)
        this.dataArr = res.data.object
        if (
          (this.dataArr.useCarton / this.dataArr.unUseCarton).toFixed(2) * 100
        ) {
          this.c_number =
            (this.dataArr.useCarton / this.dataArr.unUseCarton).toFixed(2) * 100
        }
        if (
          (this.dataArr.useActiviate / this.dataArr.unUseActiviate).toFixed(2) *
          100
        ) {
          this.a_number =
            (this.dataArr.useActiviate / this.dataArr.unUseActiviate).toFixed(
              2
            ) * 100
        }
      })
    },
    handleClick(tab, event) {
      if (tab.index === '1') {
        this.nowPage = '1'
      } else {
        this.nowPage = '0'
      }
      this.initData()
    },
    getDataList(total) {
      this.total = total
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentPage = 1
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      btnArr.forEach(item => {
        if (item.rightName === '统计') {
          this.s_show = true
        } else if (item.rightName === '导入') {
          this.i_show = true
        }
      })
    },
    searchEnterFun() {
      this.codeData(
        this.currentPage,
        this.limit,
        'serveCode/activateCode/listData',
        this.search,
        this.nowPage,
        '',
        ''
      ).then(res => {
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
    },
    handleChange(param) {
      const fd = new FormData()
      fd.append('file', param.file) // 传文件
      fd.append('codeType ', this.radio) // 传参数
      axios.post('/serveCode/import/activateCode', fd).then(res => {
        console.log(res)
        this.initData()
        this.initSums()
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: res.data.msg,
            duration: 2000
          })
        } else {
          this.$alert(res.data.msg, '错误提示', {
            confirmButtonText: '确定'
          })
        }
        this.newDialogTableVisible = false
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData()
    this.initSums()
    this.initBtn()
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
.sendPro >>> .el-dialog__body {
  display: flex !important;
}
</style>
