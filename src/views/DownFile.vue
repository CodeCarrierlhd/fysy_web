<!--  -->
<template>
  <div :style="backgroundDiv" class="downFile">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="versions" align="center">
      </el-table-column>
      <el-table-column prop="updateTime" label="time" align="center">
      </el-table-column>
      <el-table-column prop="fileSize" label="size" width="70" align="center">
      </el-table-column>
      <el-table-column prop="path" label="down" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="downFileNow(scope.row.path)"
            size="mini"
            >下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import '../utils/flexible'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      backgroundDiv: {
        backgroundImage: 'url(' + require('@/assets/logo/down_bg.png') + ')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        margin: '0 20px'
      },
      tableData: []
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initList() {
      this.getSums('/down/' + this.$route.params.packType).then(res => {
        console.log(res)
        this.tableData = res.data.object
      })
    },
    downFileNow(path) {
      const link = document.createElement('a')
      link.setAttribute('download', '')
      link.href = path
      link.click()
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initList()
  },
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
.downFile {
  overflow-x: hidden;
}
</style>
