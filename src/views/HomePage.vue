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
          <div class="q-pt-lg col-6 col-xs-10">Get insights into your chats - Now with more interesting graphs, free statistics and full PDF export</div>
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
      <section class="text-center row justify-center">
        <h3 class="heading-3 pageTitle text-bold q-pt-xl">
          The
          <span>most eloborate</span>
          chat analyzer yet.
        </h3>
        <p class="col-4 col-xs-12 q-mt-lg">Visualise your whatsapp chat and gain insights in who the biggest yapper is, the biggest emoji abuser, who cusses the most and much more...</p>
      </section>

      <hr />

      <!-- <section>
        <div class="benefits row">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="benefit col-md-4 col-xs-12 q-gutter-md q-py-md"
          >
            <q-icon
              :name="benefit.icon"
              color="primary"
              size="42px"
            />
            <h4>{{ benefit.title }}</h4>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </section> -->

      <section ref="tutorial">
        <h3 class="heading-3 text-bold text-center">
          How do I export
          <!-- <br /> -->
          my chat?
        </h3>
        <ExportTutorial />
      </section>

      <hr />

      <section class="text-center">
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
        <ContactForm />
      </section>
    </div>

    <FooterComponent />
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
import ContactForm from '@/components/homepage/ContactForm.vue'

const router = useRouter()
const store = useStore()

const tutorial = ref()

// const benefits = [
//   {
//     icon: 'mdi-account-group',
//     title: "Who's the biggest yapper?",
//     description: 'Visualise your whatsapp chat and gain insights in who the biggest yapper is, the biggest emoji abuser, who cusses the most and much more... ',
//   },
//   {
//     icon: 'mdi-account-group',
//     title: 'Community',
//     description: 'Join a community of like-minded individuals who are passionate about the same things you are.',
//   },
//   {
//     icon: 'mdi-account-group',
//     title: 'Community',
//     description: 'Join a community of like-minded individuals who are passionate about the same things you are.',
//   },
// ]

const faqItems = [
  {
    question: 'How do I export my chat?',
    answer: 'You can export your chat by following the steps in the tutorial.',
  },
  {
    question: 'Can I export group chats?',
    answer: 'You can export group chats, keep in mind that with a lot of participants the data might be overwhelming. Group chats with over 10 participants are not recommended.',
  },
  {
    question: 'What happens with my chat data?',
    answer:
      'Your chat data is processed locally in your browser. This means that your chat data never leaves your device. Your chat will never be stored on our servers. The only thing that is logged are lines that are not able to be visualised. This is done to improve the service.',
  },
  {
    question: 'Is my chat shared with anyone else?',
    answer:
      'No, your chat is not shared with anyone else. Everything is processed locally in your browser. This means that your chat data never leaves your device. The only thing that is logged are lines that are not able to be visualised. This is done to improve the service.',
  },
  // {
  //   question: 'How do I export my chat?',
  //   answer: 'You can export your chat by following the steps in the tutorial.',
  // },
]

function scrollToTutorial() {
  tutorial.value?.scrollIntoView({ behavior: 'smooth' })
}

async function onUseDemoData() {
  // await store.setStoreData(reader.result as string)
  await store.getData()
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
  background: url('@/assets/hero-bg.jpg') no-repeat center center;
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
