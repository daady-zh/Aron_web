<template>
  <div>
    <!-- 二级路由出口 -->
    <router-view></router-view>

    <van-tabbar placeholder route active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/modules" icon="apps-o">插件分类</van-tabbar-item>
      <van-tabbar-item to="/apartment" icon="cluster-o">部门模块</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
