<template>
  <div class="grid grid-cols-2 md:grid-cols-[250px_minmax(0,1fr)] h-screen lg:grid-cols-[350px_minmax(0,1fr)]">
    <aside class="sticky top-0 z-20 hidden h-screen bg-background md:block px-0 border-r-2 border-gray-100">
        <h3 class="py-4 text-lg font-semibold px-7 mb-0.5 xl:mb-1">Welcome {{ user?.username }}</h3>
        <USeparator />
        <UNavigationMenu orientation="vertical" :items="items" class="mt-4 px-7" />
    </aside>
    <div class="min-w-full">
        <UHeader>
            <template #left>
                <h2 class="font-semibold text-xl">Contact App</h2>
            </template>
            <template #right>
                <UColorModeButton />
                <UButton variant="outline" color="neutral" @click="logout()" icon="i-lucide-log-out" />
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

const {user} = storeToRefs(useAuthStore())

const logout = async () => {
    await useAuthStore().logout()
    navigateTo('/auth/login')
}

const items = ref<NavigationMenuItem[][]>([
  [
        {
          label: 'Contacts',
          description: 'Fully styled and customizable components for Nuxt.',
          icon: 'i-lucide-users',
          to: '/admin/contacts'
        },
  ]])
</script>

<style>

</style>