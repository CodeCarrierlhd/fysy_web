<!-- 首页头部栏 -->
<template>
  <div class="header">
    <p class="arrow">
      <img :src="left_arrow" alt @click="$router.go(-1)" />
      <img :src="right_arrow" alt @click="$router.go(1)" />
    </p>
    <p>
      <img :src="user_img" alt />
      <span style="margin:0 40px 0 10px">{{ userInfo.username }}</span>
      <img
        :src="lock_img"
        alt
        style="margin-right:20px"
        @click.stop="getUser()"
      />
      <img :src="quit_img" alt @click="clearUser()" />
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      left_arrow: require('../assets/imgs/syb.png'),
      right_arrow: require('../assets/imgs/xyb.png'),
      user_img: require('../assets/imgs/gs.png'),
      lock_img: require('../assets/imgs/mm.png'),
      quit_img: require('../assets/imgs/tc.png')
    }
  },
  props: {
    userInfo: {}
  },
  mounted() {
    this.getUserName()
  },
  created() {
    // console.log(JSON.stringify(this.props.userInfo));
  },
  methods: {
    getUser() {
      this.$emit('showBlock')
    },
    clearUser() {
      this.$emit('handleClose')
    },
    getUserName() {
      if (this.userInfo.length < 0) {
        console.log('2222')
      }
    }
  }
}
</script>
<style lang="less">
.header {
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  p {
    img {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .arrow > img:first-child {
    margin: 0 40px 0 60px;
  }
  p:last-child {
    margin-right: 60px;
  }
}
</style>
