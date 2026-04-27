export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const publicRoutes = [
    '/gutter-cleaning-leads/login',
    '/gutter-cleaning-leads/signup',
    '/gutter-cleaning-leads/terms',
    '/gutter-cleaning-leads/privacy',
    '/gutter-cleaning-leads/accept-terms'
  ]

  if (publicRoutes.includes(to.path)) return
  if (!user.value) return

  const { data } = await supabase
    .from('contractor_profiles')
    .select('accepted_terms')
    .eq('id', user.value.id)
    .single()

  if (data && data.accepted_terms !== true) {
    return navigateTo('/gutter-cleaning-leads/accept-terms')
  }
})
