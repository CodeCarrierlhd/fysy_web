<!-- 右侧菜单栏 -->
<template>
  <div>
    <el-row class="tac">
      <el-col :span="24">
        <div class="logoImg">
          <img :src="imgSrc" />
        </div>
        <el-menu
          v-if="rightLists.length > 0"
          class="el-menu-vertical-demo"
          background-color="#435E93"
          text-color="#fff"
          active-text-color="#00f"
          :unique-opened="unique"
        >
          <el-submenu
            v-for="item in menuList"
            :index="item.mark"
            :key="item.mark"
          >
            <template slot="title">
              <i :class="item.iconClass"></i>
              <span class="m_title">{{ item.rightName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="sonMenu in item.childList"
                :index="sonMenu.sonMark"
                :key="sonMenu.sonMark"
                @click.native="menuChange(sonMenu)"
                >{{ sonMenu.rightName }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    rightLists: {
      type: Array,
      required: true,
      menuList: []
    }
  },
  data() {
    return {
      imgSrc: require('../assets/logo/log_w.png'),
      unique: true,
      r_list: [],
      iconList: [
        'el-icon-setting',
        'el-icon-postcard',
        'el-icon-house',
        'el-icon-coin',
        'el-icon-s-data'
      ],
      menuIndex: ''
    }
  },
  watch: {
    rightLists() {
      this.r_list = this.rightLists
      this.initData(this.r_list)
    }
  },
  methods: {
    menuChange(sonmenu) {
      console.log(this.$store.state.menuIndex)

      // this.menuIndex = this.$store.state.menuIndex
      this.$emit('handleRouterChange', sonmenu)
    },
    initData(dataArr) {
      const arr = dataArr
      const bigArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].rightParentId === 0) {
          bigArr.push(arr[i])
        }
      }
      bigArr.forEach((item, index) => {
        item.childList = []
        item.iconClass = this.iconList[index]
        item.mark = index + ''
      })
      for (let j = 0; j < arr.length; j++) {
        for (let m = 0; m < bigArr.length; m++) {
          if (arr[j].rightParentId === bigArr[m].rightId) {
            bigArr[m].childList.push(arr[j])
          }
        }
      }
      for (let k = 1; k <= bigArr.length; k++) {
        bigArr[k - 1].childList.forEach((item, index) => {
          item.sonMark = k + '' + index
          item.sonRight = []
        })
      }
      for (let c = 0; c < arr.length; c++) {
        for (let a = 0; a < bigArr.length; a++) {
          for (let b = 0; b < bigArr[a].childList.length; b++) {
            if (arr[c].rightParentId === bigArr[a].childList[b].rightId) {
              bigArr[a].childList[b].sonRight.push(arr[c])
            }
          }
        }
      }
      this.menuList = bigArr
    }
  },
  computed: {},
  created() {},
  mounted() {}
}
</script>
<style lang="less">
.logoImg {
  width: 240px;
  height: 60px;
  border-bottom: 1px solid rgba(42, 66, 110, 1);
  margin: 0;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
  }
}
.el-menu {
  border: 0 !important;
}
.el-submenu {
  border-bottom: 1px solid rgba(42, 66, 110, 1);
}

.m_title {
  margin-right: 59px;
  font-size: 16px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 30px;
}
.el-menu-item-group__title {
  padding: 0;
}
.el-submenu__title i {
  color: #fff !important;
}
.el-submenu__title i:first-child {
  font-size: 20px !important;
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
.el-menu-item.is-active {
  color: #409eff !important;
}
</style>
