<template>
  <div class="pb-2">
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
      :validate="validate"
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
          placeholder="Enter first name"
          icon="i-lucide-contact-round"
        />
      </UFormField>

      <UFormField
        label="Last name"
        name="lastName"
        required
      >
        <UInput
          v-model="state.lastName"
          placeholder="Enter last name"
          icon="i-lucide-signature"
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
          placeholder="Enter your email"
          icon="i-lucide-at-sign"
        />
      </UFormField>

      <UFormField
        label="Phone"
        name="phone"
        required
      >
        <UFieldGroup>
          <USelectMenu
            v-model="countryCode"
            :items="phoneCodes"
            value-key="code"
            :search-input="{
              placeholder: 'Search country...',
              icon: 'i-lucide-search'
            }"
            :filter-fields="['name', 'code', 'dialCode']"
            :content="{ align: 'start' }"
            :ui="{
              base: 'pe-8',
              content: 'w-48',
              placeholder: 'hidden',
              trailingIcon: 'size-4'
            }"
            trailing-icon="i-lucide-chevrons-up-down"
            @change="state.phone = ''"
          >
            <span class="size-5 flex items-center text-lg">
              {{ country?.emoji || '\u{1F1FA}\u{1F1F8}' }}
            </span>

            <template #item-leading="{ item }">
              <span class="size-5 flex items-center text-lg">
                {{ item.emoji }}
              </span>
            </template>

            <template #item-label="{ item }">
              {{ item.name }} ({{ item.dialCode }})
            </template>
          </USelectMenu>

          <UInput
            v-model="state.phone"
            v-maska="mask"
            :placeholder="mask.replaceAll('#', '_')"
            :style="{ '--dial-code-length': `${dialCode.length + 1.5}ch` }"
            :ui="{
              base: 'ps-(--dial-code-length)',
              leading: 'pointer-events-none text-base md:text-sm text-muted'
            }"
          >
            <template #leading>
              {{ dialCode }}
            </template>
          </UInput>
        </UFieldGroup>
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
import type { FormSubmitEvent, FormError } from '@nuxt/ui'
import { faker } from '@faker-js/faker'
import type { output } from 'zod'
import { ContactActionSchema as schema } from '~/schemas'
import { vMaska } from 'maska/vue'
import phoneCodes from '@/phone-codes.json'

const countryCode = ref('US')

const country = computed(() => phoneCodes.find(c => c.code === countryCode.value))
const dialCode = computed(() => country.value?.dialCode || '+1')
const mask = computed(() => country.value?.mask || '(###) ###-####')

definePageMeta({
  layout: 'admin',
  middleware: 'guest'
})

const title = 'Create Contact'
const description = 'Create a new contact'

useSeoMeta({ title, description })

type contactCreationSchema = output<typeof schema>
type Schema = Omit<contactCreationSchema, 'phone'> & {
  phone: string
}

const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phone: undefined,
  image: undefined
})

const toast = useToast()

type stateSchema = typeof state

function validate(state: Partial<stateSchema>): FormError[] {
  const result = schema.safeParse({ firstName: state.firstName, lastName: state.lastName, email: state.email, image: state.image, phone: {
    mask: mask.value,
    phoneNumber: state.phone
  }
  })
  if (result.success) return []

  return result.error.issues.map(issue => ({
    name: issue.path.join('.'),
    message: issue.message
  }))
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const res = await useContactStore().createRecord({
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      email: event.data.email,
      phone: event.data.phone,
      dialCode: dialCode.value,
      countryCode: countryCode.value
    })

    const formData = new FormData()
    formData.append('files', event.data.image)
    formData.append('refId', String(res.data.id))
    formData.append('ref', 'api::contact.contact')
    formData.append('field', 'image')

    await useContactStore().imageUpload(formData)
    clearNuxtData('contacts')

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
