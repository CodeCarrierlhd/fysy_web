<template>
  <div class="loginContent" :style="backgroundDiv">
    <!-- <img :src="r_img" style="width:66.7%;height:100%" /> -->
    <el-form
      class="login-form"
      status-icon
      :rules="loginRules"
      ref="loginForm"
      :model="loginForm"
      label-width="0"
    >
      <img :src="logoImg" style="width:360px" />
      <p>超体鼻假体防伪溯源系统登陆</p>
      <el-form-item prop="username">
        <el-input
          type="text"
          @keyup.enter.native="keyEnter"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          class="n_input"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          @keyup.enter.native="keyEnter"
          :type="passwordType"
          v-model="loginForm.password"
          placeholder="请输入密码"
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
      <el-form-item prop="verifyCode">
        <div style="display:flex;justify-content: space-between;">
          <div>
            <el-input
              type="text"
              v-model="loginForm.verifyCode"
              placeholder="请输入验证码"
              class="identifyinput"
              @keyup.enter.native="keyEnter"
            ></el-input>
          </div>

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
          type="primary"
          size="small"
          @click="handleLogin"
          class="login-submit"
          >登录</el-button
        >
      </el-form-item>
      <el-checkbox v-model="checked" style="float:left;" @change="delPawd"
        >记住账号和密码</el-checkbox
      >
    </el-form>
  </div>
</template>
<script>
// import SIdentify from "@/components/SecurityCode";
// import axios from "axios";
import us from '../services/users'
export default {
  name: 'userlogin',
  img_url: '',
  data() {
    // 用户名自定义验证规则
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }

    return {
      // r_img: require('@/assets/logo/bg1.png'),
      backgroundDiv: {
        backgroundImage: 'url(' + require('@/assets/logo/bg1.png') + ')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      },

      logoImg: require('@/assets/logo/log_b.png'),
      identifyCode: '',
      fontstyle: {},
      loginForm: {
        username: '',
        password: '',
        verifyCode: ''
      },
      name: '',
      checked: false,
      loginRules: {
        // 绑定在form表单中的验证规则
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
        // verifyCode: [
        //   { required: true, trigger: 'blur', validator: validateverifyCode }
        // ]
      },
      passwordType: 'password'
    }
  },
  // components: {
  //   SIdentify
  // },
  created() {
    this.getIdentifyCode()
    this.getRemeberUser()
  },
  mounted() {
    // 验证码初始化
    // this.identifyCode = "";
    // this.makeCode(this.identifyCodes, 4);
    // console.log(process.env.VUE_APP_BASEURL)
  },
  computed: {},
  props: [],
  methods: {
    // 通过改变input的type使密码可见
    showPassword() {
      this.fontstyle === ''
        ? (this.fontstyle = 'color: red')
        : (this.fontstyle = '') // 改变密码可见按钮颜色
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    keyEnter() {
      this.handleLogin()
    },
    // 点击登入按钮
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 通过store 中的login 方法进行登陆验证
          us.login(this.loginForm)
            .then(res => {
              console.log(res)

              if (res.data.code === 200) {
                if (this.checked) {
                  const str =
                    this.loginForm.username + '&' + this.loginForm.password
                  const enc = this.encryptString(str)
                  localStorage.setItem('ak47', enc)
                }
                const path = this.$route.query.redirect || '/'
                this.$router.push({
                  path
                })
              } else {
                this.getIdentifyCode()
                this.$alert(res.data.msg, '错误', {
                  confirmButtonText: '确定'
                })
              }
            })
            .catch(error => {
              console.log(error.message)
            })
        }
      })
    },
    // 生成随机数
    // randomNum(min, max) {
    //   return Math.floor(Math.random() * (max - min) + min);
    // },
    // 切换验证码
    refreshCode() {
      this.getIdentifyCode()
      // this.makeCode(this.identifyCodes, 4);
    },
    getIdentifyCode() {
      var timestamp = new Date().getTime()
      this.identifyCode = us.identifyCode() + '?' + timestamp
    },
    // 生成四位随机验证码
    // makeCode(o, l) {
    //   for (let i = 0; i < l; i++) {
    //     this.identifyCode += this.identifyCodes[
    //       this.randomNum(0, this.identifyCodes.length)
    //     ];
    //   }
    // }

    getRemeberUser() {
      const userinfo = localStorage.getItem('ak47')
      if (userinfo) {
        const dec = this.decodeString(userinfo)
        const pwdarr = dec.split('&')
        this.$nextTick(() => {
          this.loginForm.username = pwdarr[0]
          this.loginForm.password = pwdarr[1]
          this.checked = true
        })
      }
    },
    delPawd() {
      if (!this.checked) {
        localStorage.removeItem('ak47')
      }
    }
  }
}
</script>
<style scoped>
.iconstyle {
  color: #409eff;
}
.login-form {
  text-align: center;
  padding: 210px 140px 0 140px;
  width: 360px;
  height: 100%;
  background-color: #ffffff;
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
  border-bottom: 2px solid #d8d8d8;
  font-size: 20px;
  padding: 0 15px;
}
input[type='text']:focus,
input[type='password']:focus {
  outline: none;
}
.el-button {
  width: 100%;
}
.identifyinput {
  height: 100%;
}
.n_input >>> .el-input__inner,
.identifyinput >>> .el-input__inner {
  border-top: 0 !important;
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}
.identifyinput >>> .el-input__inner {
  width: 210px;
  height: 100%;
}
.loginContent {
  height: 100%;
  width: 100%;
  /* background: no-repeat center top;
  background-size: contain; */
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
}
</style>
