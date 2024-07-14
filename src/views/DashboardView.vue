<template>
  <div
    v-if="allMessages?.length"
    class="row"
  >
    <div class="col-md-3 col-lg-2 sidebarLeft">
      <SidebarLeft />
    </div>

    <div class="contentContainer col-md-9 col-lg-10 row col-xs-12">
      <div class="col-md-9 col-xs-12 q-col-gutter-md q-mt-xl">
        <router-view class="dashboardView" />
      </div>

      <!-- Sidebar right -->
      <div class="col-md-3 sidebarRight col-xs-12">
        <SidebarRight />
      </div>
    </div>
    <!-- <FooterComponent class="col-12" /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'

// import FooterComponent from '@/components/FooterComponent.vue'
import SidebarLeft from '../components/dashboard/SidebarLeft.vue'
import SidebarRight from '../components/dashboard/SidebarRight.vue'

const store = useStore()
const allMessages = computed(() => store.messagesPerAuthor)
</script>

<style scoped lang="scss">
.q-card {
  margin: 0 12px;
}

.settingsContent {
  min-width: 500px;
}

.sidebarLeft {
  border-right: 1px solid #e4e4e7;
}

.sidebarRight {
  border-left: 1px solid #e4e4e7;
}

.contentContainer {
  overflow-y: scroll;
  height: 100vh;
}

:deep(.dashboardView) {
  .q-card {
    margin: 12px;
  }
}

@media (max-width: $screen-sm) {
  .sidebarLeft {
    display: none;
  }
  .contentContainer {
    height: auto;
    flex-direction: column-reverse;
  }
}
</style>
