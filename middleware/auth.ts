export default defineNuxtRouteMiddleware((to) => {
  // Read token directly from cookie (works on both server and client)
  const token = useCookie('auth_token')
  const user = useCookie('auth_user')

  const isAuthenticated = !!token.value && !!user.value

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If authenticated and trying to access login page
  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
