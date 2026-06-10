<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
    username: z.string('Username is required').min(2).max(64),
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

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

    toast.add({title: 'Account created successfully', color: 'success'})
  } catch (error: any) {
    toast.add({title: 'Failed account creation', color: 'error', description: error.error.message, duration: 6000})
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
        Create account
      </h2>
      <p class="text-center text-gray-500">
        Already have an account? <ULink to="/auth/login" class="text-info font-medium">Log in</ULink>.
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
      >
        <UInput
          v-model="state.username"
          class="w-full"
        />
      </UFormField>
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
