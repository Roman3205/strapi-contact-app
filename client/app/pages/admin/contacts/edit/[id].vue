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
    <UAvatar
      class="mt-4 h-28 w-28 object-cover"
      :src="contactImageUrl"
      :alt="`${state.firstName} avatar`"
    />
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4 mt-4 w-full lg:w-1/2"
      @submit="onSubmit"
    >
      <UFormField
        label="First name"
        name="firstName"
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
      >
        <UInput
          v-model="state.lastName"
          class="w-full"
          placeholder="Enter last name"
          icon="i-lucide-signature"
        />
      </UFormField>

      <UFormField
        label="Email"
        name="email"
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
        label="New Image"
      >
        <UFileUpload
          v-model="state.image"
          icon="i-lucide-image"
          label="Drop your image here"
          description="SVG, PNG, JPG or GIF (max. 2MB)"
          :multiple="false"
          :dropzone="true"
          :interactive="false"
          class="w-86 min-h-48"
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
        class="mt-2"
        variant="subtle"
      >
        Update
      </UButton>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import type { output } from 'zod'
import type { FormSubmitEvent, FormError } from '@nuxt/ui'
import { ContactActionSchema } from '~/schemas'
import type { Contact } from '~/types'
import { vMaska } from 'maska/vue'
import phoneCodes from '@/phone-codes.json'

const countryCode = ref('US')

const country = computed(() => phoneCodes.find(c => c.code === countryCode.value))
const dialCode = computed(() => country.value?.dialCode || '+1')
const mask = computed(() => country.value?.mask || '(###) ###-####')

onMounted(() => {
  watch(countryCode, () => {
    state.phone = ''
  })
})

definePageMeta({
  layout: 'admin',
  middleware: 'guest'
})

const title = 'Edit Contact'
const description = 'Edit choosen contact'

useSeoMeta({ title, description })

const schema = ContactActionSchema.partial()
type contactEditSchema = output<typeof schema>
type Schema = Omit<contactEditSchema, 'phone'> & {
  phone: string
}

const state = reactive<Partial<Schema>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phone: undefined,
  image: undefined
})

type stateSchema = typeof state

const contactImageUrl = useState<string | undefined>('contactImageUrl', () => '')
const contactImageId = useState<number | undefined>('contactImageId', () => undefined)

const toast = useToast()
const route = useRoute()
const config = useRuntimeConfig()
const contactId = route.params.id as string

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
    const res = await useContactStore().updateContactById(contactId, {
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      email: event.data.email,
      phone: event.data.phone,
      dialCode: dialCode.value,
      countryCode: countryCode.value
    })

    if (event.data.image) {
      if (contactImageId.value) {
        await useContactStore().imageDelete(contactImageId.value)
      }
      const formData = new FormData()
      formData.append('files', event.data.image)
      formData.append('refId', String(res.data.id))
      formData.append('ref', 'api::contact.contact')
      formData.append('field', 'image')

      await useContactStore().imageUpload(formData)
    }

    state.image = undefined
    await refresh()

    const fetchedNewContact = fetchedContact.value
    if (fetchedNewContact) {
      const normalizedContact = {
        ...fetchedNewContact,
        phone: `${fetchedNewContact.dialCode} ${fetchedNewContact.phone}`,
        image: { ...fetchedNewContact.image,
          url: getMediaUrl(fetchedNewContact.image.url, config.public.strapi.url) as string
        }
      }
      cachedContacts.value = (cachedContacts.value ?? []).map(contact => contact.documentId === normalizedContact.documentId ? normalizedContact : contact)
    }
    toast.add({ title: 'Contact updated successfully', color: 'success' })
    return
  } catch (error) {
    toast.add({ title: 'Failed contact update', color: 'error', duration: 6000 })
  }
}

const { data: cachedContacts } = useNuxtData<Contact[]>('contacts')
const cachedContact = computed(() => {
  return cachedContacts.value?.find(contact => contact.documentId === contactId)
})

const { data: fetchedContact, refresh } = await useAsyncData(
  `contact/${contactId}`,
  () => useContactStore().getContactById(contactId),
  {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key]
        ?? nuxtApp.static.data[key]
        ?? cachedContact.value
    }
  }
)

const initialContact = computed(() => fetchedContact.value || cachedContact.value)

const setInitialValues = async (initialContact: Contact) => {
  countryCode.value = initialContact.countryCode

  Object.assign(state, {
    firstName: initialContact.firstName,
    lastName: initialContact.lastName,
    email: initialContact.email,
    phone: initialContact.phone
  })

  contactImageUrl.value = getMediaUrl(initialContact.image?.url, config.public.strapi.url)
  contactImageId.value = initialContact.image?.id
}

watchEffect(async () => {
  if (initialContact.value) {
    setInitialValues(initialContact.value)
  }
})
</script>

<style>

</style>
