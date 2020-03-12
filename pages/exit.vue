<template></template>

<script>
export default {
  // 中间件在界面渲染之前调用
  middleware: async function(ctx) {
    const { status, data } = await ctx.$axios.get("/users/exit");
    if (status === 200 && data && data.code === 0) {
      window.location.href = "/";
    }
  }
};
</script>

<style>
</style>