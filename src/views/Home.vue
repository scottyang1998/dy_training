<template>
  <div class="home">
    <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">
        <router-link to="/website">首页</router-link>
      </el-menu-item>
      <el-menu-item index="1">
        <router-link to="/editor">图片编辑器</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="/personel">员工选择器</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/calculator">Win10计算器</router-link>
      </el-menu-item>
    </el-menu>
    <!-- <router-link to="/website">Website</router-link> |
    <router-link to="/editor">Editor</router-link> |
    <router-link to="/personel">Selector</router-link> |
    <router-link to="/calculator">Calculator</router-link> -->
  </div>
</template>

<script>

</script>