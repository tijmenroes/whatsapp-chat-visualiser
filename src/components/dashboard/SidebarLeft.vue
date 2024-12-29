<template>
  <div class="q-pa-md SideBarLeft">
    <div>
      <div class="q-mb-xl row justify-center">
        <router-link to="/">
          <LogoComponent />
        </router-link>
      </div>
      <q-list>
        <div
          v-for="(item, idx) in navItems"
          :key="idx"
        >
          <q-item
            clickable
            v-ripple
            :to="{ name: item.route }"
          >
            <q-item-section avatar>
              <q-icon
                :name="item.icon"
                class="routeIcon"
              />
            </q-item-section>

            <q-item-section>
              {{ item.title }}
            </q-item-section>
          </q-item>
        </div>
      </q-list>

      <q-btn
        class="q-mt-xl"
        color="secondary"
        label="Upload another chat"
        to="/#upload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { routeNames } from '@/config/routeNames'
import { useStore } from '@/store'
import LogoComponent from '../LogoComponent.vue'

const store = useStore()
const navItems = [
  {
    icon: 'bar_chart',
    title: 'General',
    route: routeNames.dashboard_general,
  },
  {
    icon: 'date_range',
    title: 'Dates & times',
    route: routeNames.dashboard_dates,
  },
  {
    icon: 'mood',
    title: "Emoji's",
    route: routeNames.dashboard_emojis,
  },
  {
    icon: 'abc',
    title: 'Words',
    route: routeNames.dashboard_words,
  },
  {
    icon: 'photo',
    title: 'Attachments',
    route: routeNames.dashboard_media,
  },
]

if (store.pollsData.length) {
  navItems.push({
    icon: 'group',
    title: 'Events',
    route: routeNames.dashboard_group,
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.sass';

.routeIcon {
  padding: 2px;
  border: 2px solid transparent;
}

:deep(.LogoComponent) {
  img {
    max-width: 150px !important;
  }
}

:deep(.q-item) {
  border-radius: 8px;
  border-bottom: 3px solid transparent;
  &:hover {
    color: $primary;
    border-color: $bg-primary-10;
  }

  &.q-router-link--active {
    background-color: $bg-primary-10;
    border-color: $primary;

    .routeIcon {
      // border-color: $primary; // niet handig
      border-radius: 50%;
    }
  }
}
</style>
