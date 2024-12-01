<script setup></script>

<template>
  <div class="home">
    <!-- 导航条 -->
    <van-nav-bar style="--van-nav-bar-background: #6966f4; --van-nav-bar-title-text-color: white" title="开心维护" fixed />

    <!-- 搜索框 -->
    <van-search readonly shape="round" background="#f1f1f2" placeholder="请在此输入搜索关键词" @click="$router.push('/search')" />

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <img src="@/assets/bg1.jpg" alt="" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="@/assets/H145.jpeg" alt="" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="@/assets/tree.jpg" alt="" />
      </van-swipe-item>
    </van-swipe>

    <!-- 导航 -->
    <van-grid column-num="4">
      <van-grid-item v-for="(item, index) in 8" :key="index" @click="$router.push('/modules/category')">
        <img style="width: 40px" src="@/assets/Home.png" alt="" />
        <div>开发中</div>
      </van-grid-item>
    </van-grid>

    <!-- 主会场 -->
    <div class="main">
      <img src="@/assets/H145.jpeg" alt="" />
    </div>

    <!-- 猜你喜欢 -->
    <div class="guess">
      <p class="guess-title">—— 猜你喜欢 ——</p>

      <div class="goods-list">
        <!-- <GoodsItem v-for="item in 10" :key="item"></GoodsItem> -->
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// 主题 padding
.home {
  padding-top: 100px;
  padding-bottom: 50px;
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}

// 分类导航部分
.my-swipe .van-swipe-item {
  height: 185px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #39a9ed;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 185px;
}

// 主会场
.main img {
  display: block;
  width: 100%;
}

// 猜你喜欢
.guess .guess-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
