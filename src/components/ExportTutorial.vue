<template>
  <div>
    <div class="">
      <div class="row justify-center q-gutter-md q-my-xl deviceSelectors">
        <q-card
          :class="{ active: iosSelected }"
          @click="iosSelected = true"
        >
          <q-card-section class="content">
            <img
              src="@/assets/apple-logo.svg"
              loading="lazy"
            />
            <span>For iOS</span>
          </q-card-section>
        </q-card>

        <q-card
          :class="{ active: !iosSelected }"
          @click="iosSelected = false"
        >
          <q-card-section class="content">
            <img
              src="@/assets/android-logo.svg"
              loading="lazy"
            />
            <span>For Android</span>
          </q-card-section>
        </q-card>
      </div>

      <div class="row">
        <div class="col-md-4 col-xs-12">
          <q-card
            v-for="step in steps"
            :key="step.number"
            @click="activeStep = step.number"
            class="step q-mb-md q-mr-lg"
            :class="{ active: step.number === activeStep }"
            flat
            depressed
          >
            <q-card-section class="column text-muted">
              <div
                class="number text-h3 text-bold q-mb-md"
                v-text="step.number"
              />
              <span
                class="description"
                v-text="step.description"
              ></span>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-8 col-xs-12 imageContainer">
          <img
            v-if="activeStep < 4"
            :src="getImgUrl(activeImage)"
            :alt="`Step ${activeStep} for ${iosSelected ? 'iOS' : 'Android'}`"
            loading="lazy"
          />

          <SelectFileComponent v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SelectFileComponent from '@/components/SelectFileComponent.vue'

const activeStep = ref(1)
const iosSelected = ref(true)
const steps = computed(() => (iosSelected.value ? iosSteps : androidSteps))
const activeImage = computed(() => {
  return steps.value.find((step) => step.number === activeStep.value)?.image
})

const iosSteps = [
  {
    number: 1,
    description: 'On iPhone open WhatsApp and the chat or group chat you would like to export > at the top tap on the name of the chat.',
    image: 'ios1.svg',
  },
  {
    number: 2,
    description: 'In chat info, scroll all the way to the bottom.',
    image: 'ios2.svg',
  },
  {
    number: 3,
    description: 'Choose without media',
    image: 'ios3.svg',
  },
  {
    number: 4,
    description: 'Finally you can select your exported .txt to be analyzed.',
    image: 'ios4.svg',
  },
]

const androidSteps = [
  {
    number: 1,
    description: 'On your phone open WhatsApp and the chat or group chat you would like to export, and press the three dots on the top right.',
    image: 'android1.svg',
  },
  {
    number: 2,
    description: 'Press More > Export chat > Without media.',
    image: 'android2.svg',
  },
  {
    number: 3,
    description: 'Choose without media',
    image: 'android3.svg',
  },
  {
    number: 4,
    description: 'Finally you can select your exported .txt to be analyzed.',
    image: 'android4.svg',
  },
]

function getImgUrl(img: string | undefined) {
  if (!img) return ''
  return new URL(`../assets/tutorial-steps/${img}`, import.meta.url).href
}

function checkIfAndroid() {
  return /Android/i.test(navigator.userAgent)
}

onMounted(() => {
  iosSelected.value = !checkIfAndroid()
})
</script>

<style lang="scss">
@import '@/styles/variables.sass';
.imageContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  background: $bg-primary-10;
  // padding: 32px 0;
  img {
    width: 400px;
  }
}

.deviceSelectors {
  .q-card {
    border-radius: 4px !important;
    border-color: transparent;
    background: $secondary; // cursor: pointer;
    .content {
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        margin-left: 8px;
      }
    }

    img {
      width: 24px;
      opacity: 0.7;
    }
    &.active {
      border-bottom-color: $primary;

      img {
        opacity: 1;
      }
    }
  }
}

.step {
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  border-bottom: 3px solid transparent;
}

.q-card {
  cursor: pointer;
  &.active {
    .number {
      color: $primary;
    }
    .description {
      color: $text-text-foreground;
    }
    background: $bg-primary-10;
    border-bottom-color: $primary;
  }
}

@media (max-width: 768px) {
  .imageContainer {
    img {
      width: 100%;
    }
  }
}
</style>
