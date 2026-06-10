import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const { login, register, logout } = useStrapiAuth()
  const user = useStrapiUser<User>()
  return {
    user,
    login,
    register,
    logout
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
