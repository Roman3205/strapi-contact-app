<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

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

    toast.add({title: 'Logged in successfully', color: 'success'})
    return navigateTo('/')
  } catch (error) {
    toast.add({title: 'Unable to log in', color: 'error', description: 'Check your credentials you entered', duration: 6000})
  }
}

definePageMeta({
  layout: 'auth',
  middleware: 'already-logged'
})
</script>

<template>
  <UPageCard class="min-w-md">
    <div class="flex flex-col items-center gap-3">
      <UIcon
        name="i-lucide-lock"
        class="size-8"
      />
      <h2 class="text-xl font-semibold">
        Log in
      </h2>
      <p class="text-center text-gray-500">
        Dont have an account? <ULink to="/auth/sign-up" class="text-info font-medium">Create account</ULink>.
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
      >
        <UInput
          v-model="state.email"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Password"
        name="password"
      >
        <UInput
          v-model="state.password"
          class="w-full"
          type="password"
        />
      </UFormField>

      <UButton
        type="submit"
        color="info"
        block
      >
        Submit
      </UButton>
    </UForm>
  </UPageCard>
</template>
