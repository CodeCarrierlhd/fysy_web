<template>
  <div class="home" @click="hideEdit">
    <el-container>
      <el-aside width="240px">
        <Menu
          @handleRouterChange="handleRouterChange"
          :rightLists="rightLists"
        ></Menu>
      </el-aside>
      <el-container>
        <el-header height="80px">
          <Header
            :userInfo="userInfo"
            @showBlock="showBlock"
            @handleClose="handleClose"
          ></Header>
        </el-header>
        <el-main>
          <router-view :key="$route.path + $route.query.t"></router-view>
          <transition name="slide-fade">
            <edit-user
              v-if="showEdit"
              id="edUser"
              @childFn="showBlock"
            ></edit-user>
          </transition>
          <my-dialog
            :centerDialogVisible="centerDialogVisible"
            :headerText="headerText"
            :textName="textName"
            :changePwd="changePwd"
          ></my-dialog>
        </el-main>
      </el-container>
    </el-container>
    <div v-if="showEdit" class="faker_div"></div>
  </div>
</template>

<script>
import Menu from '@/components/Menu'
import Header from '@/components/Header'
import MyDialog from '../components/Dialog'
import EditUser from '@/components/EditUser'
import us from '../services/users'
export default {
  name: 'home',
  data() {
    return {
      userInfo: '',
      showEdit: false,
      centerDialogVisible: 0,
      headerText: '退出登录',
      textName: '确定退出登录!',
      changePwd: false,
      rightLists: []
    }
  },
  methods: {
    showBlock() {
      if (!this.showEdit) {
        this.showEdit = true
      } else {
        this.showEdit = false
      }
    },
    handleClose() {
      this.centerDialogVisible++
    },
    dialogClose() {
      this.centerDialogVisible++
    },
    hideEdit(event) {
      const edUser = document.getElementById('edUser')
      if (edUser) {
        if (!edUser.contains(event.target)) {
          this.showEdit = false
        }
      }
    },
    handleRouterChange(sonmenu) {
      console.log(sonmenu)
      this.$router.push({
        path: '/' + sonmenu.uri,
        // name: sonmenu.uri,
        query: {
          t: Date.now(),
          btnRight: JSON.stringify(sonmenu.sonRight)
        }
      })
    },
    getInfo() {
      us.getUserInfo().then(res => {
        this.$nextTick(() => {
          this.userInfo = res.data.object.userDetail
          this.rightLists = res.data.object.userDetail.rightList
        })
      })
    }
  },
  mounted() {},
  created() {
    this.getInfo()
  },
  watch: {},
  components: {
    Menu,
    Header,
    MyDialog,
    EditUser
  }
}
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
  position: relative;
  display: flex;
  /*align-items: center; */
  padding: 0;
  height: 100%;
  background-color: #eeeeee;
}
body > .el-container {
  margin-bottom: 40px;
}
body .el-container {
  height: 100%;
}

.el-submenu__title {
  color: rgba(0, 0, 255, 1) !important;
}

.faker_div {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
}
.dialogFont {
  font-size: 20px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 29px;
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
</style>
