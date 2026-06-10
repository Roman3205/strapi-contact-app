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
          type="password"
        />
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
