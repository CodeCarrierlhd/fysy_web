<!-- 首页头部栏 -->
<template>
  <div class="header">
    <p class="arrow">
      <!-- <img :src="left_arrow" alt @click="directionChange(1)" />
      <img :src="right_arrow" alt @click="directionChange(2)" /> -->
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
    },
    directionChange(num) {
      if (num === 1) {
        this.$router.beforeResolve((to, from, next) => {
          next()
          let keyIndex = '0'
          switch (from.name) {
            case 'AccountManagement':
              keyIndex = '13'
              break
            case 'AuthorityManagement':
              keyIndex = '14'
              break
            case 'MaterialManagement':
              keyIndex = '12'
              break
            case 'VendorManagement':
              keyIndex = '11'
              break
            case 'ActiveCode':
              keyIndex = '21'
              break
            case 'SecurityCode':
              keyIndex = '22'
              break
            case 'ShippingManagement':
              keyIndex = '32'
              break
            case 'ProductStorage':
              keyIndex = '31'
              break
            case 'ProductBack':
              keyIndex = '33'
              break
            case 'InventoryManagement':
              keyIndex = '34'
              break
            case 'GetProduct':
              keyIndex = '41'
              break
            case 'ActiveStatistics':
              keyIndex = '53'
              break
            case 'FlowStatistics':
              keyIndex = '52'
              break
            case 'SalesStatistics':
              keyIndex = '51'
              break
          }
          console.log(keyIndex)

          this.$store.commit('changeMenuIndex', keyIndex)
        })
        this.$router.go(-1)
      } else {
        this.$router.beforeResolve((to, from, next) => {
          next()
          let keyIndex = '0'
          switch (to.name) {
            case 'AccountManagement':
              keyIndex = '13'
              break
            case 'AuthorityManagement':
              keyIndex = '14'
              break
            case 'MaterialManagement':
              keyIndex = '12'
              break
            case 'VendorManagement':
              keyIndex = '11'
              break
            case 'ActiveCode':
              keyIndex = '21'
              break
            case 'SecurityCode':
              keyIndex = '22'
              break
            case 'ShippingManagement':
              keyIndex = '32'
              break
            case 'ProductStorage':
              keyIndex = '31'
              break
            case 'ProductBack':
              keyIndex = '33'
              break
            case 'InventoryManagement':
              keyIndex = '34'
              break
            case 'GetProduct':
              keyIndex = '41'
              break
            case 'ActiveStatistics':
              keyIndex = '53'
              break
            case 'FlowStatistics':
              keyIndex = '52'
              break
            case 'SalesStatistics':
              keyIndex = '51'
              break
          }
          console.log(keyIndex)

          this.$store.commit('changeMenuIndex', keyIndex)
        })
        this.$router.go(1)
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
    img:not(:first-child):hover {
      cursor: pointer;
    }
  }
  .arrow > img:hover {
    cursor: pointer;
    transform: scale(1.4);
  }
  .arrow > img:first-child {
    margin: 0 40px 0 60px;
  }
  p:last-child {
    margin-right: 60px;
  }
}
</style>
