import type { Strapi5RequestParams } from '@nuxtjs/strapi'
import type { Contact } from '~/types'

export const useContactStore = defineStore('contact', () => {
  const client = useStrapiClient()
  const total = ref<number>(0)
  const pageIndex = ref<number>(0)
  const pageSize = ref<number>(5)

  const getRecords = async (opts: Strapi5RequestParams<Contact> = {}) => {
    const res = await client<FindMany<Contact>>('contacts', {
      method: 'GET',
      params: opts
    })

    total.value = res.meta.pagination!.total
    // @ts-expect-error page exists
    pageIndex.value = res.meta.pagination.page
    // @ts-expect-error pageSize exists
    pageSize.value = res.meta.pagination.pageSize
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

  return { pageSize, pageIndex, total, getRecords, createRecord, imageUpload, getContactById, updateContactById, imageDelete }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
