<template>
  <div class="home" @click="hideEdit">
    <el-container>
      <el-aside width="240px">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header height="80px">
          <Header
            :userInfo="this.userInfo"
            @showBlock="showBlock"
            @loginOut="loginOut"
          ></Header>
        </el-header>
        <el-main
          :style="{
            backgroundImage: 'url(' + require('../assets/logo/bg1.png') + ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '100%'
          }"
        >
          <div class="w_content">
            <h1>欢迎登陆超体鼻假体防伪溯源系统</h1>
            <p>
              <span>上次登陆时间：</span>
              <span>2018.12.13 12:11:23</span>
            </p>
            <p>
              <span>上次登陆IP：</span>
              <span>131345421</span>
            </p>
          </div>
          <transition name="slide-fade">
            <edit-user v-if="showEdit" id="edUser"></edit-user>
          </transition>
          <!-- <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
          >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false"
                >确 定</el-button
              >
            </span>
          </el-dialog> -->
        </el-main>
      </el-container>
    </el-container>
    <div v-if="showEdit" class="faker_div"></div>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import EditUser from "@/components/EditUser";
export default {
  name: "home",
  data() {
    return {
      userInfo: JSON.parse(this.$route.query.userInfo),
      showEdit: false
      // dialogVisible: false
    };
  },
  methods: {
    showBlock() {
      if (!this.showEdit) {
        this.showEdit = true;
      } else {
        this.showEdit = false;
      }
    },
    loginOut() {
      console.log("13");

      this.$cookieStore.getCookie("name");
      this.$cookieStore.delCookie("name");
      this.$router.push("/login");
      history.pushState(null, null, document.URL);
      window.addEventListener(
        "popstate",
        function(e) {
          history.pushState(null, null, document.URL);
        },
        false
      );
    },
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    // parentFn(payload) {
    //   this.dialogVisible = payload;
    // },
    hideEdit(event) {
      const edUser = document.getElementById("edUser");
      if (edUser) {
        if (!edUser.contains(event.target)) {
          this.showEdit = false;
        }
      }
    }
  },
  mounted() {},
  created() {},
  components: {
    Menu,
    Header,
    EditUser
  }
};
</script>
<style scoped>
.home {
  height: 100%;
}
.el-header {
  height: 80px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 2px 0px rgba(170, 170, 170, 1);
}

.el-aside {
  background-color: #435e93;
  text-align: center;
}

.el-main {
  /* height: 1080px; */
  display: flex;
  justify-content: center;
  /*align-items: center; */
  padding: 0;
  position: relative;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}
body .el-container {
  height: 100%;
}
.w_content {
  width: 500px;
  height: 256px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 2px 4px 0px rgba(190, 187, 186, 1);
  border-radius: 7px;
  border: 1px solid rgba(12, 130, 250, 1);
  text-align: center;
  margin: auto;
}
.w_content > h1 {
  font-size: 24px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  padding: 40px 0 60px 0;
}
.w_content > p:first-child {
  padding-bottom: 20px;
}
.w_content > p > span {
  font-size: 18px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(119, 119, 119, 1);
  line-height: 27px;
}
.el-submenu__title {
  color: rgba(0, 0, 255, 1) !important;
}
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.faker_div {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
}
</style>
