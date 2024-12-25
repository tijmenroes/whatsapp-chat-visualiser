<template>
  <div v-if="allMessages?.length">
    <q-layout class="row">
      <div class="mobileToolbar">
        <q-toolbar
          flat
          class="elevation-0"
        >
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="menu"
            @click="drawer = !drawer"
          />
          <q-toolbar-title>
            <!-- <LogoComponent /> -->
          </q-toolbar-title>
        </q-toolbar>
      </div>

      <q-drawer
        v-model="drawer"
        :width="300"
        :breakpoint="700"
        elevated
      >
        <SidebarLeft />
      </q-drawer>

      <div class="col-md-3 col-lg-2 sidebarLeft">
        <SidebarLeft />
      </div>

      <div class="contentContainer row col-md-9 col-lg-10 col-xs-12">
        <div class="dashboardContainer col-md-9 col-lg-9 col-xs-12">
          <router-view class="dashboardView" />
        </div>

        <!-- Sidebar right -->
        <div class="col-md-3 sidebarRight col-xs-12">
          <SidebarRight />
        </div>
      </div>
    </q-layout>

    <!-- <FooterComponent class="col-12" /> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '../store'
import SidebarLeft from '../components/dashboard/SidebarLeft.vue'
import SidebarRight from '../components/dashboard/SidebarRight.vue'

const store = useStore()
const allMessages = computed(() => store.messagesPerAuthor)
const drawer = ref(false)
</script>

<style scoped lang="scss">
.sidebarLeft {
  border-right: 1px solid #e4e4e7;
}

.sidebarRight {
  padding: 32px;
}

.dashboardContainer {
  overflow-y: scroll;
  max-height: 100vh;
  padding-top: 32px;
}

.mobileToolbar,
.q-drawer {
  display: none;
}

:deep(.dashboardView) {
  .q-card {
    margin: 12px;
  }
}

@media (max-width: $screen-md) {
  .mobileToolbar {
    position: fixed;
    width: 100%;
    border-bottom: 1px solid #e4e4e7;
    z-index: 100;
    background: white;
    height: 60px;
  }

  .mobileToolbar,
  .q-drawer {
    display: initial;
  }

  .sidebarLeft {
    display: none;
  }
  .contentContainer {
    height: auto;
    flex-direction: column-reverse;
    padding-top: 80px;
    padding-left: 0;
    padding-right: 0;
    max-width: 100vw;
  }

  .dashboardContainer {
    overflow-y: hidden;
    max-height: unset;
    padding-top: 0;
  }

  .sidebarRight,
  .dashboardView {
    padding: 12px;
  }

  :deep(.dashboardView) {
    .q-card {
      margin: 12px 0;
    }
  }
}
</style>
