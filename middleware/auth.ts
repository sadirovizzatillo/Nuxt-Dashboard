export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')
  const user = useCookie('auth_user')

  const isAuthenticated = !!token.value && !!user.value

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
