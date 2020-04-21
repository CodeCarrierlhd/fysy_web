<!-- 权限管理 -->
<template>
  <div class="container">
    <div class="powerContain">
      <el-table
        ref="singleTable"
        :data="tableData"
        style="margin:40px 60px;"
        @cell-click="hideInfo"
      >
<<<<<<< HEAD
        <el-table-column>
=======
        <el-table-column class-rightName="t_header">
>>>>>>> 24fc3efb833d66bce1a2dda8ac31c199c199a5f0
          <template slot="header" header-align="center">
            <div style="display: flex;justify-content: space-between;">
              <div v-if="s_show" style="display:flex;width:80%;">
                <el-input
                  v-model="search"
                  style="border-radius:4px;width:50%;height: 90%;margin-right:10px"
                  placeholder="输入关键字搜索"
                />
                <el-button @click="searchEnterFun()" type="primary"
                  >搜索</el-button
                >
              </div>
              <el-button
                type="primary"
                @click="handleFilterClassify"
                v-if="a_show"
                >新增<i class="el-icon-plus"></i
              ></el-button>
            </div>
          </template>
          <el-table-column type="index" width="50" align="center" label="序号">
          </el-table-column>
          <el-table-column prop="roleType" label="角色类型" align="center">
            <template slot-scope="scope">
              <span class="roleType">{{ scope.row.roleType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限设置" align="center" prop="u_power">
            <template slot-scope="scope">
              <span
                class="editButton"
                @click="editRole(scope.row, scope.$index)"
                >修改</span
              >
            </template>
          </el-table-column>
          <el-table-column label="角色删除" align="center">
            <template slot-scope="scope">
              <span
                class="editButton"
                @click="deltRole(scope.row, scope.$index)"
                >删除</span
              >
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="showTitle"
        class="filterClassfiy"
        width="730px"
        :close-on-click-modal="false"
        :visible.sync="dialogVisibleClassify"
        center
      >
        <div style="margin-bottom:35px">
          <span>角色类型选择：</span>
          <el-select v-model="roleValue" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </div>
        <!-- <div style="margin-bottom:35px" v-else>
          <span>输入角色类型名称：</span>

          <el-input
            v-model="roleValue"
            placeholder="请输入角色类型名称"
            style="border-radius:4px;width:30%;height: 90%;"
          />
        </div> -->
        <div style="display:flex">
          <p>角色权限选择：</p>
          <div class="checkboxGroup">
            <template v-if="menuList != null && menuList.length > 0">
              <div
                class="item"
                v-for="(first, firIndex) in menuList"
                :key="first.id"
                @click="showBlock(firIndex)"
              >
                <div class="itemHeader">
                  <el-checkbox
                    v-model="first.allChecked"
                    @change="firstChanged(firIndex, first.id)"
                    >{{ first.rightName }}</el-checkbox
                  >
                </div>
                <div v-show="first.childShow" class="checkboxGroups">
                  <template v-for="(second, secIndex) in first.child">
                    <el-checkbox
                      v-model="second.mychecked"
                      @change="
                        secondChanged(firIndex, secIndex, second.id, first.id)
                      "
                      :key="second.id"
                      :title="second.rightName"
                      :label="second.id"
                      >{{ second.rightName }}</el-checkbox
                    >
                    <div
                      class="thirdContent"
                      v-for="(third, index) in second.child"
                      :key="third.id"
                    >
                      <template>
                        <el-checkbox
                          v-model="third.onechecked"
                          @change="
                            thirdChanged(
                              firIndex,
                              secIndex,
                              index,
                              third.id,
                              second.id,
                              first.id
                            )
                          "
                          :key="third.id"
                          :title="third.rightName"
                          :label="third.id"
                          >{{ third.rightName }}</el-checkbox
                        >
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleClassify = false">取 消</el-button>
          <el-button
            type="primary"
            @click="funrightName ? initTableData() : editData()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :small="true"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <transition rightName="slide-fade">
<<<<<<< HEAD
      <div class="contentRight" v-show="powerInfo" :style="contentStyleObj">
=======
      <div class="contentRight" v-show="powerInfo">
>>>>>>> 24fc3efb833d66bce1a2dda8ac31c199c199a5f0
        <h1 class="powerHeader">{{ this.rolerightName }}权限</h1>
        <div v-for="(first, index) in info" :key="index" class="powerContent">
          <div style="display:flex">
            <span class="circle"></span>
            <p class="menurightName">{{ first.rightName }}</p>
          </div>

          <ul style="display:flex;margin-left:19px">
            <li
              v-for="(second, index) in first.child"
              :key="index"
              class="powerKey"
            >
              <span>{{ second.rightName }}</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import pagination from '../components/Pagenation'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      tableData: [],
      roleOptions: [],
      roleValue: '',
      search: '',
      currentPage: 1,
      limit: 10,
      total: 0,
      dialogVisibleClassify: false, // 弹窗是否显示
      options: '',
      showTitle: '新增用户角色',
      menuList: [],
      funrightName: true,
      rolerightName: '',
      info: [],
      powerInfo: false,
      keyId: '',
      contentStyleObj: {
        height: ''
      },
      s_show: false,
      a_show: false,
      d_show: false,
      e_show: false,
      edit: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    info(newValue, oldValue) {
      this.contentStyleObj.height = newValue.length * 74 + 'px'
    }
  },
  // 方法集合
  methods: {
    initTableData() {
      this.dialogVisibleClassify = false
      this.getIds(this.menuList)
      this.rightInsert(this.options, this.roleValue, '/roleRight/insert').then(
        res => {
          if (res.status === 200) {
            this.initData()
          }
        }
      )
    },
    initStatu() {
      this.roleValue = ''
      this.roleOptions = []
      this.rightList('0', '/right/listData').then(res => {
        console.log(res)
        for (let j = 0; j < res.data.object.roleList.length; j++) {
          this.roleOptions.push({
            value: res.data.object.roleList[j],
            label: res.data.object.roleList[j]
          })
        }
        const result = res.data.object.rightList
        for (let i = 0; i < result.length; i++) {
          result[i].allChecked = false
          result[i].childShow = false
          for (let j = 0; j < result[i].child.length; j++) {
            result[i].child[j].mychecked = false
            for (let m = 0; m < result[i].child[j].child.length; m++) {
              result[i].child[j].child[m].onechecked = false
            }
          }
        }
        this.menuList = result
      })
    },
    showBlock(index) {
      if (this.menuList[index].childShow) {
        this.$set(this.menuList[index], 'childShow', false)
        // this.menuList[index].childShow = false;
      } else {
        this.$set(this.menuList[index], 'childShow', true)
        // this.menuList[index].childShow = true;
      }
    },
    handleFilterClassify() {
      this.options = []
      // this.funrightName = false
      this.dialogVisibleClassify = true
      this.initStatu()
    },
    unique(arr) {
      return Array.from(new Set(arr))
    },
    editRole(row, index) {
      // const arrList = this.getRightList(row.roleId)
      this.funrightName = false
      this.menuList = []
      this.dialogVisibleClassify = true
      this.showTitle = '编辑用户角色'
      this.roleValue = row.roleType
      this.keyId = row.roleId
      this.rightList(row.roleId, 'right/listData').then(res => {
        let arr = []
        for (let i = 0; i < res.data.object.rightList.length; i++) {
          arr = res.data.object.rightList[i]
          if (arr.status === 2) {
            this.$set(arr, 'allChecked', true)
            // arr.allChecked = true;
            for (let j = 0; j < arr.child.length; j++) {
              this.$set(arr.child[j], 'mychecked', true)

              for (let m = 0; m < arr.child[j].child.length; m++) {
                this.$set(arr.child[j].child[m], 'onechecked', true)
              }
            }
          } else if (arr.status === 1) {
            this.$set(arr, 'allChecked', false)
            for (let j = 0; j < arr.child.length; j++) {
              if (arr.child[j].status === 2) {
                for (let m = 0; m < arr.child[j].child.length; m++) {
                  this.$set(arr.child[j].child[m], 'onechecked', true)
                }
              } else if (arr.child[j].status === 1) {
                for (let m = 0; m < arr.child[j].child.length; m++) {
                  if (arr.child[j].child[m].status === 2) {
                    this.$set(arr.child[j].child[m], 'onechecked', true)
                  } else {
                    this.$set(arr.child[j].child[m], 'onechecked', false)
                    // arr.child[j].child[m].onechecked = false;
                  }
                }
              }
            }
          } else {
            this.$set(arr, 'allChecked', false)
            // arr.allChecked = false;
            for (let i = 0; i < arr.child.length; i++) {
              this.$set(arr.child[i], 'mychecked', false)
              // arr.child[i].mychecked = false;
              for (let j = 0; j < arr.child[i].child.length; j++) {
                this.$set(arr.child[i].child[j], 'onechecked', false)
                // arr.child[i].child[j].onechecked = false;
              }
            }
          }
          this.$set(arr, 'childShow', false)
          this.menuList.push(arr)
        }
      })
    },
    editData() {
      // for (let i = 0; i < middleArr.length; i++) {
      //   this.ids += middleArr[i] + ','
      // }
      this.getIds()
      this.rightChange(this.options, this.keyId, '/roleRight/update').then(
        res => {
          console.log(res)
        }
      )
      this.funrightName = true
      this.dialogVisibleClassify = false
    },
    getDataList() {
      this.total = this.tableData.length
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // this.getDataList();
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentPage = 1
      // this.getDataList();
    },
    firstChanged(index, id) {
      const arr = this.menuList[index].child
      if (this.menuList[index].allChecked) {
        this.$set(this.menuList[index], 'status', 2)
        // this.menuList[index].status = 2;
        for (let i = 0; i < arr.length; i++) {
          this.$set(arr[i], 'mychecked', true)
          // arr[i].mychecked = true;
          const arr1 = arr[i].child
          for (let j = 0; j < arr1.length; j++) {
            this.$set(arr1[j], 'onechecked', true)
            // arr1[j].onechecked = true;
          }
        }
      } else {
        this.$set(this.menuList[index], 'status', 0)
        for (let i = 0; i < arr.length; i++) {
          this.$set(arr[i], 'mychecked', false)
          // arr[i].mychecked = false;
          const arr1 = arr[i].child
          for (let j = 0; j < arr1.length; j++) {
            this.$set(arr1[j], 'onechecked', false)
            // arr1[j].onechecked = false;
          }
        }
      }
    },
    secondChanged(fatherIndex, ownerIndex, ownerId, fatherId) {
      const arr = this.menuList[fatherIndex].child[ownerIndex]
      let checkCount = 0
      const len = this.menuList[fatherIndex].child.length
      for (let n = 0; n < this.menuList[fatherIndex].child.length; n++) {
        if (this.menuList[fatherIndex].child[n].mychecked) {
          checkCount++
        }
      }
      if (checkCount === len) {
        this.menuList[fatherIndex].status = 2
        this.menuList[fatherIndex].allChecked = true
      } else if (checkCount > 0) {
        this.menuList[fatherIndex].status = 1
        this.menuList[fatherIndex].allChecked = false
      } else {
        this.menuList[fatherIndex].status = 0
        this.menuList[fatherIndex].allChecked = false
      }
      if (arr.mychecked) {
        arr.status = 2
        for (let i = 0; i < arr.child.length; i++) {
          arr.child[i].onechecked = true
        }
      } else {
        for (let i = 0; i < arr.child.length; i++) {
          arr.child[i].onechecked = false
        }
      }
    },
    thirdChanged(
      grandfatherIndex,
      fatherIndex,
      index,
      id,
      fatherId,
      grandfatherId
    ) {
      const arr = this.menuList[grandfatherIndex].child[fatherIndex].child

      let checkCount = 0
      let grandCount = 0
      const len = arr.length
      const gArr = this.menuList[grandfatherIndex].child
      for (let n = 0; n < arr.length; n++) {
        if (arr[n].onechecked) {
          arr[n].status = 2
          checkCount++
        } else {
          arr[n].status = 0
        }
      }
      if (checkCount === len) {
        this.menuList[grandfatherIndex].child[fatherIndex].status = 2
        this.menuList[grandfatherIndex].status = 2
        this.menuList[grandfatherIndex].child[fatherIndex].mychecked = true
      } else if (checkCount > 0) {
        this.menuList[grandfatherIndex].child[fatherIndex].status = 1
        this.menuList[grandfatherIndex].status = 1
        this.menuList[grandfatherIndex].child[fatherIndex].mychecked = false
      } else {
        this.menuList[grandfatherIndex].child[fatherIndex].status = 0
        this.menuList[grandfatherIndex].status = 0
        this.menuList[grandfatherIndex].child[fatherIndex].mychecked = false
      }

      for (let j = 0; j < gArr.length; j++) {
        if (gArr[j].mychecked) {
          grandCount++
        }
      }
      if (grandCount === this.menuList[grandfatherIndex].child.length) {
        // this.menuList[grandfatherIndex].status = 2;
        this.menuList[grandfatherIndex].allChecked = true
      } else if (grandCount > 0) {
        // this.menuList[grandfatherIndex].status = 1;
        this.menuList[grandfatherIndex].allChecked = false
      } else {
        // this.menuList[grandfatherIndex].status = 0;
        this.menuList[grandfatherIndex].allChecked = false
      }
    },
    hideInfo(row, column, cell, event) {
      if (column.property === 'roleType') {
        this.rolerightName = row.roleType
        this.rightList(row.roleId, '/roleRight/getDetail').then(res => {
          this.info = res.data.object.rightList
          if (res.data.object.rightList.length > 0) {
            this.powerInfo = true
          } else {
            this.powerInfo = false
          }
        })
      } else {
        this.powerInfo = false
      }
    },

    initData() {
      this.roleList('', 'role/listData').then(res => {
        this.tableData = []
        for (let i = 0; i < res.data.object.length; i++) {
          this.tableData.push({
            roleId: res.data.object[i].roleId,
            roleType: res.data.object[i].roleType
          })
        }
      })
    },
    deltRole(row, index) {
      this.delItem(row.roleId, '/role/delete').then(res => {
        if (res.status === 200) {
          this.initData()
        }
      })
    },
    getIds() {
      const middleArr = []
      for (let index = 0; index < this.menuList.length; index++) {
        if (this.menuList[index].allChecked) {
          middleArr.push(this.menuList[index].id)
          for (let i = 0; i < this.menuList[index].child.length; i++) {
            middleArr.push(this.menuList[index].child[i].id)
            for (
              let j = 0;
              j < this.menuList[index].child[i].child.length;
              j++
            ) {
              middleArr.push(this.menuList[index].child[i].child[j].id)
            }
          }
        } else {
          for (let i = 0; i < this.menuList[index].child.length; i++) {
            if (this.menuList[index].child[i].mychecked) {
              middleArr.push(this.menuList[index].id)
              middleArr.push(this.menuList[index].child[i].id)
              for (
                let j = 0;
                j < this.menuList[index].child[i].child.length;
                j++
              ) {
                if (this.menuList[index].child[i].child[j].onechecked) {
                  middleArr.push(this.menuList[index].child[i].child[j].id)
                }
              }
            } else {
              for (
                let m = 0;
                m < this.menuList[index].child[i].child.length;
                m++
              ) {
                if (this.menuList[index].child[i].child[m].onechecked) {
                  middleArr.push(this.menuList[index].id)
                  middleArr.push(this.menuList[index].child[i].id)
                  middleArr.push(this.menuList[index].child[i].child[m].id)
                }
              }
            }
          }
        }
      }
      this.options = middleArr.join(',')
    },
    searchEnterFun() {
      this.roleList(this.search, 'role/listData').then(res => {
        this.tableData = []
        for (let i = 0; i < res.data.object.length; i++) {
          this.tableData.push({
            roleId: res.data.object[i].roleId,
            roleType: res.data.object[i].roleType
          })
        }
      })
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)

      btnArr.forEach(item => {
        if (item.rightName === '新增') {
          // this.$set(this.btnArr, 'a_show', true)
          this.a_show = true
        } else if (item.rightName === '删除') {
          this.d_show = true
        } else if (item.rightName === '修改') {
          this.e_show = true
        } else if (item.rightName === '查询') {
          this.s_show = true
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initData()
    this.initBtn()
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
/* .el-table__row {
  height: 60px !important;
} */
.container {
  display: flex;
  width: 95%;
}
.powerContain {
  width: 45%;
}
.contentRight {
  background-color: #2a426e;
  margin-left: 180px;
  text-align: center;
  flex: 1;
  padding-top: 33px;
  min-height: 860px;
}
.editButton {
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(30, 114, 247, 1);
  cursor: pointer;
}
.el-dialog__footer {
  text-align: center !important;
}
.filterClassfiy {
  margin: 35px 60px;
}
.el-dialog > .el-dialog__footer,
.el-dialog > .el-dialog__header {
  text-align: center !important;
}
.checkboxGroup {
  width: 80%;
}
.item {
  margin-bottom: 10px;
}
.itemHeader {
  height: 50px;
  background: rgba(238, 238, 238, 1);
  border-radius: 4px;
  border: 1px solid rgba(238, 238, 238, 1);
  display: flex;
  justify-content: left;
  padding-left: 16px;
  align-items: center;
}
.checkboxGroups {
  display: block;
  padding: 10px 16px;
}
.circle {
  width: 14px;
  height: 14px;
  display: inline-block;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(190, 187, 186, 1);
  border-radius: 14px;
}
.menurightName {
  height: 16px;
  font-size: 16px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 14px;
  margin-left: 6px;
}
.powerHeader {
  height: 20px;
  font-size: 20px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 30px;
}
.powerContent {
  width: 100%;
  height: 50px;
  padding: 20px 0 0 50px;
}
.powerKey {
  margin: 14px 20px 20px 0;
}
.powerKey span {
  height: 14px;
  font-size: 14px;
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(190, 187, 186, 1);
  line-height: 21px;
}
.roleType {
  font-family: SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(30, 114, 247, 1);
  cursor: pointer;
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
.thirdContent {
  width: 16%;
  display: inline-block;
  margin: 5px 0;
}
.el-checkbox {
  margin: 0;
  width: 35%;
}
/**这里的样式单独为最下面两行 进行调整 */
.checkboxGroup > .item:nth-child(5) > .checkboxGroups > .thirdContent {
  width: 60%;
}
.checkboxGroup > .item:nth-child(6) > .checkboxGroups > .thirdContent {
  width: 21%;
}
.checkboxGroup
  > .item:nth-child(6)
  > .checkboxGroups
  > .thirdContent:nth-child(5) {
  margin-left: 35%;
}
</style>
