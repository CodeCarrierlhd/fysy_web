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
    >
      <img :src="logoImg" style="width:360px" />
      <p>修改密码</p>
      <!-- <el-form-item v-for="(item, index) in pd_array" :key="index" prop="item">
        <el-input
          @keyup.enter="handleLogin"
          :type="item"
          v-model="loginForm['item' + index]"
          placeholder="原密码"
          class="n_input"
        >
          <i
            class="el-icon-view "
            :style="item"
            slot="suffix"
            @click.self="showPassword"
          ></i
        ></el-input>
      </el-form-item> -->
      <el-form-item prop="o_password">
        <el-input
          @keyup.enter="handleLogin"
          :type="o_password"
          v-model="loginForm.o_password"
          placeholder="原密码"
          class="n_input"
        >
          <i
            class="el-icon-view "
            :style="fontstyle"
            slot="suffix"
            @click="showPassword"
          ></i
        ></el-input>
      </el-form-item>
      <el-form-item prop="n_password">
        <el-input
          @keyup.enter="handleLogin"
          :type="n_password"
          v-model="loginForm.n_password"
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
      <el-form-item prop="tn_password">
        <el-input
          @keyup.enter="handleLogin"
          :type="tn_password"
          v-model="loginForm.tn_password"
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
      <el-form-item prop="verifycode">
        <!-- 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 -->
        <!-- <el-input
          v-model="loginForm.verifycode"
          placeholder="请输入验证码"
          class="identifyinput"
        ></el-input>-->
        <div style="display:flex;justify-content: space-between;">
          <el-input
            type="text"
            v-model="loginForm.verifycode"
            placeholder="验证码"
            class="identifyinput"
          ></el-input>
          <div>
            <div @click="refreshCode">
              <!-- <s-identify :identifyCode="identifyCode"></s-identify> -->
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
        <el-button
          size="midle"
          @click.native.prevent="editUserInfo"
          class="edit-submit"
          >确认修改</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          size="midle"
          @click.native.prevent="cancleEdit"
          class="edit-cancle"
          >取消并返回</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  name: 'userEdit',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // 这里存放数据
    return {
      logoImg: require('@/assets/logo/log_b.png'),
      identifyCode: 'http://192.168.16.15:8080/login/getVerifyCode',
      // pd_array: ["o_password", "n_password", "tn_password"],
      fontstyle: {},
      fontstyle1: {},
      fontstyle2: {},
      loginForm: {
        o_password: '',
        n_password: '',
        tn_password: '',
        verifycode: ''
      },
      checked: false,
      // identifyCodes: "1234567890",
      // identifyCode: "",
      loginRules: {
        // 绑定在form表单中的验证规则
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
        // verifycode: [
        //   { required: true, trigger: "blur", validator: validateVerifycode }
        // ]
      },
      o_password: 'password',
      n_password: 'password',
      tn_password: 'password',
      d_statu: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    showPassword () {
      this.fontstyle === ''
        ? (this.fontstyle = 'color: red')
        : (this.fontstyle = '') // 改变密码可见按钮颜色
      this.o_password === ''
        ? (this.o_password = 'password')
        : (this.o_password = '')
    },
    showPassword1 () {
      this.fontstyle1 === ''
        ? (this.fontstyle1 = 'color: red')
        : (this.fontstyle1 = '') // 改变密码可见按钮颜色
      this.n_password === ''
        ? (this.n_password = 'password')
        : (this.n_password = '')
    },
    showPassword2 () {
      this.fontstyle2 === ''
        ? (this.fontstyle2 = 'color: red')
        : (this.fontstyle2 = '') // 改变密码可见按钮颜色
      this.tn_password === ''
        ? (this.tn_password = 'password')
        : (this.tn_password = '')
    },
    editUserInfo () {
      console.log(this.loginForm)
      // const { o_password, n_password, tn_password } = this.loginForm;
      if (this.loginForm.n_password !== this.loginForm.tn_password) {
        // this.d_statu = true;
        // this.$emit("childFn", this.d_statu);
      }
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     // 通过store 中的login 方法进行登陆验证
      //     this.$store
      //       .dispatch("login", this.loginForm)
      //       .then(code => {
      //         console.log(code);
      //         if (code === 0) {
      //           const path = this.$route.query.redirect || "/";
      //           this.$router.push({
      //             path,
      //             query: {
      //               // 注意需要提前把对象当作字符串传递过去 在接收页面转为对象 这样页面刷新就不会将对象转成了字符串
      //               userInfo: JSON.stringify(this.loginForm)
      //             }
      //           });
      //         }
      //       })
      //       .catch(error => {
      //         console.log(error.message);
      //       });
      //   }
      // });
    },
    refreshCode () {
      var timestamp = new Date().getTime()
      this.identifyCode =
        'http://192.168.16.15:8080/login/getVerifyCode?' + timestamp

      // this.makeCode(this.identifyCodes, 4);
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {},
  beforeCreate () {}, // 生命周期 - 创建之前
  beforeMount () {}, // 生命周期 - 挂载之前
  beforeUpdate () {}, // 生命周期 - 更新之前
  updated () {}, // 生命周期 - 更新之后
  beforeDestroy () {}, // 生命周期 - 销毁之前
  destroyed () {}, // 生命周期 - 销毁完成
  activated () {} // 如果页面有keep-alive缓存功能，这个函数会触发
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
input[type="text"]:focus,
input[type="password"]:focus {
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
