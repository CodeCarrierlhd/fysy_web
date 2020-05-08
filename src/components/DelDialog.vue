<!-- 删除弹框组件 -->
<template>
  <div>
    <el-dialog
      :title="headerTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      center
      top="35vh"
      width="400px"
    >
      <div style="text-align:center">
        <p style="padding:0 0 45px 0">{{ delContent }}</p>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  // import引入的组件需要注入到对象中才能使用
  props: {
    headerTitle: {
      type: String
    },
    ids: {
      type: String
    },
    delPath: {
      type: String
    },
    delContent: {
      type: String
    },
    keyNumber: {
      type: Number
    }
  },
  components: {},
  data() {
    // 这里存放数据
    return {
      dialogVisible: false,
      keyId: 0,
      pathName: '',
      textContent: ''
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    ids: {
      handler(newName, oldName) {
        this.keyId = newName
      }
    },
    delPath: {
      handler(newName, oldName) {
        this.pathName = newName
      }
    },
    delContent: {
      handler(newName, oldName) {
        this.textContent = newName
      }
    },
    keyNumber: {
      handler(newName, oldName) {
        this.dialogVisible = true
      }
    }
  },
  // 方法集合
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    delData() {
      this.delItem(this.keyId, this.delPath).then(res => {
        if (res.data.code === 200) {
          this.$emit('onLoadData')
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            position: 'top-right',
            duration: 2000
          })
        }
      })
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
}
</script>
<style></style>
