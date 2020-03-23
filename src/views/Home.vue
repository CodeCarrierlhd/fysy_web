<template>
  <div class="home">
    <el-container>
      <el-aside width="240px">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header height="80px">
          <Header :userInfo="this.userInfo"></Header>
        </el-header>
        <el-main
          :style="{
            backgroundImage: 'url(' + require('../assets/logo/bg1.png') + ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '100% 100%'
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
          <edit-user></edit-user>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import EditUser from "@/components/EditUser";
export default {
  data() {
    return {
      userInfo: JSON.parse(this.$route.query.userInfo)
    };
  },
  methods: {},
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
  height: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

body > .el-container {
  margin-bottom: 40px;
}
.w_content {
  width: 500px;
  height: 256px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 2px 4px 0px rgba(190, 187, 186, 1);
  border-radius: 7px;
  border: 1px solid rgba(12, 130, 250, 1);
  text-align: center;
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
</style>
