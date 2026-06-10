import type { Strapi5RequestParams } from "@nuxtjs/strapi"
import type { Contact } from "~/types"

export const useContactStore = defineStore("contact", () => {
    const client = useStrapiClient()
    const records = ref<Contact[]>([])

    const getRecords = async (opts: Strapi5RequestParams = {}) => {
        const res = await client<FindMany<Contact>>('contacts', {
            method: 'GET',
            params: opts
        })
        records.value = res.data
        return res
    }

    return {getRecords, records}
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}