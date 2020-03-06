<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <img src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="美团" />
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input
            @focus="focus"
            @blur="blur"
            @input="input"
            v-model="search"
            placeholder="搜索商家或地点"
          />
          <button class="el-button el-button--primary">
            <i class="el-icon-search" />
          </button>
          <!-- 鼠标聚焦时出现 -->
          <dl class="hotPlace" v-if="isHotPlace">
            <dt>热门搜索</dt>
            <dd>
              <a>天安门</a>
            </dd>
          </dl>
          <!-- 输入内容时出现 -->
          <dl class="searchList" v-if="isSearchList">
            <dd>
              <a>老火锅</a>
            </dd>
          </dl>
        </div>

        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      isFocus: false,
      hotPlace: [],
      searchList: []
    };
  },
  methods: {
    focus() {
      this.isFocus = true;
    },
    blur() {
      // 点击下拉框中的内容时也会造成失去焦点，所以这里加一个延时
      setTimeout(() => {
        this.isFocus = false;
      }, 200);
    },
    input() {}
  },
  computed: {
    isHotPlace() {
      // 聚焦无输入
      return this.isFocus && !this.search;
    },
    isSearchList() {
      // 聚焦且输入
      return this.isFocus && this.search;
    }
  }
};
</script>

<style>
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>