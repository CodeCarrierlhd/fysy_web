<!-- 修改用户密码 -->
<template>
  <div class="editUser">
    <el-form
      class="login-form"
      status-icon
      :rules="loginRules"
      ref="loginForm"
      :model="loginForm"
      label-width="0"
      @submit.native.prevent
    >
      <img :src="logoImg" style="width:360px" />
      <p>修改密码</p>
      <el-form-item prop="oldPwd">
        <el-input
          @keyup.enter="handleLogin"
          :type="oldPwd"
          v-model="loginForm.oldPwd"
          placeholder="原密码"
          class="n_input"
        >
          <i
            class="el-icon-view"
            :style="fontstyle"
            slot="suffix"
            @click="showPassword"
          ></i
        ></el-input>
      </el-form-item>
      <el-form-item prop="newPwd">
        <el-input
          @keyup.enter="handleLogin"
          :type="newPwd"
          v-model="loginForm.newPwd"
          placeholder="新密码"
          class="n_input"
        >
          <i
            class="el-icon-view "
            :style="fontstyle1"
            slot="suffix"
            @click="showPassword1"
          ></i
        ></el-input>
      </el-form-item>
      <el-form-item prop="newPwdAgain">
        <el-input
          @keyup.enter="handleLogin"
          :type="newPwdAgain"
          v-model="loginForm.newPwdAgain"
          placeholder="请再次输入新密码"
          class="n_input"
        >
          <i
            class="el-icon-view "
            :style="fontstyle2"
            slot="suffix"
            @click="showPassword2"
          ></i
        ></el-input>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <div style="display:flex;justify-content: space-between;">
          <el-input
            type="text"
            v-model="loginForm.verifyCode"
            placeholder="验证码"
            class="identifyinput"
          ></el-input>
          <div>
            <div @click="refreshCode">
              <img
                :src="identifyCode"
                alt
                style="width:100%;height:100%;display:block"
              />
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click.native.prevent="editUserInfo" class="edit-submit"
          >确认修改</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button @click.native.prevent="cancleEdit" class="edit-cancle"
          >取消并返回</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import us from '../services/users'

export default {
  name: 'userEdit',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    const validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
        this.getIdentifyCode()
      } else if (value !== this.loginForm.newPwd) {
        callback(new Error('两次密码不一致请重新输入!'))
      } else {
        callback()
      }
    }
    // 这里存放数据
    return {
      logoImg: require('@/assets/logo/log_b.png'),
      identifyCode: '',
      fontstyle: {},
      fontstyle1: {},
      fontstyle2: {},
      loginForm: {
        oldPwd: '',
        newPwd: '',
        newPwdAgain: '',
        verifyCode: ''
      },
      oldPwd: 'password',
      newPwd: 'password',
      newPwdAgain: 'password',
      checked: false,
      // identifyCodes: "1234567890",
      // identifyCode: "",
      loginRules: {
        newPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        newPwdAgain: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePwd
          },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      d_statu: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    showPassword() {
      this.fontstyle === ''
        ? (this.fontstyle = 'color: red')
        : (this.fontstyle = '') // 改变密码可见按钮颜色
      this.oldPwd === '' ? (this.oldPwd = 'password') : (this.oldPwd = '')
    },
    showPassword1() {
      this.fontstyle1 === ''
        ? (this.fontstyle1 = 'color: red')
        : (this.fontstyle1 = '') // 改变密码可见按钮颜色
      this.newPwd === '' ? (this.newPwd = 'password') : (this.newPwd = '')
    },
    showPassword2() {
      this.fontstyle2 === ''
        ? (this.fontstyle2 = 'color: red')
        : (this.fontstyle2 = '') // 改变密码可见按钮颜色
      this.newPwdAgain === ''
        ? (this.newPwdAgain = 'password')
        : (this.newPwdAgain = '')
    },
    editUserInfo() {
      this.dataChange(this.loginForm, '/user/updatePwd').then(res => {
        if (res.data.code === 200) {
          this.$refs.loginForm.resetFields()
          this.$notify({
            title: '成功',
            message: '密码重置成功',
            position: 'top-right',
            duration: 5000,
            type: 'success'
          })
          this.$emit('childFn', '')
        } else {
          this.getIdentifyCode()
          this.$notify({
            title: '错误',
            message: res.data.msg + '请重新输入',
            position: 'top-right',
            duration: 5000
          })
        }
      })
    },

    refreshCode() {
      this.getIdentifyCode()
      // this.makeCode(this.identifyCodes, 4);
    },
    getIdentifyCode() {
      var timestamp = new Date().getTime()
      this.identifyCode = us.identifyCode() + '?' + timestamp
    },
    cancleEdit() {
      this.$emit('childFn', '')
      this.$refs.loginForm.resetFields()
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getIdentifyCode()
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
.editUser {
  width: 640px;
  background: #fff;
  height: 100%;
  position: absolute;
  right: 0;
  z-index: 100;
}
.identifyinput {
  width: 150px !important;
}
/* .iconstyle {
  color: #409eff;
} */
.login-form {
  margin: auto;
  text-align: center;
  margin-top: 25.1%;
  width: 300px;
}
.login-form p {
  font-size: 24px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  margin-top: 22px;
  margin-bottom: 130px;
}
.el-form-item__content input {
  width: 300px;
  border-bottom: 2px solid #d8d8d8;
  font-size: 20px;
}
input[type='text']:focus,
input[type='password']:focus {
  outline: none;
}
.el-button {
  width: 300px;
}

.edit-submit:focus,
.edit-cancle:focus,
.edit-submit:hover,
.edit-cancle:hover {
  color: rgba(255, 255, 255, 1);
  background-color: #0d82f6 !important;
}
.edit-submit:focus span,
.edit-cancle:focus span,
.edit-submit:hover span,
.edit-cancle:hover span {
  color: rgba(255, 255, 255, 1);
}
.n_input >>> .el-input__inner,
.identifyinput >>> .el-input__inner {
  border-top: 0 !important;
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}
</style>
