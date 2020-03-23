<!-- 右侧菜单栏 -->
<template>
  <div>
    <el-row class="tac">
      <el-col :span="24">
        <div class="logoImg">
          <img :src="imgSrc" />
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#435E93"
          text-color="#fff"
          active-text-color="#00f"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span class="m_title">设置管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-postcard"></i>
              <span class="m_title">标签管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-house"></i>
              <span class="m_title">仓库管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">选项1</el-menu-item>
              <el-menu-item index="3-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-coin"></i>
              <span class="m_title">信息管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">选项1</el-menu-item>
              <el-menu-item index="4-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span class="m_title">数据管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">选项1</el-menu-item>
              <el-menu-item index="5-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: require("../assets/logo/log_w.png")
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style lang="less">
.logoImg {
  width: 240px;
  height: 80px;
  border-bottom: 1px solid rgba(42, 66, 110, 1);
  margin: 0;
  position: relative;
  img {
    width: 166px;
    height: 29px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
  }
}
// .el-menu {
//   //   background-color: #435e93; //菜单栏选项背景色
//   //   box-shadow: 0px 2px 2px 0px rgba(42, 66, 110, 1);
//   border: 0;
// }
.el-submenu {
  border-bottom: 1px solid rgba(42, 66, 110, 1);
}

.m_title {
  margin-right: 59px;
  font-size: 20px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 30px;
}
.el-submenu__title i {
  color: #fff !important;
}
.el-submenu__title i:first-child {
  font-size: 30px !important;
  margin-right: 15px !important;
}
.el-submenu__title .el-submenu__icon-arrow {
  //   color: #fff !important;
  //   border: 1px solid #fff;
  //   border-radius: 50%;
  font-size: 18px;
}
// .el-menu-item {
//   background-color: #2a426e !important;
// }
</style>
