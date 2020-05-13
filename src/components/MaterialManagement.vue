<!-- 物料管理 -->
<template>
  <div class="container">
    <div style="padding: 25px 20px;">
      <div
        style="display:flex;justify-content: space-between;margin-bottom:25px"
      >
        <div v-if="s_show">
          <el-input
            v-model="search"
            prefix-icon="el-icon-search"
            clearable
            style="border-radius:4px;width:400px;margin-right:10px"
            placeholder="输入关键字搜索"
          />
          <el-button @click="searchEnterFun()" type="primary"
            ><i class="el-icon-search"></i> 搜索</el-button
          >
        </div>

        <div>
          <el-button
            @click="addRow('materialform')"
            type="primary"
            v-if="a_show"
            ><i class="el-icon-plus"></i> 新增</el-button
          >
          <el-button
            @click="batchDelete(tableDataSelections)"
            :type="defaultColr"
            v-if="d_show"
            :disabled="btnStatu"
            ><i class="el-icon-delete"></i>删除</el-button
          >
        </div>
      </div>

      <el-table
        ref="filterTable"
        :data="tableData"
        v-loading="loading"
        @filter-change="fnFilterChangeInit"
        @selection-change="selectionChangeHandle"
        :row-key="getRowKey"
        :header-cell-style="{
          fontSize: '15px',
          color: '#000',
          fontWeight: 800,
          background: '#eef1f6'
        }"
        border
        height="600"
      >
        <el-table-column
          type="selection"
          width="100"
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          prop="materialCode"
          label="产品编号"
          edit="false"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="materialTypeName"
          label="产品类别"
          edit="false"
          align="center"
          width="180"
          :filter-multiple="false"
          :filters="materialTypeNameGroup"
          :filter-method="filterTag"
          column-key="materialTypeName"
          filter-placement="bottom-end"
        >
        </el-table-column>
        <el-table-column
          prop="materialModel"
          label="产品型号"
          width="180"
          edit="false"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="spec"
          label="规格 "
          align="center"
          width="160"
          edit="false"
        >
        </el-table-column>

        <el-table-column
          prop="producerName"
          label="生产商"
          edit="false"
          align="center"
          :filter-multiple="false"
          :filters="producerNameGroup"
          :filter-method="filterTag"
          column-key="producerName"
          filter-placement="bottom-end"
        >
        </el-table-column>

        <el-table-column
          prop="status"
          align="center"
          label="状态"
          width="85"
          :filter-multiple="false"
          :column-key="'status'"
          :filters="status"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isCheck" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="marketDate"
          label="上市日期"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="e_show"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="d_show"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :currentPage="currentPage"
        :total="total"
        :limit="limit"
        :small="true"
        @handleCurrentChange="handleCurrentChange"
        style="margin:15px 50px;"
      />

      <el-dialog
        title="物料编辑"
        :visible.sync="newDialogTableVisible"
        custom-class="sendPro"
        center
        width="620px"
        @close="quit"
      >
        <el-form
          ref="materialform"
          :model="form"
          label-width="80px"
          class="materialform"
        >
          <el-form-item label="产品编号" prop="materialCode">
            <el-col :span="13">
              <el-input v-model="form.materialCode"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="产品类别" prop="materialType">
            <el-col :span="13">
              <el-select
                v-model="form.materialType"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="(item, index) in materialTypeNameGroup"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="产品型号" prop="materialModel">
            <el-col :span="13">
              <el-input v-model="form.materialModel"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="产品规格" prop="spec">
            <el-col :span="13">
              <el-input v-model="form.spec" readonly></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="生产商" prop="producerId">
            <el-col :span="13">
              <el-select
                v-model="form.producerId"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="(item, index) in producerNameGroup"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-col :span="13">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="(item, index) in status"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="上市日期" prop="marketDate">
            <el-col :span="13">
              <el-input v-model="form.marketDate" type="number"></el-input>
            </el-col>
            <span>(格式：yyyymmdd)</span>
          </el-form-item>
          <el-form-item label="上传图片" prop="imageUrls">
            <ul style="display:flex;justify-content: space-around;">
              <li style="text-align: center">
                <el-upload
                  class="avatar-uploader"
                  action="string"
                  :show-file-list="false"
                  :http-request="handleChange"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>俯视</span>
              </li>
              <li style="text-align: center">
                <el-upload
                  class="avatar-uploader"
                  action="string"
                  :show-file-list="false"
                  :http-request="handleChange1"
                >
                  <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>仰视</span>
              </li>
              <li style="text-align: center">
                <el-upload
                  class="avatar-uploader"
                  action="string"
                  :show-file-list="false"
                  :http-request="handleChange2"
                >
                  <img v-if="imageUrl2" :src="imageUrl2" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>45°角</span>
              </li>
              <li style="text-align: center">
                <el-upload
                  class="avatar-uploader"
                  action="string"
                  :show-file-list="false"
                  :http-request="handleChange3"
                >
                  <img v-if="imageUrl3" :src="imageUrl3" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>90°角</span>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="产品参数" prop="description">
            <el-input
              type="textarea"
              v-model="form.description"
              rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('materialform')"
              >确定</el-button
            >
            <el-button @click="clearForm('materialform')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <del-dialog
        :keyNumber="changeKey"
        @onLoadData="onLoadData"
        :headerTitle="`删除物料`"
        :ids="delArr"
        :delPath="`/material/delete`"
        :delContent="`确定删除物料,数据无法找回!`"
      >
      </del-dialog>
    </div>
    <el-dialog
      title="错误提示"
      :visible.sync="errorVisible"
      width="400px"
      :before-close="handleClose"
    >
      <span>{{ infoTitle }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="errorVisible = false">取 消</el-button>
        <el-button type="primary" @click="errorVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import pagination from '../components/Pagenation'
import axios from 'axios'
import DelDialog from './DelDialog'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { pagination, DelDialog },
  data() {
    // 这里存放数据
    return {
      tableData: [],
      search: '',
      materialTypeNameGroup: [],
      producerNameGroup: [],
      tableDataSelections: [],
      // 状态
      status: [
        { text: '上市', value: 0 },
        { text: '已下市', value: 1 }
      ],
      currentPage: 1,
      limit: 10,
      total: 0,
      isCheck: true,
      s_show: false,
      a_show: false,
      d_show: false,
      e_show: false,
      producerId: '',
      materialType: '',
      newDialogTableVisible: false,
      imageUrl: '',
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      imageUrls: [],
      form: {
        materialCode: '',
        materialType: '',
        materialModel: '',
        spec: '',
        producerId: '',
        status: '',
        marketDate: '',
        description: '',
        imageUrls: []
      },
      editPro: false,
      countMark: 0,
      changeKey: 0,
      delArr: '',
      btnStatu: true,
      defaultColr: 'info',
      infoTitle: '',
      errorVisible: false,
      loading: true
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    countMark: {
      handler(newValue, oldValue) {
        this.$route.go(0)
      }
    }
  },
  // 方法集合
  methods: {
    makeData() {
      this.searchAll(
        this.currentPage,
        this.limit,
        '/material/listData',
        '&value=',
        this.search,
        '&materialType=',
        this.materialType,
        '&producerId=',
        this.producerId,
        ''
      ).then(res => {
        if (res.status === 200) {
          this.loading = false
          this.tableData = res.data.object.list
          this.getDataList(res.data.object.total)
          this.getStatu()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    selectionChangeHandle(selections) {
      console.log(selections)
      this.tableDataSelections = []
      for (let i = 0; i < selections.length; i++) {
        this.tableDataSelections.push(selections[i].id)
      }
      if (selections.length > 0) {
        this.defaultColr = 'primary'
        this.btnStatu = false
      } else {
        this.defaultColr = 'info'
        this.btnStatu = true
      }
    },
    // table column 的方法，改写这个方法
    filterTag(value, row, column) {
      return true
    },
    // table 的方法
    // filter 的格式  obj { column-key: Array }
    // Array[0] 筛选的值
    fnFilterChangeInit(filter) {
      console.log(filter)
      // // do something
      if (filter.materialTypeName) {
        if (filter.materialTypeName.length > 0) {
          this.materialType = filter.materialTypeName[0]
        } else {
          this.materialType = ''
        }
      } else if (filter.producerName) {
        if (filter.producerName.length > 0) {
          this.producerId = filter.producerName[0]
        } else {
          this.producerId = ''
        }
      } else if (filter.status) {
        if (filter.status.length > 0) {
          this.producerId = filter.producerName[0]
        } else {
          this.producerId = ''
        }
      }
      this.makeData()
    },

    getDataList(total) {
      this.total = total
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.makeData()
    },
    // 表格新增行
    addRow(form) {
      this.newDialogTableVisible = true
      // this.form = ''
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.form.spec = '1个'
      this.imageUrl = ''
      this.imageUrl1 = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
      this.imageUrls = []
    },
    // 删除选中数据（单纯实现前端删除）
    batchDelete(selections) {
      this.changeKey++
      this.delArr = this.tableDataSelections.join(',')
    },
    getStatu() {
      this.tableData.map(item => {
        if (item.status === 0) {
          this.$set(item, 'isCheck', true) // 这里，给对象添加属性，用$set方法。
        } else {
          this.$set(item, 'isCheck', false) // 这里，给对象添加属性，用$set方法。
        }
        return item
      })
    },
    getType() {
      this.getSums('/material/getSearchData').then(res => {
        const datas = res.data.object
        for (let i = 0; i < datas.materialTypes.length; i++) {
          this.materialTypeNameGroup.push({
            text: datas.materialTypes[i].desc,
            value: datas.materialTypes[i].value
          })
        }
        for (let i = 0; i < datas.producerVos.length; i++) {
          this.producerNameGroup.push({
            text: datas.producerVos[i].producerName,
            value: datas.producerVos[i].id
          })
        }
      })
    },
    getRowKey(row) {
      return row.id
    },
    searchEnterFun() {
      this.makeData()
    },
    initBtn() {
      const btnArr = JSON.parse(this.$route.query.btnRight)
      console.log(btnArr)
      // this.countMark = this.$route.query.countMark
      btnArr.forEach(item => {
        if (item.rightName === '新增') {
          // this.$set(this.btnArr, 'a_show', true)
          this.a_show = true
        } else if (item.rightName === '删除') {
          this.d_show = true
        } else if (item.rightName === '编辑') {
          this.e_show = true
        } else if (item.rightName === '查询') {
          this.s_show = true
        }
      })
    },
    submitForm(form) {
      console.log(this.form)
      if (this.imageUrls.length === 4) {
        for (const key in this.form) {
          if (key !== 'imageUrls') {
            if (this.form[key] === '') {
              this.errorVisible = true
              this.infoTitle = '所有内容不能为空'
            }
          }
        }
        console.log(this.form)

        if (!this.errorVisible) {
          this.newDialogTableVisible = false
          let url = ''
          if (this.editPro) {
            url = '/material/update'
          } else {
            url = '/material/insert'
          }
          this.form.imageUrls = JSON.stringify(this.imageUrls)
          console.log(this.form)

          this.dataChange(this.form, url).then(res => {
            console.log(res)
            if (res.data.code === 200) {
              this.imageUrl = ''
              this.imageUrl1 = ''
              this.imageUrl2 = ''
              this.imageUrl3 = ''
              this.imageUrls = []
              this.$refs[form].resetFields()
              this.makeData()
              this.editPro = false
            } else {
              this.errorVisible = true
              this.infoTitle = res.data.msg
            }
          })
        }
      } else {
        this.errorVisible = true
        this.infoTitle = '所有内容不能为空'
      }
    },
    handleChange(param) {
      const fd = new FormData()
      fd.append('image', param.file) // 传文件
      fd.append('location', '1') // 传参数
      fd.append('materialModel', this.form.materialModel) // 传参数
      axios.post('/material/uploadImage', fd).then(res => {
        this.imageUrl = res.data.object
        if (this.imageUrls.length > 0) {
          for (let i = 0; i < this.imageUrls.length; i++) {
            if (this.imageUrls[i].location === '1') {
              this.imageUrls.splice(i, 1)
            }
          }
        }

        this.imageUrls.push({ image: res.data.object, location: '1' })
      })
    },
    handleChange1(param) {
      const fd = new FormData()
      fd.append('image', param.file) // 传文件
      fd.append('location', '2') // 传参数
      fd.append('materialModel', this.form.materialModel) // 传参数
      axios.post('/material/uploadImage', fd).then(res => {
        console.log(res)

        this.imageUrl1 = res.data.object
        if (this.imageUrls.length > 0) {
          for (let i = 0; i < this.imageUrls.length; i++) {
            if (this.imageUrls[i].location === '2') {
              this.imageUrls.splice(i, 1)
            }
          }
        }
        this.imageUrls.push({ image: this.imageUrl1, location: '2' })
      })
    },
    handleChange2(param) {
      const fd = new FormData()
      fd.append('image', param.file) // 传文件
      fd.append('location', '3') // 传参数
      fd.append('materialModel', this.form.materialModel) // 传参数
      axios.post('/material/uploadImage', fd).then(res => {
        this.imageUrl2 = res.data.object
        for (let i = 0; i < this.imageUrls.length; i++) {
          if (this.imageUrls[i].location === '3') {
            this.imageUrls.splice(i, 1)
          }
        }
        this.imageUrls.push({ image: res.data.object, location: '3' })
      })
    },
    handleChange3(param) {
      const fd = new FormData()
      fd.append('image', param.file) // 传文件
      fd.append('location', '4') // 传参数
      fd.append('materialModel', this.form.materialModel) // 传参数
      axios.post('/material/uploadImage', fd).then(res => {
        this.imageUrl3 = res.data.object
        for (let i = 0; i < this.imageUrls.length; i++) {
          if (this.imageUrls[i].location === '4') {
            this.imageUrls.splice(i, 1)
          }
        }
        this.imageUrls.push({ image: res.data.object, location: '4' })
      })
    },
    handleEdit(index, row) {
      this.imageUrls = []
      this.imageUrl = ''
      this.imageUrl1 = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
      this.resetPassword(row.id, '/material/getOne').then(res => {
        const imgs = JSON.parse(res.data.object.imageUrls)
        console.log(imgs)

        for (let i = 0; i < imgs.length; i++) {
          if (imgs[i].location === '1') {
            this.imageUrl = imgs[i].image
            this.imageUrls.push({ image: imgs[i].image, location: '1' })
          } else if (imgs[i].location === '2') {
            this.imageUrl1 = imgs[i].image
            this.imageUrls.push({ image: imgs[i].image, location: '2' })
          } else if (imgs[i].location === '3') {
            this.imageUrl2 = imgs[i].image
            this.imageUrls.push({ image: imgs[i].image, location: '3' })
          } else if (imgs[i].location === '4') {
            this.imageUrl3 = imgs[i].image
            this.imageUrls.push({ image: imgs[i].image, location: '4' })
          }
        }
        this.form = res.data.object
        this.editPro = true
        this.newDialogTableVisible = true
      })
    },
    handleDelete(index, row) {
      this.changeKey++
      this.delArr = row.id.toString()
    },
    clearForm(form) {
      this.$refs[form].resetFields()
      this.newDialogTableVisible = false
      this.editPro = false
    },
    onLoadData() {
      this.$refs.filterTable.clearSelection()
      this.makeData()
    },
    handleClose(done) {
      this.errorVisible = false
    },
    quit() {
      this.newDialogTableVisible = false
      this.editPro = false
      this.imageUrls = []
      this.imageUrl = ''
      this.imageUrl1 = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
      this.form = {}
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.makeData()
    this.getType()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
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
<style>
.el-table__header .el-table-column--selection .cell .el-checkbox:after {
  content: '全选';
  font-size: 15px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  position: relative;
  top: 36px;
}
.avatar {
  width: 110px;
  height: 110px;
  display: block;
}
</style>
<style scope>
.t_header > .cell {
  display: flex !important;
  justify-content: space-between;
}
.materialform {
  text-align: center;
}
.container {
  margin: 40px 60px;
  width: 100%;
}
</style>
