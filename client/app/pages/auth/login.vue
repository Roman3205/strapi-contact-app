<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { LoginSchema as schema } from '~/schemas'
import type { output } from 'zod'

type Schema = output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const showPassword = ref(false)

useSeoMeta({
  title: 'Log in',
  description: 'Enter your credentials to log into account.'
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await useAuthStore().login({
      identifier: event.data.email,
      password: event.data.password
    })

    toast.add({ title: 'Logged in successfully', color: 'success' })
    return navigateTo('/')
  } catch (error) {
    toast.add({ title: 'Unable to log in', color: 'error', description: 'Check your credentials you entered', duration: 6000 })
  }
}

definePageMeta({
  layout: 'auth',
  middleware: 'already-logged'
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
        Log in
      </h2>
      <p class="text-center text-gray-500">
        Dont have an account? <ULink
          to="/auth/sign-up"
          class="text-info font-medium"
        >Create account</ULink>.
      </p>
    </div>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
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
        <UInput
          v-model="state.password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          :ui="{ trailing: 'pe-1' }"
          icon="i-lucide-lock"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UButton
        type="submit"
        color="info"
        variant="subtle"
        block
      >
        Login
      </UButton>
    </UForm>
  </UPageCard>
</template>

<style>
::-ms-reveal {
    display: none;
}
</style>
