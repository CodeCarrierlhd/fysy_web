<!-- 分页组件 -->
<template>
  <div class="pageComp">
    <div>
      <p style="line-height: 46px;font-size: 13px;" v-if="numberShow">
        已选中
        <span class="numberSize">{{ numberSize }}</span> 条
      </p>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total,prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size="limit"
        :total="total"
        :small="small"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      currentPage: 1
    }
  },
  props: {
    // 避免直接改变prop属性
    // 'currentPage': {
    //   required: false,
    //   default: 1
    // },
    total: {
      required: false,
      default: 0
    },
    numberSize: {
      required: false,
      default: 0
    },
    limit: {
      required: false,
      default: 10
    },
    small: {
      required: false,
      type: Boolean,
      default: false
    },
    numberShow: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    currentPage(val) {
      // 改变这个值并不会触发 handleCurrentChange
      if (typeof val === 'number') {
        console.log('prop currentPage!!!')
        this.currentPage = val
      }
    }
  },
  // 方法集合
  methods: {
    // 当前页变化
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
    // size变化
    // handleSizeChange(val) {
    //   this.currentPage = 1;
    //   this.$emit("handleSizeChange", val);
    // }
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
}
</script>
<style scope>
.pageComp {
  display: flex;
  justify-content: space-between;
}
.pagination {
  text-align: right;
  padding: 10px 0;
}
.numberSize {
  padding: 0 5px;
  color: #409eff;
  font-size: 16px;
  font-weight: 500;
}
</style>
