<template>
  <div>
    <div class="hero flex justify-center items-center">
      <div class="heroContent column q-gutter-y-xl q-py-lg">
        <LogoComponent />

        <div class="text-center row justify-center">
          <h1 class="heading-3 text-bold col-12 q-ma-xs title">
            Analyze your
            <br />
            Whatsapp chat
            <span class="text-primary">instantly.</span>
          </h1>
          <div class="q-pt-lg col-6 col-xs-10">
            Get free insights into your own chats, without sending the chat to a server.
            <br />
            See who the biggest yapper is, the biggest emoji abuser, who cusses the most and much more...
          </div>
        </div>

        <div>
          <q-btn
            @click="scrollToTutorial"
            class="q-mb-lg"
            color="primary"
            label="Get started"
          />
        </div>
      </div>
    </div>

    <div class="contentContainer column">
      <section class="row">
        <h2 class="heading-3 text-center full-width pageTitle text-bold q-pt-xl">
          The
          <span>most elaborate</span>
          chat analyzer yet.
        </h2>

        <p class="text-center q-mt-lg full-width">Get a wrapped-like summary of your chat by viewing the highlights, or use the dashboard to get a more detailed view of your chat.</p>
        <div class="offset-md-2">
          <ul>
            <li>Messages sent per day, hour and day of the week</li>
            <li>Word frequency analysis</li>
            <li>Which emoji's sent per person</li>
            <li>Message length</li>
            <li>Message streak, consecutive days of messages</li>
            <li>Attachments sent</li>
            <li>Attachments type sent image, video, audio and stickers (IOS Only)</li>
            <li>Heatmap of messages sent per time</li>
            <li>Events - New members, Group name changes, Group description changes, Group picture</li>
            <li>Polls (Group chat only)</li>
            <li>Configure data - Change names, hide people and change time period</li>
          </ul>
        </div>
      </section>

      <hr />

      <section ref="tutorial">
        <h3 class="heading-3 text-bold text-center">
          How do I export
          <!-- <br /> -->
          my chat?
        </h3>
        <ExportTutorial />
      </section>

      <hr />

      <section
        class="text-center"
        id="upload"
      >
        <h3 class="heading-3 text-bold q-pb-lg">Upload your chat log</h3>

        <SelectFileComponent />
      </section>
      <hr />

      <section class="text-center">
        <h2 class="text-bold q-pb-lg">Demo</h2>
        <p>Want to have a look first? Try with demo data.</p>

        <q-btn
          @click="onUseDemoData"
          color="primary"
          class="q-mt-lg"
          label="Use demo data"
        />
      </section>

      <hr />

      <section>
        <h2 class="text-bold text-center">FAQ</h2>
        <div class="expansionContainer column">
          <q-expansion-item
            v-for="(faqItem, idx) in faqItems"
            :key="idx"
            :label="faqItem.question"
            :duration="0"
          >
            {{ faqItem.answer }}
          </q-expansion-item>
        </div>
      </section>

      <section>
        <h2 class="text-bold text-center">Contact</h2>
        <p class="q-mt-lg">Have a question or suggestion or encounted any bugs? Feel free to contact us.</p>
        <!-- <ContactForm /> -->
        <q-btn
          color="secondary"
          @click="openMailWindow"
        >
          Send e-mail
        </q-btn>
      </section>
    </div>

    <FooterComponent />

    <LoadingInfo />
  </div>
</template>

<script setup lang="ts">
import FooterComponent from '@/components/FooterComponent.vue'
import ExportTutorial from '@/components/ExportTutorial.vue'
import LogoComponent from '@/components/LogoComponent.vue'
import { ref } from 'vue'
import { routeNames } from '@/config/routeNames'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import SelectFileComponent from '@/components/SelectFileComponent.vue'
import LoadingInfo from '@/components/homepage/LoadingInfo.vue'
import { event } from 'vue-gtag'
// import ContactForm from '@/components/homepage/ContactForm.vue'

const router = useRouter()
const store = useStore()

const tutorial = ref()

function openMailWindow() {
  window.open('mailto:omgprivate@outlook.com?subject=Whatswrapped feedback')
}

const faqItems = [
  {
    question: 'How do I export my chat?',
    answer: 'You can export your chat by following the steps in the tutorial.',
  },
  {
    question: 'Can I export group chats?',
    answer: 'You can export group chats, keep in mind that with a lot of participants the data might be overwhelming. Group chats with over 20 participants are not recommended.',
  },
  {
    question: 'What happens with my chat data?',
    answer:
      'Your chat data is processed locally in your browser. This means that your chat data never leaves your device. Your chat will never be stored on our servers. Whenever a bug occurs, the first line of the chat will be logged, this is usually a built-in whatsapp message like "Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more.". This is done to improve the service.',
  },
  {
    question: 'Is my chat shared with anyone else?',
    answer: 'No, your chat is not shared with anyone else. We have no use for your chat and will not store it anywhere.',
  },
]

function scrollToTutorial() {
  tutorial.value?.scrollIntoView({ behavior: 'smooth' })
}

async function onUseDemoData() {
  await store.getData()
  event('demo_data_used')
  router.push({ name: routeNames.dashboard_general })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.sass';
// TODO: Kijken wat de scope nu heeft gedaan?

hr {
  width: 100%;
}

.contentContainer {
  padding: 32px;
}

section {
  margin: auto;
  padding: 64px 0;
  max-width: 1200px;
}

.hero {
  height: 100vh;
  background: url('@/assets/hero-bg.webp') no-repeat center center;
  background-size: cover;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background: rgba(0, 0, 0, 0.5);
    // background: rgb(36, 66, 42);
    background: linear-gradient(0deg, rgba(36, 66, 42, 0.9) 0%, rgba(9, 9, 0, 0.9) 100%);
  }

  .heroContent {
    z-index: 2;
    color: white;
    text-align: center;
    text-align: center;
    background: #0000004d;
    max-width: 1300px;
    margin: 48px;

    display: inline-flex;
    padding: var(--spacing-6, 24px) var(--spacing-12, 48px);
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: var(--radius-rounded-xl, 16px);
    background: var(--Border-brd-panel, rgba(0, 0, 0, 0.3));

    backdrop-filter: blur(7.5px);
  }
}
.pageTitle {
  span {
    color: $primary;
  }
}

.SelectFileComponent {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e4e4e7;
}

.expansionContainer {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .title {
    // font-size: 1.8rem !important;
  }
  .contentContainer {
    padding: 12px;
  }
  .hero .heroContent {
    max-width: 100%;
    padding: 12px;
    margin: 12px;
  }
}

// .q-expansion-item {
//   margin-bottom: 16px;
//   max-width: 800px;
// }
</style>
