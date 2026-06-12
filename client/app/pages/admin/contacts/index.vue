<template>
  <div class="pb-3">
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
        <div class="py-3.5 flex items-center gap-2">
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
          <UButton
            label="Print"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-printer"
            @click="printTable"
          />
        </div>
        <div class="flex px-4 py-3.5">
          <UInput
            v-model="globalFilter"
            class="max-w-sm"
            placeholder="Filter..."
            icon="i-lucide-filter"
          />
        </div>
      </div>
      <UTable
        ref="table"
        v-model:column-visibility="columnVisibility"
        :data="contacts"
        :columns="columns"
        class="mt-4 border-1 print-area text-xl border-gray-200 dark:border-1 dark:border-gray-600 rounded-md"
        :ui="{
          separator: 'hidden',
          th: 'font-medium px-4 py-3.5 print:text-center border-r border-b last:border-r-0 border-default border-b-(--ui-border-accented) [&:nth-last-child(2)]:print:border-r-0 last:print:hidden',
          td: 'print:whitespace-normal  print:break-words print:p-2 print:text-xs print:border-r [&:nth-last-child(2)]:print:border-none print:border-default last:print:hidden'
        }"
      />
      <div class="flex mt-6 w-full justify-between">
        <div class="px-4 text-sm text-muted">
          Showing {{ contacts.length || 0 }} of
          {{ total || 0 }} entries.
        </div>
        <div class="flex flex-col-reverse gap-6">
          <UPagination
            v-model:page="pageIndex"
            :items-per-page="pageSize"
            :total="total"
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
const { pageIndex, pageSize, total, globalFilter } = storeToRefs(contactStore)

const printTable = () => {
  window.print()
}

const { data: contacts } = await useAsyncData('contacts', () => contactStore.getRecords({ 'sort': ['createdAt:desc'], 'pagination[page]': pageIndex.value,
  'pagination[pageSize]': pageSize.value, 'filters[$or][0][firstName][$containsi]': globalFilter.value, 'filters[$or][1][lastName][$containsi]': globalFilter.value, 'filters[$or][2][email][$containsi]': globalFilter.value, 'populate': ['image'] }), {
  transform: (data: Contact[]) => {
    return (data.map(contact => ({
      ...contact,
      phone: `${contact.dialCode} ${contact.phone}`,
      image: {
        ...contact.image,
        url: contact.image?.url ? getMediaUrl(contact.image.url, config.public.strapi.url) : ''
      }
    })) || [])
  },
  getCachedData(key, nuxtApp) {
    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  },
  watch: [pageIndex, pageSize, globalFilter]
})

const table = useTemplateRef('table')

const columnVisibility = ref({
  id: false
})

const pageSizeOptions = [1, 2, 5, 10, 25, 50, 100]

function setPageSize(size: number) {
  pageIndex.value = 1
  pageSize.value = size
}

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
