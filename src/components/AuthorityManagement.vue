<!-- 权限管理 -->
<template>
  <div class="powerContain">
    <el-table ref="singleTable" :data="tableData" style="margin:40px 60px;">
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
        </el-table-column>
        <el-table-column label="权限设置" align="center" prop="u_type">
          <template slot-scope="scope">
            <span class="editButton" @click="editRole(scope.row)">修改</span>
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
            >
              <div class="itemHeader">
                <div v-cloak>{{ first.name }}</div>
                <div class="allCheck">
                  <el-checkbox
                    v-model="first.allCheck"
                    @change="firstChanged(firIndex, first.id)"
                    :label="first.id"
                    >全选</el-checkbox
                  >
                </div>
              </div>
              <div class="itemContent">
                <template v-for="second in first.nodes">
                  <el-checkbox
                    v-model="second.mychecked"
                    @change="secondChanged(firIndex, second.id)"
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
                        v-model="third.mychecked"
                        @change="secondChanged(second.id, third.id)"
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
          <!-- <el-checkbox-group v-model="checkList">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
            <el-checkbox label="禁用" disabled></el-checkbox>
            <el-checkbox label="选中且禁用" disabled></el-checkbox>
          </el-checkbox-group> -->
        </div>
        <!-- <el-cascader-panel
          :options="options"
          :props="props"
          @change="menusGroup"
          :value="SelectdeptId"
          clearable
        ></el-cascader-panel> -->
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleClassify = false">取 消</el-button>
        <el-button type="primary" @click="initTableData">确 定</el-button>
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
          u_type: "超级管理员"
          // meanuList: [
          //   // "1",
          //   // "11",
          //   // "114"
          //   // // { id: ["1", "11", "114"], value: ["1", "11", "114"] }
          //   // // { value: "1", label: "设置管理" },
          //   // // { value: "11", label: "物料管理" },
          //   // // { value: "114", label: "查询" }
          //   {
          //     id: "1",
          //     name: "设置管理",
          //     node: [
          //       {
          //         id: "11",
          //         name: "物料管理",
          //         node: [
          //           {
          //             id: "111",
          //             name: "查询"
          //           }
          //         ]
          //       }
          //     ]
          //   }
          // ]
        },
        {
          u_type: "普通管理员"
        },
        {
          u_type: "普通用户"
        },
        {
          u_type: "游客"
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
      menuList: [
        {
          id: "1",
          name: "设置管理",
          allCheck: false,
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
      ]
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
    },
    menusGroup(value) {
      console.log(value);
    },
    handleFilterClassify() {
      this.dialogVisibleClassify = true;
    },
    editRole(row) {
      console.log(row);
      // this.SelectdeptId = [];
      this.dialogVisibleClassify = true;
      this.showTitle = "编辑用户角色";
      this.roleValue = row.u_type;
      // this.SelectdeptId = this.changeDetSelect(row.meanuList[0], this.options);
      // console.log(this.SelectdeptId);
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
    mockData() {
      console.log(this.options[0].children[0].children[0].value);

      this.nowValue = this.options[0].children[0].children[0].value;
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDataList();
    // this.initTableData();
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

.el-table__row {
  height: 60px !important;
}
.powerContain {
  width: 45%;
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
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
}
.itemContent {
  display: flex;
  justify-content: space-between;
}
</style>
