<template>
  <div class="column justify-between items-center pageContainer">
    <div></div>

    <q-card class="column items-center justify-center q-gutter-y-lg q-pb-xl q-ma-md">
      <LogoComponent class="q-mb-xl" />
      <h2 class="heading-3 q-pb-xl">All done!</h2>

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
    </q-card>

    <div class="text-center">By uploading files, you agree to our Terms of Service and Privacy Policy.</div>
  </div>
</template>

<script setup lang="ts">
import { routeNames } from '../config/routeNames'
import LogoComponent from '../components/LogoComponent.vue'
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

.q-card {
  // margin: 0 auto;
  width: -webkit-fill-available;
  max-width: 500px;
}
</style>
