<template>
  <div>
    <div class="flex justify-between w-full items-start">
      <div class="flex flex-col gap-2 mb-5">
        <h2 class="mb-2 text-3xl font-semibold tracking-tight">
          {{ title }}
        </h2>
        <p class="text-muted-foreground">
          {{ description }}
        </p>
      </div>
      <NuxtLink to="/admin/contacts/create">
        <UButton
          color="info"
          variant="subtle"
          size="lg"
        >Create contact</UButton>
      </NuxtLink>
    </div>
    <USeparator />
    <div class="flex flex-col flex-1 w-full">
      <div class="flex justify-between items-center w-full mt-4">
        <div class="py-3.5">
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e: Event) {
                    e.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Columns"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>
        </div>
        <div class="flex px-4 py-3.5">
          <UInput
            v-model="globalFilter"
            class="max-w-sm"
            placeholder="Filter..."
          />
        </div>
      </div>
      <UTable
        ref="table"
        v-model:global-filter="globalFilter"
        v-model:column-visibility="columnVisibility"
        :data="contacts"
        :columns="columns"
        class="mt-4 border-1 border-gray-200 dark:border-1 dark:border-gray-600 rounded-md"
        :ui="{
          th: 'px-4 py-3.5 text-sm text-highlighted text-left font-semibold border-r border-default last:border-r-0'
        }"
      />
      <div class="flex mt-6 w-full justify-between">
        <div class="px-4 text-sm text-muted">
          Showing {{ table?.tableApi?.getRowModel().rows.length || 0 }} of
          {{ pagination.total || 0 }} entries.
        </div>
        <div class="flex flex-col-reverse gap-6">
          <UPagination
            v-model:page="currentPage"
            :items-per-page="pageSize"
            :total="pagination.total"
            class="self-end"
            active-variant="solid"
            active-color="info"
            color="neutral"
          />
          <div class="flex gap-3 items-center justify-center">
            <USelect
              :model-value="pageSize"
              :items="pageSizeOptions"
              class="w-fit"
              @update:model-value="setPageSize"
            />
            <span>entries per page</span>
            {{ error }}
            {{ currentPage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Contact } from '~/types'
import { h, resolveComponent } from 'vue'
import type { Row } from '@tanstack/vue-table'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const config = useRuntimeConfig()
const contactStore = useContactStore()
const { pagination } = storeToRefs(contactStore)
const currentPage = ref(1)
const pageSize = ref(5)

const { data: contacts, error } = await useAsyncData('contacts', () => contactStore.getRecords({ 'sort': ['createdAt:desc'], 'pagination[page]': currentPage.value,

  'pagination[pageSize]': pageSize.value, 'populate': ['image'] }), {
  transform: (data: Contact[]) => {
    return (data.map(contact => ({
      ...contact,
      image: {
        ...contact.image,
        url: contact.image?.url ? getMediaUrl(contact.image.url, config.public.strapi.url) : null
      }
    })) || [])
  },
  getCachedData(key, nuxtApp) {
    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  },
  watch: [pageSize, currentPage]
})

const table = useTemplateRef('table')

const columnVisibility = ref({
  id: false
})

const pageSizeOptions = [1, 2, 5, 10, 25, 50, 100]

function setPageSize(size: number) {
  currentPage.value = 1
  pageSize.value = size
}

const globalFilter = ref('')

definePageMeta({
  middleware: 'guest',
  layout: 'admin'
})
const title = 'Contacts'
const description = 'Manage your contacts'

useSeoMeta({
  title, description
})
const columns: TableColumn<Contact>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      return h(UAvatar, { src: row.original.image?.url, alt: `${row.original.firstName} image`, loading: 'lazy', size: 'lg' })
    }
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'First name',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Last name',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Phone',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Created At',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    header: 'Actions',
    meta: {
      class: {
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          'content': {
            align: 'center',
            side: 'right'
          },
          'items': getRowItems(row),
          'aria-label': 'Actions dropdown'
        },
        () =>
          h(UButton, {
            'icon': 'i-lucide-ellipsis-vertical',
            'color': 'neutral',
            'variant': 'ghost',
            'aria-label': 'Actions dropdown'
          })
      )
    }
  }
]

function getRowItems(row: Row<Contact>) {
  return [
    {
      label: 'Edit',
      icon: 'i-lucide-edit',
      onSelect() {
        return navigateTo(`/admin/contacts/edit/${row.original.documentId}`)
      }
    }
  ]
}
</script>

<style>

</style>
