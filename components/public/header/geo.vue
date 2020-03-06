<template>
  <div class="m-geo">
    <i class="el-icon-location" />
    <span class="cursor">邵阳</span>
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>[
    <span class="cursor">邵东市</span>
    <span class="cursor">隆回</span>
    <span class="cursor">冷水江</span>]
  </div>
</template>

<script>
export default {};
</script>

<style lang="css">
.cursor {
  cursor: pointer;
}
.cursor:hover {
  color: #fe8c00;
}
</style>
