<template>
  <div class="grid md:grid-cols-[250px_minmax(0,1fr)] h-screen lg:grid-cols-[350px_minmax(0,1fr)]">
    <aside class="sticky top-0 z-20 hidden min-h-screen bg-background md:block px-0 border-r-2 border-gray-100 dark:border-gray-800">
      <h3 class="py-4 text-lg font-semibold px-7 mb-0.5 xl:mb-1">
        Welcome {{ user?.username }}
      </h3>
      <USeparator />
      <UNavigationMenu
        orientation="vertical"
        :items="items"
        class="mt-4 px-7"
        color="info"
      />
    </aside>
    <div class="min-w-full">
      <UHeader
        :ui="{
          left: 'md:flex-1 flex items-center gap-1.5',
          center: 'hidden md:flex',
          right: 'flex items-center justify-end md:flex-1 gap-1.5',
          toggle: 'md:hidden',
          content: 'md:hidden',
          overlay: 'md:hidden'
        }"
      >
        <template #left>
          <img
            src="data:image/svg+xml,%3csvg width='30' height='30' viewBox='0 0 800 800' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M39 282c0-118 0-176.9 36.6-213.5C112.2 32 171.1 32 288.9 32h221.2c117.8 0 176.7 0 213.3 36.6C760 105.2 760 164.1 760 281.9v221.2c0 117.8 0 176.7-36.6 213.3C686.8 753 627.9 753 510.1 753H288.9c-117.8 0-176.7 0-213.3-36.6C39 679.8 39 620.9 39 503.1V281.9Z' fill='%234945FF'/%3e %3cpath fill-rule='evenodd' clip-rule='evenodd' d='M536.4 250.7H293.7v123.8h123.8v123.7h123.8V255.5c0-2.6-2.2-4.8-4.9-4.8Z' fill='white'/%3e %3cpath fill='white' d='M412.7 374.5h4.8v4.8h-4.8z'/%3e %3cpath d='M293.8 374.5h119c2.6 0 4.8 2.1 4.8 4.8v119h-119a4.8 4.8 0 0 1-4.8-4.9v-119Z' fill='%239593FF'/%3e %3cpath d='M417.5 498.2h123.8L421.6 618a2.4 2.4 0 0 1-4-1.7v-118ZM293.8 374.5h-118a2.4 2.4 0 0 1-1.7-4.1l119.7-119.7v123.8Z' fill='%239593FF'/%3e%3c/svg%3e"
            alt="Logo"
            class="sc-bdDsCe bPsdTJ"
          >
          <h2 class="font-semibold text-xl">
            Contact App
          </h2>
        </template>
        <template #right>
          <UColorModeButton />
          <UButton
            variant="outline"
            color="neutral"
            icon="i-lucide-log-out"
            @click="logout()"
          />
        </template>
        <template #body>
          <UNavigationMenu
            :items="items"
            orientation="vertical"
            class="-mx-2.5"
            color="info"
          />
        </template>
      </UHeader>
      <UContainer class="p-4">
        <slot />
      </UContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const { user } = storeToRefs(useAuthStore())

const logout = async () => {
  await useAuthStore().logout()
  navigateTo('/auth/login')
}
const route = useRoute()

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: 'Contacts',
      description: 'List of all contacts',
      icon: 'i-lucide-users',
      to: '/admin/contacts',
      active: route.path === '/admin/contacts'
    },
    {
      label: 'Create',
      description: 'Create new contact',
      icon: 'i-lucide-user-plus',
      to: '/admin/contacts/create',
      active: route.path === '/admin/contacts/create'
    }
  ]])
</script>

<style>

</style>
