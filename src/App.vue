<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 page3 -->
    </router-view>
    <!-- <router-view /> -->
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style>
html,
body,
#app {
  height: 100%;
}
.el-tabs__item {
  width: 200px !important;
  text-align: center;
  border-bottom: 0;
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-top: 3px solid #2a426e;
}
.el-tabs--card > .el-tabs__header {
  margin: 0;
}
::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
.container {
  margin: 25px 20px;
  width: 100%;
  background-color: #fff;
}
.el-dialog__header {
  padding-bottom: 10px;
}
.rowStyle {
  background-color: #f5f7fa !important;
  color: #000;
}

/* .el-table__body tr:hover > td {
  background-color: red !important;
} */
/* .el-table__header .el-table-column--selection .cell .el-checkbox:after {
  content: '全选';
  font-size: 15px;
} */
</style>
