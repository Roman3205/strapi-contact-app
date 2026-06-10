export default defineNuxtRouteMiddleware((to, _from) => {
  const {user} = storeToRefs(useAuthStore())
  if (user.value) {
    return navigateTo('/admin/contacts')
  }
})
