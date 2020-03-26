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
</style>
