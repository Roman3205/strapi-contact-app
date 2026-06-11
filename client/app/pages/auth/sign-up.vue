<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { SignUpSchema as schema } from '~/schemas'
import type { output } from 'zod'

type Schema = output<typeof schema>

const state = reactive<Partial<Schema>>({
  username: undefined,
  email: undefined,
  password: undefined
})

useSeoMeta({
  title: 'Create account',
  description: 'Populate the form to create an account.'
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await useAuthStore().register({
      username: event.data.username,
      email: event.data.email,
      password: event.data.password
    })

    toast.add({ title: 'Account created', description: 'Check your email and confirm the registration', color: 'success', duration: 7000 })

    return navigateTo('/auth/login')
  } catch (error: any) {
    toast.add({ title: 'Failed account creation', color: 'error', description: error.error.message, duration: 6000 })
  }
}

definePageMeta({
  layout: 'auth',
  middleware: 'already-logged'

})

function checkPasswordStrength(str: string | undefined) {
  if (!str) str = ''

  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /\d/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' }
  ]

  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }))
}

const passwordShow = ref(false)
const passwordStrength = computed(() => checkPasswordStrength(state.password))
const strengthScore = computed(() => passwordStrength.value.filter(req => req.met).length)

const scoreColor = computed(() => {
  if (strengthScore.value === 0) return 'neutral'
  if (strengthScore.value <= 1) return 'error'
  if (strengthScore.value <= 2) return 'warning'
  if (strengthScore.value === 3) return 'warning'
  return 'success'
})

const strengthText = computed(() => {
  if (strengthScore.value === 0) return 'Enter a password'
  if (strengthScore.value <= 2) return 'Weak password'
  if (strengthScore.value === 3) return 'Medium password'
  return 'Strong password'
})
</script>

<template>
  <UPageCard class="min-w-sm lg:min-w-md">
    <div class="flex flex-col items-center gap-3">
      <UIcon
        name="i-lucide-lock"
        class="size-8"
      />
      <h2 class="text-xl font-semibold">
        Create account
      </h2>
      <p class="text-center text-gray-500">
        Already have an account? <ULink
          to="/auth/login"
          class="text-info font-medium"
        >Log in</ULink>.
      </p>
    </div>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Username"
        name="username"
        required
      >
        <UInput
          v-model="state.username"
          class="w-full"
          icon="i-lucide-user"
          placeholder="Enter your name"
        />
      </UFormField>
      <UFormField
        label="Email"
        name="email"
        required
      >
        <UInput
          v-model="state.email"
          class="w-full"
          type="email"
          placeholder="Enter your email"
          icon="i-lucide-at-sign"
        />
      </UFormField>

      <UFormField
        label="Password"
        name="password"
        required
      >
        <div class="space-y-2">
          <UInput
            v-model="state.password"
            placeholder="Enter your password"
            icon="i-lucide-lock"
            :color="scoreColor"
            :type="passwordShow ? 'text' : 'password'"
            :aria-invalid="strengthScore < 4"
            aria-describedby="password-strength"
            :ui="{ trailing: 'pe-1' }"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="passwordShow ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="passwordShow ? 'Hide password' : 'Show password'"
                :aria-pressed="passwordShow"
                aria-controls="password"
                @click="passwordShow = !passwordShow"
              />
            </template>
          </UInput>
          <UProgress
            :color="scoreColor"
            :indicator="strengthText"
            :model-value="strengthScore"
            :max="4"
            size="sm"
            class="mt-1"
          />

          <p
            id="password-strength"
            class="text-sm font-medium"
          >
            {{ strengthText }}. Must contain:
          </p>

          <ul
            class="space-y-1"
            aria-label="Password requirements"
          >
            <li
              v-for="(req, index) in passwordStrength"
              :key="index"
              class="flex items-center gap-0.5"
              :class="req.met ? 'text-success' : 'text-muted'"
            >
              <UIcon
                :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
                class="size-4 shrink-0"
              />

              <span class="text-xs font-light">
                {{ req.text }}
                <span class="sr-only">
                  {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </UFormField>

      <UButton
        type="submit"
        color="info"
        variant="subtle"
        block
      >
        Signup
      </UButton>
    </UForm>
  </UPageCard>
</template>

<style>
::-ms-reveal {
    display: none;
}
</style>
