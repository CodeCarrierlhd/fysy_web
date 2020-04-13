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
        <el-table-column class-name="t_header">
          <template slot="header" header-align="center">
            <el-input
              v-model="search"
              style="border-radius:4px;width:50%;height: 90%;"
              placeholder="输入关键字搜索"
            />
            <div>
              <el-button type="primary" @click="handleFilterClassify"
                >新增<i class="el-icon-plus"></i
              ></el-button>
            </div>
          </template>
          <el-table-column type="index" width="50" align="center" label="序号">
          </el-table-column>
          <el-table-column prop="u_type" label="角色类型" align="center">
            <template slot-scope="scope">
              <span class="roleType">{{ scope.row.u_type }}</span>
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
            <span class="editButton">删除</span>
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
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
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
                    >{{ first.name }}</el-checkbox
                  >
                </div>
                <div v-show="first.childShow" class="checkboxGroups">
                  <template v-for="(second, secIndex) in first.nodes">
                    <el-checkbox
                      v-model="second.mychecked"
                      @change="
                        secondChanged(firIndex, secIndex, second.id, first.id)
                      "
                      :key="second.id"
                      :title="second.name"
                      :label="second.id"
                      >{{ second.name }}</el-checkbox
                    >
                    <div
                      class="thirdContent"
                      v-for="third in second.nodes"
                      :key="third.id"
                    >
                      <template>
                        <el-checkbox
                          v-model="third.onechecked"
                          @change="
                            thirdChanged(
                              firIndex,
                              secIndex,
                              third.id,
                              second.id,
                              first.id
                            )
                          "
                          :key="third.id"
                          :title="third.name"
                          :label="third.id"
                          >{{ third.name }}</el-checkbox
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
            @click="funName ? initTableData() : editData()"
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
    <transition name="slide-fade">
      <div class="contentRight" v-show="powerInfo">
        <h1 class="powerHeader">{{ this.roleName }}权限</h1>
        <div v-for="(first, index) in info" :key="index" class="powerContent">
          <div style="display:flex">
            <span class="circle"></span>
            <p class="menuName">{{ first.name }}</p>
          </div>

          <ul style="display:flex;margin-left:19px">
            <li
              v-for="(second, index) in first.nodes"
              :key="index"
              class="powerKey"
            >
              <span>{{ second.name }}</span>
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
import pagination from "../components/Pagenation";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination },
  data() {
    // 这里存放数据
    return {
      tableData: [
        {
          u_type: "超级管理员",
          rightList: [
            {
              id: "1",
              name: "设置管理",
              status: 2,
              nodes: [
                {
                  id: "11",
                  name: "物料管理",
                  status: 2,
                  nodes: [
                    {
                      id: "111",
                      name: "查询",
                      status: 2
                    },
                    {
                      id: "112",
                      name: "新增",
                      status: 2
                    },
                    {
                      id: "113",
                      name: "编辑",
                      status: 2
                    },
                    {
                      id: "114",
                      name: "删除",
                      status: 2
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          u_type: "普通管理员",
          rightList: [
            {
              id: "1",
              name: "设置管理",
              status: 1,
              nodes: [
                {
                  id: "11",
                  name: "物料管理",
                  status: 1,
                  nodes: [
                    {
                      id: "111",
                      name: "查询",
                      status: 2
                    },
                    {
                      id: "112",
                      name: "新增",
                      status: 2
                    },
                    {
                      id: "113",
                      name: "编辑",
                      status: 0
                    },
                    {
                      id: "114",
                      name: "删除",
                      status: 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          u_type: "普通用户",
          rightList: [
            {
              id: "1",
              name: "设置管理",
              status: 1,
              nodes: [
                {
                  id: "11",
                  name: "物料管理",
                  status: 1,
                  nodes: [
                    {
                      id: "111",
                      name: "查询",
                      status: 2
                    },
                    {
                      id: "112",
                      name: "新增",
                      status: 0
                    },
                    {
                      id: "113",
                      name: "编辑",
                      status: 0
                    },
                    {
                      id: "114",
                      name: "删除",
                      status: 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          u_type: "游客",
          rightList: [
            {
              id: "1",
              name: "设置管理",
              status: 0,
              nodes: [
                {
                  id: "11",
                  name: "物料管理",
                  status: 0,
                  nodes: [
                    {
                      id: "111",
                      name: "查询",
                      status: 0
                    },
                    {
                      id: "112",
                      name: "新增",
                      status: 0
                    },
                    {
                      id: "113",
                      name: "编辑",
                      status: 0
                    },
                    {
                      id: "114",
                      name: "删除",
                      status: 0
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      roleOptions: [
        {
          value: "超级管理员",
          label: "超级管理员"
        },
        {
          value: "普通管理员",
          label: "普通管理员"
        },
        {
          value: "普通用户",
          label: "普通用户"
        },
        {
          value: "游客",
          label: "游客"
        }
      ],
      roleValue: "",
      search: "",
      currentPage: 1,
      limit: 10,
      total: 0,
      dialogVisibleClassify: false, // 弹窗是否显示
      options: [],
      showTitle: "新增用户角色",
      menuList: [],
      funName: true,
      roleName: "",
      info: [],
      powerInfo: false
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initTableData() {
      this.dialogVisibleClassify = false;
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].allChecked) {
          this.options.push(this.menuList[i].id);
        } else {
          for (let j = 0; j < this.menuList[i].nodes.length; j++) {
            if (this.menuList[i].nodes[j].mychecked) {
              this.options.push(
                this.menuList[i].nodes[j].id,
                this.menuList[i].id
              );
            } else {
              for (let m = 0; m < this.menuList[i].nodes[j].nodes.length; m++) {
                if (this.menuList[i].nodes[j].nodes[m].onechecked) {
                  this.options.push(
                    this.menuList[i].nodes[j].nodes[m].id,
                    this.menuList[i].nodes[j].id,
                    this.menuList[i].id
                  );
                } else {
                }
              }
            }
          }
        }
      }
      // console.log(Array.from(new Set(this.options))
      this.options = this.unique(this.options);
      // console.log(this.options, this.roleValue);
      this.tableData.push({ u_type: this.roleValue, rightList: this.menuList });
    },
    initStatu() {
      this.roleValue = "";
      const result = [
        {
          id: "1",
          name: "设置管理",
          nodes: [
            {
              id: "11",
              name: "物料管理",
              nodes: [
                {
                  id: "111",
                  name: "查询"
                },
                {
                  id: "112",
                  name: "新增"
                },
                {
                  id: "113",
                  name: "编辑"
                },
                {
                  id: "114",
                  name: "删除"
                }
              ]
            }

            // {
            //   value: "权限管理",
            //   label: "权限管理",
            //   children: [
            //     {
            //       value: "查询",
            //       label: "查询"
            //     },
            //     {
            //       value: "新增",
            //       label: "新增"
            //     },
            //     {
            //       value: "编辑",
            //       label: "编辑"
            //     },
            //     {
            //       value: "删除",
            //       label: "删除"
            //     }
            //   ]
            // },
            // {
            //   value: "账号管理",
            //   label: "账号管理",
            //   children: [
            //     {
            //       value: "查询",
            //       label: "查询"
            //     },
            //     {
            //       value: "新增",
            //       label: "新增"
            //     },
            //     {
            //       value: "编辑",
            //       label: "编辑"
            //     },
            //     {
            //       value: "删除",
            //       label: "删除"
            //     }
            //   ]
            // },

            // {
            //   value: "生产商管理",
            //   label: "生产商管理",
            //   children: [
            //     {
            //       value: "查询",
            //       label: "查询"
            //     },
            //     {
            //       value: "新增",
            //       label: "新增"
            //     },
            //     {
            //       value: "编辑",
            //       label: "编辑"
            //     },
            //     {
            //       value: "删除",
            //       label: "删除"
            //     }
            //   ]
            // }
          ]
        }
        // {
        //   value: "标签管理",
        //   label: "标签管理",
        //   children: [
        //     {
        //       value: "激活码管理",
        //       label: "激活码管理",
        //       children: [
        //         {
        //           value: "统计",
        //           label: "统计"
        //         },
        //         {
        //           value: "导入",
        //           label: "导入"
        //         }
        //       ]
        //     },
        //     {
        //       value: "防伪码管理",
        //       label: "防伪码管理",
        //       children: [
        //         {
        //           value: "统计",
        //           label: "统计"
        //         },
        //         {
        //           value: "导入",
        //           label: "导入"
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   value: "仓库管理",
        //   label: "仓库管理",
        //   children: [
        //     {
        //       value: "入仓管理",
        //       label: "入仓管理",
        //       children: [
        //         {
        //           value: "入仓",
        //           label: "入仓"
        //         },
        //         {
        //           value: "导出",
        //           label: "导出"
        //         }
        //       ]
        //     },
        //     {
        //       value: "发货管理",
        //       label: "发货管理",
        //       children: [
        //         {
        //           value: "手动",
        //           label: "手动"
        //         },
        //         {
        //           value: "扫码",
        //           label: "扫码"
        //         },
        //         {
        //           value: "导出",
        //           label: "导出"
        //         },
        //         {
        //           value: "删除",
        //           label: "删除"
        //         }
        //       ]
        //     },
        //     {
        //       value: "退货管理",
        //       label: "退货管理",
        //       children: [
        //         {
        //           value: "手动",
        //           label: "手动"
        //         },
        //         {
        //           value: "扫码",
        //           label: "扫码"
        //         },
        //         {
        //           value: "导出",
        //           label: "导出"
        //         },
        //         {
        //           value: "删除",
        //           label: "删除"
        //         }
        //       ]
        //     },

        //     {
        //       value: "库存管理",
        //       label: "库存管理",
        //       children: [
        //         {
        //           value: "查询",
        //           label: "查询"
        //         },
        //         {
        //           value: "导出",
        //           label: "导出"
        //         },
        //         {
        //           value: "拆解",
        //           label: "拆解"
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   value: "信息管理",
        //   label: "信息管理",
        //   children: [
        //     {
        //       value: "物料管理",
        //       label: "物料管理",
        //       children: [
        //         {
        //           value: "查询",
        //           label: "查询"
        //         },
        //         {
        //           value: "新增",
        //           label: "新增"
        //         },
        //         {
        //           value: "编辑",
        //           label: "编辑"
        //         },
        //         {
        //           value: "删除",
        //           label: "删除"
        //         }
        //       ]
        //     },
        //     {
        //       value: "权限管理",
        //       label: "权限管理",
        //       children: [
        //         {
        //           value: "查询",
        //           label: "查询"
        //         },
        //         {
        //           value: "新增",
        //           label: "新增"
        //         },
        //         {
        //           value: "编辑",
        //           label: "编辑"
        //         },
        //         {
        //           value: "删除",
        //           label: "删除"
        //         }
        //       ]
        //     },
        //     {
        //       value: "账号管理",
        //       label: "账号管理",
        //       children: [
        //         {
        //           value: "查询",
        //           label: "查询"
        //         },
        //         {
        //           value: "新增",
        //           label: "新增"
        //         },
        //         {
        //           value: "编辑",
        //           label: "编辑"
        //         },
        //         {
        //           value: "删除",
        //           label: "删除"
        //         }
        //       ]
        //     },

        //     {
        //       value: "生产商管理",
        //       label: "生产商管理",
        //       children: [
        //         {
        //           value: "查询",
        //           label: "查询"
        //         },
        //         {
        //           value: "新增",
        //           label: "新增"
        //         },
        //         {
        //           value: "编辑",
        //           label: "编辑"
        //         },
        //         {
        //           value: "删除",
        //           label: "删除"
        //         }
        //       ]
        //     }
        //   ]
        // }
      ];
      for (let i = 0; i < result.length; i++) {
        result[i].allChecked = false;
        result[i].childShow = false;
        for (let j = 0; j < result[i].nodes.length; j++) {
          result[i].nodes[j].mychecked = false;
          for (let m = 0; m < result[i].nodes[j].nodes.length; m++) {
            result[i].nodes[j].nodes[m].onechecked = false;
          }
        }
      }
      this.menuList = result;
    },
    showBlock(index) {
      if (this.menuList[index].childShow) {
        this.$set(this.menuList[index], "childShow", false);
        // this.menuList[index].childShow = false;
      } else {
        this.$set(this.menuList[index], "childShow", true);
        // this.menuList[index].childShow = true;
      }
    },
    handleFilterClassify() {
      this.options = [];
      this.dialogVisibleClassify = true;
      this.initStatu();
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    editRole(row, index) {
      console.log(row, index);
      this.funName = false;
      this.menuList = [];
      this.dialogVisibleClassify = true;
      this.showTitle = "编辑用户角色";
      this.roleValue = row.u_type;
      for (let i = 0; i < row.rightList.length; i++) {
        const arr = row.rightList[i];
        if (arr.status === 2) {
          this.$set(arr, "allChecked", true);
          // arr.allChecked = true;
          for (let j = 0; j < arr.nodes.length; j++) {
            this.$set(arr.nodes[j], "mychecked", true);
            // arr.nodes[j].mychecked = true;
            for (let m = 0; m < arr.nodes[j].nodes.length; m++) {
              this.$set(arr.nodes[j].nodes[m], "onechecked", true);
              // arr.nodes[j].nodes[m].onechecked = true;
            }
          }
        } else if (arr.status === 1) {
          this.$set(arr, "allChecked", false);
          // arr.allChecked = false;
          for (let j = 0; j < arr.nodes.length; j++) {
            if (arr.nodes[j].status === 2) {
              for (let m = 0; m < arr.nodes[j].nodes.length; m++) {
                this.$set(arr.nodes[j].nodes[m], "onechecked", true);
                // arr.nodes[j].nodes[m].onechecked = true;
              }
            } else if (arr.nodes[j].status === 1) {
              for (let m = 0; m < arr.nodes[j].nodes.length; m++) {
                if (arr.nodes[j].nodes[m].status === 2) {
                  this.$set(arr.nodes[j].nodes[m], "onechecked", true);
                  // arr.nodes[j].nodes[m].onechecked = true;
                } else {
                  this.$set(arr.nodes[j].nodes[m], "onechecked", false);
                  // arr.nodes[j].nodes[m].onechecked = false;
                }
              }
            } else {
              this.$set(arr, "allChecked", false);
              // arr.allChecked = false;
              for (let i = 0; i < arr.nodes.length; i++) {
                this.$set(arr.nodes[i], "mychecked", false);
                // arr.nodes[i].mychecked = false;
                for (let j = 0; j < arr.nodes[i].nodes.length; j++) {
                  this.$set(arr.nodes[i].nodes[j], "onechecked", false);
                  // arr.nodes[i].nodes[j].onechecked = false;
                }
              }
            }
          }
        }
        this.$set(arr, "childShow", false);
        this.menuList.push(arr);
      }
      this.tableData[index].rightList = this.menuList;
      this.tableData[index].u_type = this.roleValue;
    },
    editData() {
      this.funName = true;
      this.dialogVisibleClassify = false;
      console.log(this.tableData);
    },
    getDataList() {
      this.total = this.tableData.length;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.getDataList();
    },
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      // this.getDataList();
    },
    firstChanged(index, id) {
      const arr = this.menuList[index].nodes;
      // console.log(arr);

      if (this.menuList[index].allChecked) {
        this.$set(this.menuList[index], "status", 2);
        // this.menuList[index].status = 2;
        for (let i = 0; i < arr.length; i++) {
          this.$set(arr[i], "mychecked", true);
          // arr[i].mychecked = true;
          const arr1 = arr[i].nodes;
          for (let j = 0; j < arr1.length; j++) {
            this.$set(arr1[j], "onechecked", true);
            // arr1[j].onechecked = true;
          }
        }
      } else {
        this.$set(this.menuList[index], "status", 0);
        for (let i = 0; i < arr.length; i++) {
          this.$set(arr[i], "mychecked", false);
          // arr[i].mychecked = false;
          const arr1 = arr[i].nodes;
          for (let j = 0; j < arr1.length; j++) {
            this.$set(arr1[j], "onechecked", false);
            // arr1[j].onechecked = false;
          }
        }
      }
      console.log(this.menuList);
    },
    secondChanged(fatherIndex, ownerIndex, ownerId, fatherId) {
      const arr = this.menuList[fatherIndex].nodes[ownerIndex];
      let checkCount = 0;
      const len = this.menuList[fatherIndex].nodes.length;
      for (let n = 0; n < this.menuList[fatherIndex].nodes.length; n++) {
        if (this.menuList[fatherIndex].nodes[n].mychecked) {
          checkCount++;
        }
      }
      if (checkCount === len) {
        this.menuList[fatherIndex].status = 2;
        this.menuList[fatherIndex].allChecked = true;
      } else if (checkCount > 0) {
        this.menuList[fatherIndex].status = 1;
        this.menuList[fatherIndex].allChecked = false;
      } else {
        this.menuList[fatherIndex].status = 0;
        this.menuList[fatherIndex].allChecked = false;
      }
      if (arr.mychecked) {
        arr.status = 2;
        for (let i = 0; i < arr.nodes.length; i++) {
          arr.nodes[i].onechecked = true;
        }
      } else {
        for (let i = 0; i < arr.nodes.length; i++) {
          arr.nodes[i].onechecked = false;
        }
      }
      console.log(this.menuList);
    },
    thirdChanged(grandfatherIndex, fatherIndex, id, fatherId, grandfatherId) {
      const arr = this.menuList[grandfatherIndex].nodes[fatherIndex].nodes;
      let checkCount = 0;
      let grandCount = 0;
      const len = arr.length;
      const gArr = this.menuList[grandfatherIndex].nodes;
      for (let n = 0; n < arr.length; n++) {
        if (arr[n].onechecked) {
          arr[n].status = 2;
          checkCount++;
        } else {
          arr[n].status = 0;
        }
      }
      if (checkCount === len) {
        this.menuList[grandfatherIndex].nodes[fatherIndex].status = 2;
        this.menuList[grandfatherIndex].status = 2;
        this.menuList[grandfatherIndex].nodes[fatherIndex].mychecked = true;
      } else if (checkCount > 0) {
        this.menuList[grandfatherIndex].nodes[fatherIndex].status = 1;
        this.menuList[grandfatherIndex].status = 1;
        this.menuList[grandfatherIndex].nodes[fatherIndex].mychecked = false;
      } else {
        this.menuList[grandfatherIndex].nodes[fatherIndex].status = 0;
        this.menuList[grandfatherIndex].status = 0;
        this.menuList[grandfatherIndex].nodes[fatherIndex].mychecked = false;
      }

      for (let j = 0; j < gArr.length; j++) {
        if (gArr[j].mychecked) {
          grandCount++;
        }
      }
      if (grandCount === this.menuList[grandfatherIndex].nodes.length) {
        // this.menuList[grandfatherIndex].status = 2;
        this.menuList[grandfatherIndex].allChecked = true;
      } else if (grandCount > 0) {
        // this.menuList[grandfatherIndex].status = 1;
        this.menuList[grandfatherIndex].allChecked = false;
      } else {
        // this.menuList[grandfatherIndex].status = 0;
        this.menuList[grandfatherIndex].allChecked = false;
      }
      console.log(this.menuList);
    },
    hideInfo(row, column, cell, event) {
      if (column.property === "u_type") {
        this.roleName = row.u_type;
        const arr = row.rightList;

        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].nodes.length; j++) {
            for (let m = 0; m < arr[i].nodes[j].nodes.length; m++) {
              if (arr[i].nodes[j].nodes[m].status === 0) {
                arr[i].nodes[j].nodes[m].name = "";
              }
            }
          }
        }
        this.info = arr[0].nodes;
        this.powerInfo = true;
      } else {
        this.powerInfo = false;
      }
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    console.log(this.tableData);
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDataList();
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
.t_header > .cell {
  display: flex !important;
  justify-content: space-between;
}

/* .el-table__row {
  height: 60px !important;
} */
.container {
  display: flex;
  width: 100%;
}
.powerContain {
  width: 45%;
}
.contentRight {
  background-color: #2a426e;
  margin-left: 180px;
  flex: 1;
  text-align: center;
  padding-top: 33px;
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
  display: flex;
  padding: 10px 16px;
  justify-content: space-between;
}
.circle {
  width: 14px;
  height: 14px;
  display: inline-block;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(190, 187, 186, 1);
  border-radius: 14px;
}
.menuName {
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
  padding: 50px 0 0 50px;
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
</style>
