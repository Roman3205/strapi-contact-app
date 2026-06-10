export default defineNuxtRouteMiddleware(() => {
  const { user } = storeToRefs(useAuthStore())
  if (user.value) {
    return navigateTo('/admin/contacts')
  }
})
