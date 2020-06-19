<!-- 销售统计 -->
<template>
  <div class="saleContainer">
    <div class="slects">
      <span class="fontStyle" style="margin-right:10px">时间</span>
      <el-select v-model="dateValue" placeholder="请选择">
        <el-option
          v-for="item in timeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="fontStyle" style="margin:0 10px 0 20px">地区</span>
      <el-select
        v-model="province"
        placeholder="请选择"
        @change="provienceChangeFun"
      >
        <el-option
          v-for="item in accountProvinceList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="fontStyle" style="margin:0 10px 0 20px">型号</span>
      <el-select v-model="material" placeholder="请选择" @change="typeChange">
        <el-option label="全选" value="0"> </el-option>
        <el-option
          v-for="item in materialList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="fontStyle" style="margin:0 10px 0 26%">账号</span>
      <el-select v-model="uid" placeholder="请选择" @change="uidChange">
        <el-option
          v-for="item in userList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="dataAnalysis">
      <div class="graph">
        <div style="background-color: #fff;" v-if="provienceChange">
          <div
            style="display:flex;width:100%;justify-content: space-between;border-bottom: 1px solid #BEBBBA;"
          >
            <span class="title">销售总数统计</span>
            <span class="title">单位：个</span>
          </div>
          <div id="lineChart" style="height:260px;width:100%"></div>
        </div>
        <div style="background-color: #fff;height:300px;display:flex" v-else>
          <div style="width:60%">
            <p style="border-bottom: 1px solid #BEBBBA;">
              <span class="title"> {{ province }}销售概况 </span>
            </p>
            <div style="display:flex">
              <div id="cityChart" style="height:280px;width:80%"></div>
              <p class="pDesc">
                <span style="display: inline-block;margin-top: 46px;">{{
                  provienceDesc
                }}</span>
              </p>
            </div>
          </div>
          <div
            style="border:1px solid rgba(190,187,186,1);flex:1;margin:10px;box-shadow:0px 2px 4px 0px rgba(0,0,0,0.5);border-radius:4px;"
          >
            <div id="pieChart" style="height:260px;width:100%;"></div>
          </div>
        </div>

        <div
          style="background-color: #fff;margin-top:30px"
          v-if="provienceChange"
        >
          <div
            style="display:flex;width:100%;justify-content: space-between;border-bottom: 1px solid #BEBBBA;"
          >
            <span class="title">全国各省份销售排行</span>
            <span class="title">单位：个</span>
          </div>
          <div id="barChart" style="height:260px;width:100%"></div>
        </div>
        <div style="background-color: #fff;margin-top:30px" v-else>
          <div
            style="display:flex;width:100%;justify-content: space-between;border-bottom: 1px solid #BEBBBA;"
          >
            <span class="title">{{ province }}销售统计</span>
            <span class="title">单位：个</span>
          </div>
          <div id="cityLineChart" style="height:260px;width:100%"></div>
        </div>
      </div>
      <div class="progressBar" v-if="p_info">
        <p class="font_title" style="margin-bottom:30px">
          各型号销售概况
        </p>
        <ul style="height: 600px;overflow: scroll;overflow-x:hidden">
          <li
            v-for="(item, index) in materialLists"
            :key="index"
            class="p_card"
          >
            <div>
              <p class="p_groups">
                <span class="p_title">{{ item.materialModel }}</span>
                <span class="p_title">{{ item.amount }}个</span>
              </p>
              <div style="background:rgba(255,255,255,1);padding:25px 21px">
                <el-progress
                  :percentage="
                    Number(((item.amount / totalSales) * 100).toFixed(0))
                  "
                  :show-text="true"
                ></el-progress>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="progressBar">
        <p class="font_title" style="margin-bottom:30px">
          {{ choseMaterial.materialModel }}销售概况
        </p>
        <div>
          <p class="p_groups">
            <span class="p_title">{{ choseMaterial.materialModel }}</span>
            <span class="p_title">{{ choseMaterial.amount }}个</span>
          </p>
          <div style="background:rgba(255,255,255,1);padding:25px 21px">
            <el-progress
              :percentage="
                Number(((choseMaterial.amount / choseTotal) * 100).toFixed(0))
              "
              :show-text="true"
            ></el-progress>
          </div>
        </div>
        <div v-if="imgExit">
          <div class="carouselBlock">
            <el-carousel height="250px">
              <el-carousel-item v-for="(item, index) in imgList" :key="index">
                <img :src="item.image" alt="" />
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="type_block">
            <p class="type_title" style="margin-bottom:30px">
              {{ choseMaterial.materialModel }}型号参数
            </p>
            <p class="type_desc">{{ typeDesc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import axios from 'axios'
import echarts from 'echarts'
import '../../node_modules/echarts/map/js/province/anhui'
import '../../node_modules/echarts/map/js/province/aomen'
import '../../node_modules/echarts/map/js/province/hebei'
import '../../node_modules/echarts/map/js/province/heilongjiang'
import '../../node_modules/echarts/map/js/province/henan'
import '../../node_modules/echarts/map/js/province/hunan'
import '../../node_modules/echarts/map/js/province/jiangsu'
import '../../node_modules/echarts/map/js/province/jiangxi'
import '../../node_modules/echarts/map/js/province/jilin'
import '../../node_modules/echarts/map/js/province/liaoning'
import '../../node_modules/echarts/map/js/province/neimenggu'
import '../../node_modules/echarts/map/js/province/beijing'
import '../../node_modules/echarts/map/js/province/ningxia'
import '../../node_modules/echarts/map/js/province/qinghai'
import '../../node_modules/echarts/map/js/province/shandong'
import '../../node_modules/echarts/map/js/province/shanghai'
import '../../node_modules/echarts/map/js/province/shanxi'
import '../../node_modules/echarts/map/js/province/shanxi1'
import '../../node_modules/echarts/map/js/province/sichuan'
import '../../node_modules/echarts/map/js/province/taiwan'
import '../../node_modules/echarts/map/js/province/tianjin'
import '../../node_modules/echarts/map/js/province/xianggang'
import '../../node_modules/echarts/map/js/province/chongqing'
import '../../node_modules/echarts/map/js/province/xinjiang'
import '../../node_modules/echarts/map/js/province/xizang'
import '../../node_modules/echarts/map/js/province/yunnan'
import '../../node_modules/echarts/map/js/province/zhejiang'
import '../../node_modules/echarts/map/js/province/fujian'
import '../../node_modules/echarts/map/js/province/gansu'
import '../../node_modules/echarts/map/js/province/guangdong'
import '../../node_modules/echarts/map/js/province/guangxi'
import '../../node_modules/echarts/map/js/province/guizhou'
import '../../node_modules/echarts/map/js/province/hainan'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      timeList: [],
      accountProvinceList: [],
      materialList: [],
      dateValue: 0,
      province: '',
      material: '0',
      chartData: [],
      percen: 0,
      materialLists: [],
      totalSales: 0,
      uid: null,
      userList: [],
      lineChart: {},
      barChar: {},
      cityLineChart: {},
      pieChart: {},
      myChart: {},
      provienceChange: true,
      provienceDesc: '',
      p_info: true,
      choseMaterial: [],
      choseTotal: 0,
      imgList: [],
      typeDesc: '',
      imgExit: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    dateValue: {
      handler(newName, oldName) {
        this.$nextTick(() => {
          this.initData(this.uid)
        })
      }
    },
    material: {
      handler(newName, oldName) {
        this.$nextTick(() => {
          this.initData(this.uid)
        })
      }
    }
  },
  // 方法集合
  methods: {
    getType(uid) {
      this.timeList = []
      this.accountProvinceList = []
      this.materialList = []
      axios.get('/statistics/getSearchData?uid=' + uid).then(res => {
        if (res.data.code === 200) {
          const datas = res.data.object
          console.log(datas)
          for (let i = 0; i < datas.timeList.length; i++) {
            this.timeList.push({
              value: datas.timeList[i].value,
              label: datas.timeList[i].desc
            })
          }
          // this.dateValue=datas.timeList[0].value
          for (let j = 0; j < datas.accountProvinceList.length; j++) {
            this.accountProvinceList.push({
              value: datas.accountProvinceList[j],
              label: datas.accountProvinceList[j]
            })
          }
          // this.province = datas.accountProvinceList[0]
          for (let k = 0; k < datas.materialList.length; k++) {
            this.materialList.push({
              value: datas.materialList[k].id,
              label: datas.materialList[k].materialModel
            })
          }
          // this.material = datas.materialList[0].id
        }
      })
    },
    initData(uid) {
      console.log(uid)

      if (this.material === 0) {
        this.$nextTick(() => {
          this.p_info = true
        })
      }
      axios
        .get(
          '/statistics/sales?materialId=' +
            this.material +
            '&province=' +
            this.province +
            '&timeValue=' +
            this.dateValue +
            '&uid=' +
            uid
        )
        .then(res => {
          console.log(res)
          this.materialLists = res.data.object.scale.materialList
          this.totalSales = res.data.object.scale.totalSales
          if (
            res.data.object.scale.materialList &&
            res.data.object.scale.materialList.length === 1
          ) {
            this.choseMaterial = res.data.object.scale.materialList[0]
            this.choseTotal = res.data.object.scale.totalSales
            if (
              res.data.object.scale.materialList[0].imageUrls &&
              res.data.object.scale.materialList[0].imageUrls.length > 0
            ) {
              this.imgExit = true
              this.imgList = []
              this.imgList = JSON.parse(
                res.data.object.scale.materialList[0].imageUrls
              )
              this.typeDesc = res.data.object.scale.materialList[0].description
            } else {
              this.imgExit = false
            }
          }
          const lineData = res.data.object.graph

          if (res.data.object.map) {
            this.initProvice(res.data.object.map.province)
            this.initLineChart(
              lineData.x,
              lineData.y,
              this.cityLineChart,
              'cityLineChart'
            )
            this.provienceDesc = res.data.object.map.content
            const pieData = [
              {
                value: res.data.object.map.provinceSales,
                name: this.province
              },
              {
                value:
                  res.data.object.map.totalSales -
                  res.data.object.map.provinceSales,
                name: '其他'
              }
            ]

            this.initPie(pieData)
          } else {
            const barData = res.data.object.histogram
            this.initBarChart(barData.histogram_x, barData.histogram_y)
            this.initLineChart(
              lineData.x,
              lineData.y,
              this.lineChart,
              'lineChart'
            )
          }
        })
    },

    initLineChart(xdata, counts, chart, charId) {
      // 基于准备好的dom，初始化echarts实例
      chart = echarts.init(document.getElementById(charId))
      chart.setOption({
        lineStyle: {
          normal: {
            color: '#32A8FF'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}:{c}'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xdata
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1,
            axisLabel: {
              formatter: '{value} '
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '总计',
            type: 'line',
            // lineData
            data: counts,
            // data: [0, 0, 0, 0, 0, 2, 0, 3, 0, 0, 0, 0],
            itemStyle: { normal: { color: '#32A8FF' } },
            areaStyle: {
              normal: {
                // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(80,141,255,0.39)'
                  },
                  {
                    offset: 0.34,
                    color: 'rgba(56,155,255,0.25)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(38,197,254,0.00)'
                  }
                ])
              }
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      })
    },
    initBarChart(xData, yData) {
      this.barChart = echarts.init(document.getElementById('barChart'))
      const option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '销售量',
            type: 'bar',
            barWidth: '60%',
            data: yData
          }
        ]
      }
      this.barChart.setOption(option)
    },
    initProvice(provience) {
      this.myChart = echarts.init(document.getElementById('cityChart'))
      this.myChart.clear()
      const option = {
        tooltip: {
          show: false
        },
        series: [
          {
            name: provience,
            type: 'map',
            mapType: provience,
            itemStyle: {
              // 地图区域的多边形 图形样式
              color: 'transparent',
              normal: {
                borderColor: '#7dbaff',
                areaColor: '#7dbaff'
              },
              emphasis: {
                // 是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                areaColor: '#4766FF',
                // areaColor: "red",
                label: {
                  show: false
                }
              }
            }
          }
        ]
      }
      this.myChart.setOption(option)
    },
    initPie(datas) {
      this.pieChart = echarts.init(document.getElementById('pieChart'))
      const option = {
        color: ['#2A426E', '#435E93'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: '销售数量占比',
          left: 'center',
          y: 20,
          textStyle: {
            // 文字颜色
            color: '#333333',
            // 字体风格,'normal','italic','oblique'
            // 字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: '400',
            // 字体系列
            fontFamily: 'SourceHanSansSC-Regular,SourceHanSansSC',
            // 字体大小
            fontSize: 24
          }
        },
        series: [
          {
            name: '销售数量统计',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: {
              show: false
            },
            data: datas
          }
        ]
      }
      this.pieChart.setOption(option)

      this.pieChart.on('mouseover', function(params) {
        console.log(params)
      })

      this.pieChart.on('mouseout', { seriesName: 'from' }, () => {
        this.pieChart.setOption({
          title: {
            show: true
          }
        })
      })
    },
    getUid() {
      axios.get('/statistics/getSelfAndChild').then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.object.length; i++) {
            this.userList.push({
              value: res.data.object[i].id,
              label: res.data.object[i].username
            })
          }
          this.getType(res.data.object[0].id)
          this.uid = res.data.object[0].id
          this.initData(res.data.object[0].id)
        }
      })
    },
    uidChange(val) {
      this.uid = val
      this.dateValue = 0
      this.material = '0'
      this.p_info = true
      this.province = ''
      this.provienceChange = true
      this.initData(val)
      this.getType(val)
    },
    provienceChangeFun(val) {
      this.province = val
      if (this.provienceChange) {
        const oldLine = echarts.init(document.getElementById('lineChart'))
        oldLine.dispose()
        const barChar = echarts.init(document.getElementById('barChart'))
        barChar.dispose()
      }
      if (val === '全国') {
        this.provienceChange = true
      } else {
        this.provienceChange = false
        console.log(this.barChart)
        console.log(this.myChart)
      }
      this.initData(this.uid)
    },
    typeChange(val) {
      if (val === '0') {
        this.p_info = true
      } else {
        this.p_info = false
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getUid()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style>
.saleContainer {
  margin: 60px 50px;
  width: 100%;
}
.slects {
  display: flex;
  justify-content: space-around;
}
.fontStyle {
  font-size: 24px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 40px;
}
</style>
<style scoped>
.graph {
  width: 1020px;
  margin-top: 40px;
}
#lineChart {
  width: 100%;
}
.title {
  font-size: 24px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  padding: 18px 30px;
}
.dataAnalysis {
  display: flex;
}
.progressBar {
  margin: 40px 0 0 60px;
  flex: 1;
}
.font_title {
  font-size: 24px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}
.p_title {
  font-size: 20px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 30px;
  padding: 20px;
}
.type_block {
  margin-top: 20px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 13px 20px;
}
.type_title {
  font-size: 20px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 30px;
}
.type_desc {
  font-size: 16px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(119, 119, 119, 1);
  line-height: 24px;
}
.p_groups {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(190, 187, 186, 1);
  border-radius: 4px;
}
.p_card {
  margin-bottom: 20px;
}
.pDesc {
  font-size: 20px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(119, 119, 119, 1);
  line-height: 30px;
  width: 262px;
}
.carouselBlock {
  margin-top: 20px;
}
.el-carousel__item img {
  width: 100%;
  opacity: 0.75;
  height: 100%;
}
.el-carousel {
  overflow-y: hidden;
}
</style>
