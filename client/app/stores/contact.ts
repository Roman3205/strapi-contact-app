import type { Strapi5RequestParams } from '@nuxtjs/strapi'
import type { Contact } from '~/types'

export const useContactStore = defineStore('contact', () => {
  const client = useStrapiClient()
  const pagination = ref<{
    total: number
    pageCount: number
  }>({
    total: 0,
    pageCount: 0
  })

  const getRecords = async (opts: Strapi5RequestParams<Contact> = {}) => {
    const res = await client<FindMany<Contact>>('contacts', {
      method: 'GET',
      params: opts
    })
    // @ts-expect-error pageCount exists
    pagination.value.pageCount = res.meta.pagination.pageCount
    pagination.value.total = res.meta.pagination!.total
    return res.data
  }

  const createRecord = async (data: Partial<Contact>) => {
    const res = await client<FindOne<Contact>>('contacts', {
      body: { data },
      method: 'POST'
    })

    return res
  }

  const getContactById = async (id: string, opts: Strapi5RequestParams<Contact> = { populate: ['image'] }) => {
    const res = await client<FindOne<Contact>>(`contacts/${id}`, {
      params: opts,
      method: 'GET'
    })

    return res.data
  }

  const updateContactById = async (id: string, data: Partial<Contact>) => {
    const res = await client<FindOne<Contact>>(`contacts/${id}`, {
      body: { data },
      method: 'PUT'
    })

    return res
  }

  const imageUpload = async (formData: FormData) => {
    const res = await client('upload', {
      body: formData,
      method: 'POST'
    })

    return res
  }

  const imageDelete = async (imageId: number) => {
    const res = await client(`upload/files/${imageId}`, {
      method: 'DELETE'
    })

    return res
  }

  return { pagination, getRecords, createRecord, imageUpload, getContactById, updateContactById, imageDelete }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
