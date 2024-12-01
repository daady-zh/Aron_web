<script setup>
import { ref } from 'vue'
const activeIndex = ref(0)

const list = ref([
  { id: 1, classification: '最热模块' },
  { id: 1, classification: '英语模块' },
  { id: 3, classification: '通用模块' },
  { id: 5, classification: '外场模块' }
])
</script>

<template>
  <router-view></router-view>
  <!-- 分类 -->
  <van-nav-bar fixed style="--van-nav-bar-background: #6966f4; --van-nav-bar-title-text-color: white" title="全部分类" />
  <van-search readonly shape="round" background="#f1f1f2" placeholder="请输入搜索关键词" @click="$router.push('/search')" />
  <div class="category">
    <!-- 分类列表 -->
    <div class="list-box">
      <div class="left">
        <ul>
          <li v-for="(item, index) in list" :key="item.id">
            <a :class="{ active: index === activeIndex }" @click="activeIndex = index" href="javascript:;">{{ item.classification }}</a>
          </li>
        </ul>
      </div>
      <div class="right">
        <div @click="$router.push('/modules/question')" class="cate-goods">
          <img src="@/assets/english1.png" alt="" />
          <p>执照英语</p>
        </div>
        <div @click="$router.push('/modules/question')" v-for="(item, index) in 6" :key="index" class="cate-goods">
          <img style="padding: 10px" src="@/assets/triple.png" alt="" />
          <p>开发中</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// 主题 padding
.category {
  padding-top: 100px;
  padding-bottom: 50px;
  height: 100vh;
  .list-box {
    height: 100%;
    display: flex;
    .left {
      width: 85px;
      height: 100%;
      background-color: #f3f3f3;
      overflow: auto;
      a {
        display: block;
        height: 45px;
        line-height: 45px;
        text-align: center;
        color: #444444;
        font-size: 12px;
        &.active {
          color: #fb442f;
          background-color: #fff;
        }
      }
    }
    .right {
      flex: 1;
      height: 100vh;
      background-color: #ffffff;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      padding: 10px 0;
      overflow: auto;

      .cate-goods {
        width: 33.3%;
        margin-bottom: 10px;
        img {
          width: 70px;
          height: 70px;
          display: block;
          margin: 5px auto;
        }
        p {
          text-align: center;
          font-size: 12px;
        }
      }
    }
  }
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}
</style>
