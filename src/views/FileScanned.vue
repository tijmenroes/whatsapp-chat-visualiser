<template>
  <div class="column justify-between pageContainer">
    <div>icon</div>

    <div class="column items-center q-gutter-md">
      <h2>All done!</h2>

      <q-btn
        color="primary"
        label="view highlights"
        icon="email"
        to="/highlights"
      />

      <div class="row items-center">
        <div class="border" />
        <div>OR</div>
        <div class="border" />
      </div>

      <q-btn
        label="View dashboard"
        outline
        icon="dashboard"
        :to="{ name: routeNames.dashboard_general }"
      />
    </div>

    <div>By uploading files, you agree to our Terms of Service and Privacy Policy.</div>
  </div>
</template>

<script setup lang="ts">
import { routeNames } from '../config/routeNames'
</script>

<style scoped lang="scss">
.pageContainer {
  min-height: 90vh;
}

.border {
  border: 1px solid #ccc;
  width: 60px;
  height: 1px;
  margin: 0 10px;
}
</style>
