<!--  -->
<template>
  <div class="downFile">
    <div v-if="requestType" class="androidPart" :style="backgroundDiv">
      <!-- <img src="../assets/imgs/share.png" class="shareImg" /> -->
      <div
        style="position: absolute;top: 40%;left: 50%;transform: translate(-50%,-50%);width: 53%;
  height: 8%;"
      >
        <button @click="downFileNow" class="downBtn">
          <span class="downFont">立即下载</span>
        </button>
      </div>

      <!-- <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="versions" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="time" align="center">
        </el-table-column>
        <el-table-column prop="fileSize" label="size" width="70" align="center">
        </el-table-column>
        <el-table-column prop="path" label="down" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="downFileNow(scope.row.path)"
              size="mini"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <p style="textAlign: center;margin:10px 0" v-if="more">
        <i class="el-icon-caret-bottom"></i
        ><span @click="moreFile" class="moreFile">更多</span>
      </p>
      <div>
        <p style="margin: 20px auto;text-align: center;;color:#FF2D55">
          点击"下载"后若长时间无法开始下载，请点击右上角图标，选择在"在浏览器中打开"进行下载
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import '../utils/flexible'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      firstFile: '',
      requestType: true,
      backgroundDiv: {
        backgroundImage: 'url(' + require('../assets/logo/mobile.png') + ')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // initList() {
    //   const packType = 'android'
    //   this.getSums('/down/' + packType).then(res => {
    //     const firstFile = res.data.object.shift()
    //     console.log(firstFile)
    //     this.tableData.push(firstFile)
    //     // this.tableData = res.data.object
    //   })
    // },
    downFileNow() {
      const userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.indexOf('micromessenger') !== -1) {
        alert('请点击右上角图标，选择在"在浏览器中打开"进行下载')
      } else {
        const link = document.createElement('a')
        link.setAttribute('download', '')
        link.href = this.firstFile
        link.click()
      }
    },
    // moreFile() {
    //   this.more = false
    //   const packType = 'android'
    //   this.getSums('/down/' + packType).then(res => {
    //     this.tableData = res.data.object
    //   })
    // },
    getHeader() {
      const userAgent = navigator.userAgent.toLowerCase()
      if (
        userAgent.indexOf('ios') !== -1 ||
        userAgent.indexOf('iphone') !== -1 ||
        userAgent.indexOf('ipad') !== -1
      ) {
        this.requestType = false
        location.href = 'https://apps.apple.com/cn/app/id1387698533'
      } else {
        const packType = 'android'
        this.getSums('/down/' + packType).then(res => {
          const firstFile = res.data.object.shift()
          this.firstFile = firstFile.path
        })
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getHeader()
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
.downFile {
  overflow-x: hidden;
  width: 100%;
  height: 100%;
}
.androidPart {
  width: 100%;
  height: 100%;
}
.downBtn {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 22px;
  border: 0;
  padding: 0;
}
.downFont {
  font-size: 18px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 27px;
}
.shareImg {
  width: 7%;
  height: 4%;
  position: absolute;
  top: 3%;
  right: 4%;
}
</style>
