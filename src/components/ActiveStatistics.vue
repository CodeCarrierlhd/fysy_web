<!-- 激活统计 -->
<template>
  <div class="container">
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
      <el-select v-model="province" placeholder="请选择">
        <el-option
          v-for="item in activateProvinceList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="fontStyle" style="margin:0 10px 0 20px">型号</span>
      <el-select v-model="material" placeholder="请选择">
        <el-option
          v-for="item in materialList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="dataAnalysis">
      <div class="graph">
        <div style="background-color: #fff;">
          <div
            style="display:flex;width:100%;justify-content: space-between;border-bottom: 1px solid #BEBBBA;"
          >
            <span class="title">用户激活数据统计</span>
            <span class="title">单位：人</span>
          </div>
          <!-- <div id="mixCharts"></div> -->
          <div id="echartContainer" style="width:100%; height:300px"></div>
        </div>

        <div style="margin-top:20px;background-color: #fff;width:719px">
          <div style="border-bottom: 1px solid #BEBBBA;display: flex;">
            <span class="title">用户年龄分布</span>
          </div>
          <div id="loopChart" style="width:100%; height:260px"></div>
        </div>
      </div>
      <div class="progressBar">
        <p class="font_title" style="margin-bottom:30px">
          手术情况概览（预约）
        </p>
        <el-table
          :data="tableData"
          border
          style="height:600px;overflow: scroll;"
        >
          <el-table-column
            prop="dateTime"
            label="时间"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="allActivateCount"
            label="手术总数"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="womanActivateCount"
            label="女生"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import axios from 'axios'
import echarts from 'echarts'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      uid: null,
      dateValue: 0,
      material: '',
      lineChart: {},
      mixChart: {},
      pieChar: {},
      timeList: [],
      materialList: [],
      materialLists: [],
      userList: [],
      tableData: [],
      activateProvinceList: [],
      province: ''
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    dateValue: {
      handler(newName, oldName) {
        this.dateValue = newName
        this.initData()
      }
    },
    material: {
      handler(newName, oldName) {
        this.material = newName
        this.initData()
      }
    },
    province: {
      handler(newName, oldName) {
        this.province = newName
        this.initData()
      }
    }
  },
  // 方法集合
  methods: {
    initLineBar(times, mans, womans, all) {
      var myChart = echarts.init(document.getElementById('echartContainer'))
      // 绘制图表
      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,1)',
          textStyle: {
            color: '#031D1F'
          }
          // formatter: '{b}：{c}人'
        },

        legend: {
          data: ['男性', '女性', '总数'],
          x: '75%',
          y: 13,
          itemGap: 20, // 图例之间的间隔
          icon: 'circle',
          textStyle: {
            // 图例文字的样式
            fontSize: 14
          }
        },
        xAxis: [
          {
            type: 'category',
            data: times,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisPointer: {
              show: false,
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '男性',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#0C82FA'
              }
            },
            data: mans
          },
          {
            name: '女性',
            itemStyle: {
              normal: {
                color: '#F96E83'
              }
            },
            type: 'bar',
            data: womans
          },
          {
            name: '总数',
            itemStyle: {
              normal: {
                color: '#FFCC00'
              }
            },
            type: 'line',
            data: all
          }
        ],
        barWidth: '20'
      }

      myChart.setOption(option)
    },
    initLoop(data) {
      var myChart = echarts.init(document.getElementById('loopChart'))
      // var data = [
      //   { value: 335, name: '直接访问' },

      //
      // ]

      // 这里才是关键整去掉下半部分的关键，

      // 计算data中value的总和

      var a = 0
      for (var i = 0; i < data.length; i++) {
        a += data[i].value
      }

      // 添加新的元素到data中，并设置其颜色样式为白色

      data.push({
        value: a,
        name: '__other',
        itemStyle: { normal: { color: 'rgba(0,0,0,0)' } }
      })
      console.log(data)

      // 下面就不说了，都是echarts的属性，看其api就好

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '用户年龄分布',
            type: 'pie',
            startAngle: 180,
            radius: ['60%', '100%'],
            center: ['50%', '80%'],
            data: data,
            color: [
              '#0C82FA',
              '#333333',
              '#AAAAAA',
              '#E5E5E5',
              '#EEEEEE',
              '#F8F8F8',
              '#FFCC00'
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    initData() {
      axios
        .get(
          '/statistics/activate?materialId=' +
            this.material +
            '&timeValue=' +
            this.dateValue +
            '&province=' +
            this.province
        )
        .then(res => {
          console.log(res)
          const sexGroup = []
          const counts = []
          const times = res.data.object.graph.graph_x
          const mans = res.data.object.graph.graph_man_y
          const womans = res.data.object.graph.graph_woman_y
          const all = res.data.object.graph.graph_all_y
          for (let i = 0; i < mans.length; i++) {
            sexGroup.push({ time: times[i], value: mans[i], type: 'man' })
            counts.push({ time: times[i], sums: all[i] })
          }
          for (let i = 0; i < womans.length; i++) {
            sexGroup.push({ time: times[i], value: womans[i], type: 'woman' })
          }
          this.tableData = res.data.object.operate.listdata
          // this.initMix(sexGroup, counts)
          this.initLineBar(times, mans, womans, all)
          const peoples = res.data.object.sector.listdata
          const pdatas = []
          for (let j = 0; j < peoples.length; j++) {
            pdatas.push({ value: peoples[j].amount, name: peoples[j].ageLot })
          }
          this.initLoop(pdatas)
        })
    },
    getType() {
      this.timeList = []
      this.materialList = []
      this.activateProvinceList = []
      axios.get('/statistics/getSearchData').then(res => {
        if (res.data.code === 200) {
          const datas = res.data.object
          for (let i = 0; i < datas.timeList.length; i++) {
            this.timeList.push({
              value: datas.timeList[i].value,
              label: datas.timeList[i].desc
            })
          }
          for (let k = 0; k < datas.materialList.length; k++) {
            this.materialList.push({
              value: datas.materialList[k].id,
              label: datas.materialList[k].materialModel
            })
          }
          for (let m = 0; m < datas.materialList.length; m++) {
            this.activateProvinceList.push({
              value: datas.activateProvinceList[m],
              label: datas.activateProvinceList[m]
            })
          }
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getType()
    this.initData()
    // this.getUid()
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
<style scope>
.fontStyle {
  font-size: 24px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}
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
</style>
