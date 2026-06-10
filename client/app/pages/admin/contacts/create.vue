<template>
  <div>
    <div class="flex flex-col gap-2 mb-5">
      <h2 class="mb-2 text-3xl font-semibold tracking-tight">
        {{ title }}
      </h2>
      <p class="text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <USeparator />
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 mt-4 lg:w-1/2"
      @submit="onSubmit"
    >
      <UFormField
        label="First name"
        name="firstName"
        required
      >
        <UInput
          v-model="state.firstName"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Last name"
        name="lastName"
        required
      >
        <UInput
          v-model="state.lastName"
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
        label="Phone"
        name="phone"
        required
      >
        <UInput
          v-model="state.phone"
          type="tel"
          class="w-full"
        />
      </UFormField>

      <UFormField
        name="image"
        label="Image"
        required
      >
        <UFileUpload
          v-model="state.image"
          icon="i-lucide-image"
          label="Drop your image here"
          description="SVG, PNG, JPG or GIF (max. 2MB)"
          :multiple="false"
          :dropzone="true"
          :interactive="false"
          class="w-96 min-h-48"
        >
          <template #actions="{ open }">
            <UButton
              label="Select image"
              icon="i-lucide-upload"
              color="neutral"
              variant="outline"
              @click="open()"
            />
          </template>
        </UFileUpload>
      </UFormField>

      <UButton
        type="submit"
        color="info"
        block
        variant="subtle"
      >
        Create
      </UButton>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import { faker } from '@faker-js/faker'
import type { output } from 'zod'
import { ContactActionSchema as schema } from '~/schemas'

definePageMeta({
  layout: 'admin',
  middleware: 'guest'
})

const title = 'Create Contact'
const description = 'Create a new contact'

useSeoMeta({ title, description })

type Schema = output<typeof schema>

const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phone: undefined,
  image: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = await useContactStore().createRecord({
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      email: event.data.email,
      phone: event.data.phone
    })

    const formData = new FormData()
    formData.append('files', event.data.image)
    formData.append('refId', String(res.data.id))
    formData.append('ref', 'api::contact.contact')
    formData.append('field', 'image')

    await useContactStore().imageUpload(formData)

    refreshNuxtData('contacts')

    toast.add({ title: 'Contact created successfully', color: 'success' })
    return navigateTo('/admin/contacts')
  } catch (error) {
    toast.add({ title: 'Failed contact creation', color: 'error', duration: 6000 })
  }
}

onMounted(() => {
  if (import.meta.dev) {
    state.firstName = faker.person.firstName()
    state.lastName = faker.person.lastName()
    state.email = faker.internet.email()
    state.phone = faker.phone.number()
  }
})
</script>

<style>

</style>
