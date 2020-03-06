<template>
  <!-- 基础模板，上中下布局 -->
  <el-container class="layout-default">
    <el-header height="197px">
      <my-header></my-header>
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer height="100%">
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import MyHeader from "@/components/public/header/index";
import Footer from "@/components/public/footer/footer";
export default {
  components: {
    Footer,
    MyHeader
  }
};
</script>
