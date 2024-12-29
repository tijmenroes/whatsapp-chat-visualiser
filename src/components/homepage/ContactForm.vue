<template>
  <div class="contact-form">
    <form @submit.prevent="handleSubmit">
      <div>
        <q-input
          type="text"
          label="Name *"
          v-model="form.name"
          required
        />
      </div>
      <div>
        <q-input
          label="Email (optional)"
          type="email"
          v-model="form.email"
        />
      </div>
      <div>
        <q-input
          type="textarea"
          label="Message *"
          v-model="form.message"
          required
        />
      </div>
      <button
        type="submit"
        :disabled="!isCaptchaVerified"
      >
        Submit
      </button>

      <p
        v-text="hint"
        class="text-red q-mt-lg"
        v-if="hint"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useReCaptcha } from 'vue-recaptcha-v3'

const form = ref({
  name: '',
  email: '',
  message: '',
})
const hint = ref('')
const isCaptchaVerified = ref(true)
// @ts-expect-error - This is valid, not sure why TS is complaining
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

const recaptcha = async () => {
  if (!recaptchaLoaded) await recaptchaLoaded()
  await recaptchaLoaded()

  const token = await executeRecaptcha('login')
  return token
}

async function handleSubmit() {
  // Kind of useless because no server atm, but you get the idea
  const token = await recaptcha()
  if (!token) {
    alert('Please complete the reCAPTCHA')
    return
  }

  if (!form.value.name || !form.value.message) {
    hint.value = 'Please fill in the required fields'
    return
  }

  const payload = {
    from: {
      email: form.value.email || 'unknown',
    },
    to: {
      email: 'omgprivate@outlook.com',
    },
    subject: 'Contact Form Submission',
    text: form.value.message,
    name: form.value.name,
  }

  try {
    await fetch('https://api.mailersend.com/v1/emai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${import.meta.env.VITE_MAILERSEND_API_TOKEN}`,
        cors: 'no-cors',
      },
      body: JSON.stringify(payload),
    })
    alert('Message sent successfully!')
  } catch (error) {
    alert('Failed to send message.')
  }
}
</script>

<style scoped>
.contact-form {
  max-width: 600px;
  margin: 0 auto;
}
.contact-form div {
  margin-bottom: 1em;
}
</style>
