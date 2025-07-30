<template>
  <div class="not-found-container">
    <el-result
      icon="warning"
      title="404"
      sub-title="Sorry, the page you visited does not exist"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">Back to Home</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
// No additional script needed
</script>

<style lang="scss" scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
</style>
