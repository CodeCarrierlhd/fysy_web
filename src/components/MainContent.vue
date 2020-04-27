<!-- 首页主体内容 -->
<template>
  <div
    :style="{
      backgroundImage: 'url(' + require('../assets/logo/bg1.png') + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: '100%'
    }"
    class="mainContent"
  >
    <div class="w_content">
      <h1>欢迎登陆超体鼻假体防伪溯源系统</h1>
      <p>
        <span>上次登陆时间：</span>
        <span>{{ timer }}</span>
      </p>
      <p>
        <span>上次登陆IP：</span>
        <span>{{ ipAddress }}</span>
      </p>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import us from '../services/users'

export default {
  // props: {
  //   showEdit: {
  //     type: Boolean
  //   }
  // },
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      ipAddress: '',
      timer: ''
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {
      us.getUserInfo().then(res => {
        console.log(res)

        // this.timer = this.formatTime(
        //   res.data.object.loginLog.lastLoginTime.time,
        //   'Y/M/D h:m:s'
        // )
        this.timer = this.formatDate(
          res.data.object.loginLog.lastLoginTime.time
        )
        this.ipAddress = res.data.object.loginLog.ipAddress
      })
    },
    formatDate(tim) {
      var aa = new Date(tim)
      var YY = aa.getFullYear() + '-'
      var MM =
        (aa.getMonth() + 1 < 10
          ? '0' + (aa.getMonth() + 1)
          : aa.getMonth() + 1) + '-'
      var DD = aa.getDate() < 10 ? '0' + aa.getDate() : aa.getDate()
      var hh = (aa.getHours() < 10 ? '0' + aa.getHours() : aa.getHours()) + ':'
      var mm =
        (aa.getMinutes() < 10 ? '0' + aa.getMinutes() : aa.getMinutes()) + ':'
      var ss = aa.getSeconds() < 10 ? '0' + aa.getSeconds() : aa.getSeconds()
      return YY + MM + DD + ' ' + hh + mm + ss
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpa() {}, // 生命周期 - 更新之前
  upad() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less">
.mainContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
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
</style>
