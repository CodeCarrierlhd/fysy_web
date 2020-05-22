<!-- 流水统计 -->
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
      <span class="fontStyle" style="margin:0 10px 0 20px">型号</span>
      <el-select v-model="material" placeholder="请选择">
        <el-option label="全选" value="0"> </el-option>
        <el-option
          v-for="item in materialList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="fontStyle" style="margin:0 10px 0 45%">账号</span>
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
        <div style="background-color: #fff;">
          <div
            style="display:flex;width:100%;justify-content: space-between;border-bottom: 1px solid #BEBBBA;"
          >
            <span class="title">进销存统计</span>
            <span class="title">单位：个</span>
          </div>
          <div id="lineChart"></div>
        </div>

        <div style="margin-top:30px;display:flex">
          <div style="width:530px;margin-right:30px;background-color: #fff;">
            <div
              style="display:flex;justify-content: space-between;border-bottom: 1px solid #BEBBBA;background-color: #fff;"
            >
              <span class="title">当前库存概况</span>
              <span class="title">单位：个</span>
            </div>
            <div id="pieChart" style="width:100%;height:260px"></div>
          </div>
          <div style="width:530px;background-color: #fff;">
            <div
              style="display:flex;justify-content: space-between;border-bottom: 1px solid #BEBBBA;background-color: #fff;"
            >
              <span class="title">进销存总概况</span>
              <span class="title">单位：个</span>
            </div>
            <div id="barChart"></div>
          </div>
        </div>
      </div>
      <div class="progressBar">
        <p class="font_title" style="margin-bottom:30px">
          各型号产品进销存情况
        </p>
        <div>
          <el-table
            :data="tableData"
            border
            style="height:600px;overflow: scroll;overflow-x:hidden;"
          >
            <el-table-column
              prop="materialModel"
              label="型号"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="instockCount" label="进货" align="center">
            </el-table-column>
            <el-table-column prop="salesCount" label="销售" align="center">
            </el-table-column>
            <el-table-column prop="inventoryCount" label="库存" align="center">
            </el-table-column>
            <el-table-column prop="returnCount" label="退货" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { Chart } from '@antv/g2'
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
      barChar: {},
      pieChar: {},
      timeList: [],
      materialList: [],
      materialLists: [],
      userList: [],
      tableData: []
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    dateValue: {
      handler(newName, oldName) {
        this.$nextTick(() => {
          this.getAllData()
        })
      }
    },
    material: {
      handler(newName, oldName) {
        this.$nextTick(() => {
          this.getAllData()
        })
      }
    }
  },
  // 方法集合
  methods: {
    getAllData() {
      axios
        .get(
          '/statistics/sellAndStock?materialId=' +
            this.material +
            '&timeValue=' +
            this.dateValue +
            '&uid=' +
            this.uid
        )
        .then(res => {
          console.log(res)

          const lineData = []
          const pieData = []
          const barData = []
          const instock = res.data.object.graph.graph_instock_y
          const inventory = res.data.object.graph.graph_inventory_y
          const returnPro = res.data.object.graph.graph_return_y
          const sales = res.data.object.graph.graph_sales_y
          const graphx = res.data.object.graph.graph_x
          for (let i = 0; i < instock.length; i++) {
            lineData.push({
              timer: graphx[i],
              title: '进货',
              datas: instock[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '销售',
              datas: sales[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '库存',
              datas: inventory[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '退货',
              datas: returnPro[i]
            })
          }
          for (let m = 0; m < res.data.object.invrntoryList.length; m++) {
            pieData.push({
              value: res.data.object.invrntoryList[m].amount,
              name: res.data.object.invrntoryList[m].materialModel
            })
          }
          for (
            let n = 0;
            n < res.data.object.histogram.histogram_x.length;
            n++
          ) {
            barData.push({
              year: res.data.object.histogram.histogram_x[n],
              sales: res.data.object.histogram.histogram_y[n]
            })
          }
          // { year: '1951 年', sales: 38 },
          // if(lineD)
          this.initLine(lineData)
          this.initPie(
            pieData,
            res.data.object.totalInventory.amount,
            this.pieChar,
            'pieChart'
          )
          // this.initPie(pieData, res.data.object.totalInventory)
          this.initBar(barData)
          this.tableData = res.data.object.modelDataList
        })
    },
    getMaterial() {
      axios
        .get(
          '/statistics/sellAndStock?materialId=' +
            this.material +
            '&timeValue=' +
            this.dateValue +
            '&uid=' +
            this.uid
        )
        .then(res => {
          console.log(res)
          const lineData = []
          const barData = []
          const instock = res.data.object.graph.graph_instock_y
          const inventory = res.data.object.graph.graph_inventory_y
          const returnPro = res.data.object.graph.graph_return_y
          const sales = res.data.object.graph.graph_sales_y
          const graphx = res.data.object.graph.graph_x
          for (let i = 0; i < instock.length; i++) {
            lineData.push({
              timer: graphx[i],
              title: '进货',
              datas: inventory[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '销售',
              datas: sales[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '库存',
              datas: instock[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '退货',
              datas: returnPro[i]
            })
          }
          for (
            let n = 0;
            n < res.data.object.histogram.histogram_x.length;
            n++
          ) {
            barData.push({
              year: res.data.object.histogram.histogram_x[n],
              sales: res.data.object.histogram.histogram_y[n]
            })
          }
          // { year: '1951 年', sales: 38 },
          this.initLine(lineData)
          this.initBar(barData)
          this.tableData = res.data.object.modelDataList
        })
    },
    initLine(data) {
      this.lineChart.clear()
      this.lineChart.changeData(data)

      this.lineChart.scale({
        month: {
          range: [0, 1]
        },
        temperature: {
          nice: true
        }
      })

      this.lineChart.tooltip({
        showCrosshairs: true,
        shared: true
      })

      this.lineChart.axis('datas', {
        label: {
          formatter: val => {
            return val
          }
        }
      })

      this.lineChart
        .line()
        .position('timer*datas')
        .color('title')
        .shape('smooth')

      this.lineChart
        .point()
        .position('timer*datas')
        .color('title')
        .shape('circle')

      this.lineChart.render()
    },
    initBar(data) {
      this.barChar.clear()
      this.barChar.changeData(data)

      this.barChar.scale('sales', {
        nice: true
      })

      this.barChar.tooltip({
        showMarkers: false
      })
      this.barChar.interaction('active-region')

      this.barChar.interval().position('year*sales')

      this.barChar.render()
    },
    initPie(pdata, conunts, chart, chartId) {
      chart = echarts.init(document.getElementById(chartId))
      const option = {
        title: {
          text: conunts,
          subtext: '总库存量/个',
          left: '50%',
          top: '41%',
          padding: 5,
          textAlign: 'center'
        },
        tooltip: {
          // 提示框，可以在全局也可以在
          trigger: 'item', // 提示框的样式
          formatter: '{b} <br/> 数量：{c} <br/> 占比：{d}%',
          color: '#FFF', // 提示框的背景色
          textStyle: {
            // 提示的字体样式
            fontSize: '14px',
            fontWeight: 400,
            color: '#fff',
            padding: 15
          }
        },
        series: [
          {
            type: 'pie', // 环形图的type和饼图相同
            radius: ['50%', '70%'], // 饼图的半径，第一个为内半径，第二个为外半径
            avoidLabelOverlap: false,
            color: [
              '#2A426E',
              '#435E93',
              '#0289D4',
              '#59C4EB',
              '#FF7B71',
              '#FA99A8',
              '#FFCC00',
              '#FFDB4C',
              '#AAAAAA',
              '#BBBBBB',
              '#DDDDDD',
              '#F8F8F8'
            ],
            label: {
              normal: {
                // 正常的样式
                show: true,
                position: 'left',
                color: '#777777'
              }
            }, // 提示文字
            labelLine: {
              normal: {
                show: true
              }
            },
            data: pdata
          }
        ]
      }
      chart.setOption(option)
      // console.log(conunts)
      // this.pieChar.clear()
      // this.pieChar.changeData(data)
      // // this.pieChar.scale('count', {
      // //   formatter: val => {
      // //     val = val * 100 + '%'
      // //     return val
      // //   }
      // // })
      // this.pieChar.legend({
      //   visible: false
      // })
      // this.pieChar.coordinate('theta', {
      //   radius: 0.75,
      //   innerRadius: 0.6
      // })
      // this.pieChar.tooltip({
      //   showTitle: false,
      //   showMarkers: false,
      //   itemTpl:
      //     '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      // })
      // // 辅助文本
      // //  { item: '事例五', count: 9, percent: 0.09 },
      // this.pieChar.annotation()
      // // .text({
      // //   position: ['50%', '50%'],
      // //   content: '总库存量/个',
      // //   style: {
      // //     fontSize: 12,
      // //     fill: '#8c8c8c',
      // //     textAlign: 'center'
      // //   },
      // //   offsetY: -20
      // // })
      // // .text({
      // //   position: ['50%', '50%'],
      // //   content: conunts.amount,
      // //   style: {
      // //     fontSize: 24,
      // //     fill: '#8c8c8c',
      // //     textAlign: 'center'
      // //   },
      // //   offsetX: -5,
      // //   offsetY: 10
      // // })
      // this.pieChar
      //   .interval()
      //   .adjust('stack')
      //   .position('count')
      //   .color('item')
      //   .label('count', count => {
      //     return {
      //       content: data => {
      //         return `${data.item}: ${count}`
      //       }
      //     }
      //   })
      //   .tooltip('item*count', (item, count) => {
      //     return {
      //       name: item,
      //       value: count
      //     }
      //   })
      // // this.pieChar.interaction('element-active')
      // this.pieChar.render()
    },
    initData(uid) {
      axios
        .get(
          '/statistics/sellAndStock?materialId=' +
            this.material +
            '&timeValue=' +
            this.dateValue +
            '&uid=' +
            uid
        )
        .then(res => {
          console.log(res)
          this.lineChart = new Chart({
            container: 'lineChart',
            autoFit: true,
            height: 260,
            padding: [40, 60]
          })
          this.barChar = new Chart({
            container: 'barChart',
            autoFit: true,
            height: 260,
            padding: [40, 60]
          })
          // this.pieChar = new Chart({
          //   container: 'pieChart',
          //   autoFit: true,
          //   height: 260
          // })
          const lineData = []
          const pieData = []
          const barData = []
          const instock = res.data.object.graph.graph_instock_y
          const inventory = res.data.object.graph.graph_inventory_y
          const returnPro = res.data.object.graph.graph_return_y
          const sales = res.data.object.graph.graph_sales_y
          const graphx = res.data.object.graph.graph_x
          for (let i = 0; i < instock.length; i++) {
            lineData.push({
              timer: graphx[i],
              title: '进货',
              datas: instock[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '销售',
              datas: sales[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '库存',
              datas: inventory[i]
            })
            lineData.push({
              timer: graphx[i],
              title: '退货',
              datas: returnPro[i]
            })
          }
          for (let m = 0; m < res.data.object.invrntoryList.length; m++) {
            pieData.push({
              value: res.data.object.invrntoryList[m].amount,
              name: res.data.object.invrntoryList[m].materialModel
            })
          }
          for (
            let n = 0;
            n < res.data.object.histogram.histogram_x.length;
            n++
          ) {
            barData.push({
              year: res.data.object.histogram.histogram_x[n],
              sales: res.data.object.histogram.histogram_y[n]
            })
          }
          this.initLine(lineData)
          console.log(pieData, res.data.object.totalInventory)

          // this.initPie(pieData, res.data.object.totalInventory)
          this.initPie(
            pieData,
            res.data.object.totalInventory.amount,
            this.pieChar,
            'pieChart'
          )
          this.initBar(barData)
          this.tableData = res.data.object.modelDataList
        })
    },
    getType(uid) {
      this.timeList = []
      this.materialList = []
      axios.get('/statistics/getSearchData?uid=' + uid).then(res => {
        console.log(res)
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
        }
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
      this.material = ''
      this.getAllData()
      this.getType(val)
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
<style scope>
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
