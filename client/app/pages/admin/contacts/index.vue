<template>
  <div>
    <h2 class="mb-2 text-3xl font-semibold tracking-tight">{{ title }}</h2>
    <p class="text-muted-foreground">{{ description }}</p>
    <UTable :data="data" class="flex-1" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'guest',
    layout: 'admin'
})
const title = 'Contacts'
const description = 'Manage your contacts'

useSeoMeta({
    title, description
})

const data = ref([

  {
    id: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594
  },
  {
    id: '4599',
    date: '2024-03-11T10:10:00',
    status: 'failed',
    email: 'mia.white@example.com',
    amount: 276
  },
  {
    id: '4598',
    date: '2024-03-11T08:50:00',
    status: 'refunded',
    email: 'william.brown@example.com',
    amount: 315
  }
])
</script>

<style>

</style>