<!-- 对话弹框 -->
<template>
  <div>
    <el-dialog
      :title="headerText"
      :visible.sync="show"
      width="380px"
      top="35vh"
      center
      custom-class="dialogFont"
    >
      <span style="text-align: center;display:inline-block;width:100%">{{
        textName
      }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rebackStatu">取 消</el-button>
        <el-button type="primary" @click="changeNow ? changepwd() : loginOut()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  props: {
    centerDialogVisible: {
      type: Number
    },
    headerText: {
      type: String
    },
    textName: {
      type: String
    },
    changePwd: {
      type: Boolean
    },
    id: {
      type: Number
    }
  },
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      show: false,
      changeNow: false,
      keyId: 0
    }
  },
  // 监控data中的数据变化
  watch: {
    centerDialogVisible: {
      handler(newName, oldName) {
        this.show = true
      }
    },
    changePwd: {
      handler(newName, oldName) {
        if (newName) {
          console.log(1)
          this.changeNow = true
        }
      }
    },
    id: {
      handler(newName, oldName) {
        if (newName !== undefined) {
          console.log(2)
          this.keyId = newName
        }
      }
    }
  },
  // 方法集合
  methods: {
    loginOut() {
      this.getSums('/user/logout').then(res => {
        console.log(res)

        if (res.data.code === 200) {
          this.$router.push({
            path: '/login'
          })
        }
      })
      // if (!this.changePwd) {
      //   this.$cookieStore.getCookie('name')
      //   this.$cookieStore.delCookie('name')
      //   this.$router.push('/login')
      //   history.pushState(null, null, document.URL)
      //   window.addEventListener(
      //     'popstate',
      //     function(e) {
      //       history.pushState(null, null, document.URL)
      //     },
      //     false
      //   )
      // } else {
      //   this.resetPassword(this.id, 'user/resetPwd').then(res => {
      //     console.log(res)
      //   })
      //   this.show = false
      // }
    },
    rebackStatu() {
      this.show = false
      this.$emit('dialogClose')
    },
    changepwd() {
      this.dataChange({ id: this.keyId }, '/user/resetPwd').then(res => {
        if (res.data.code === 200) {
          this.show = false
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
<style scoped></style>
