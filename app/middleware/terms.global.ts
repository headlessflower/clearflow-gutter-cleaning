export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  if (process.server) return

  const publicRoutes = [
    '/gutter-cleaning-leads/login',
    '/gutter-cleaning-leads/signup',
    '/gutter-cleaning-leads/terms',
    '/gutter-cleaning-leads/privacy-policy',
    '/gutter-cleaning-leads/accept-terms'
  ]

  if (publicRoutes.includes(to.path)) return

  let userId = user.value?.id

  if (!userId) {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return
    userId = data.user.id
  }

  const { data } = await supabase
    .from('contractor_profiles')
    .select('accepted_terms')
    .eq('id', userId)
    .maybeSingle()

  if (data?.accepted_terms !== true) {
    return navigateTo('/gutter-cleaning-leads/accept-terms')
  }
})
