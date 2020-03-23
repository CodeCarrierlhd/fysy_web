<template>
  <div style="display:flex;height:100%">
    <img :src="r_img" style="width:66.7%;height:100%" />
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
        <input
          type="text"
          @keyup.enter="handleLogin"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <input
          @keyup.enter="handleLogin"
          :type="passwordType"
          v-model="loginForm.password"
          placeholder="请输入密码"
        />
        <i
          class="el-icon-view el-input__icon"
          :style="fontstyle"
          slot="suffix"
          @click="showPassword"
        ></i>
      </el-form-item>
      <el-form-item prop="verifycode">
        <!-- 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 -->
        <!-- <el-input
          v-model="loginForm.verifycode"
          placeholder="请输入验证码"
          class="identifyinput"
        ></el-input>-->
        <input
          type="text"
          v-model="loginForm.verifycode"
          placeholder="请输入验证码"
          class="identifyinput"
        />
      </el-form-item>
      <el-form-item>
        <div class="identifybox">
          <div @click="refreshCode">
            <!-- <s-identify :identifyCode="identifyCode"></s-identify> -->
            <img
              src="http://192.168.16.15:8080/login/getVerifyCode"
              alt
              style="width:100%;height:100%;display:block"
            />
          </div>
          <el-button @click="refreshCode" type="text" class="textbtn">看不清，换一张</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click.native.prevent="handleLogin"
          class="login-submit"
        >登录</el-button>
      </el-form-item>
      <el-checkbox v-model="checked" style="float:left;padding-left:30px">记住账号和密码</el-checkbox>
    </el-form>
  </div>
</template>
<script>
// import SIdentify from "@/components/SecurityCode";
export default {
  name: "userlogin",
  img_url: "",
  data() {
    // 用户名自定义验证规则
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    // 验证码自定义验证规则
    // const validateVerifycode = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入验证码"));
    //   } else if (value !== this.identifyCode) {
    //     console.log("validateVerifycode:", value, this.identifyCode);
    //     callback(new Error("验证码不正确!"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      r_img: require("@/assets/logo/bg1.png"),
      logoImg: require("@/assets/logo/log_b.png"),
      fontstyle: {},
      loginForm: {
        username: "admin",
        password: "123456",
        verifycode: ""
      },
      checked: false,
      // identifyCodes: "1234567890",
      // identifyCode: "",
      loginRules: {
        // 绑定在form表单中的验证规则
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少为6位", trigger: "blur" }
        ]
        // verifycode: [
        //   { required: true, trigger: "blur", validator: validateVerifycode }
        // ]
      },
      passwordType: "password"
    };
  },
  // components: {
  //   SIdentify
  // },
  created() {},
  mounted() {
    // 验证码初始化
    // this.identifyCode = "";
    // this.makeCode(this.identifyCodes, 4);
  },
  computed: {},
  props: [],
  methods: {
    // 通过改变input的type使密码可见
    showPassword() {
      this.fontstyle === ""
        ? (this.fontstyle = "color: red")
        : (this.fontstyle = ""); // 改变密码可见按钮颜色
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    // 点击登入按钮
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 通过store 中的login 方法进行登陆验证
          this.$store
            .dispatch("login", this.loginForm)
            .then(code => {
              console.log(code);
              if (code === 0) {
                const path = this.$route.query.redirect || "/";
                this.$router.push({
                  path,
                  query: {
                    // 注意需要提前把对象当作字符串传递过去 在接收页面转为对象 这样页面刷新就不会将对象转成了字符串
                    userInfo: JSON.stringify(this.loginForm)
                  }
                });
              }
            })
            .catch(error => {
              console.log(error.message);
            });
        }
      });
    },
    // 生成随机数
    // randomNum(min, max) {
    //   return Math.floor(Math.random() * (max - min) + min);
    // },
    // 切换验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    }
    // 生成四位随机验证码
    // makeCode(o, l) {
    //   for (let i = 0; i < l; i++) {
    //     this.identifyCode += this.identifyCodes[
    //       this.randomNum(0, this.identifyCodes.length)
    //     ];
    //   }
    // }
  }
};
</script>
<style scoped>
.identifybox {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  width: 300px;
  padding: 0 30px;
}
.iconstyle {
  color: #409eff;
}
.login-form {
  margin: auto;
  text-align: center;
  /* margin-top: 20.1%; */
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
</style>
