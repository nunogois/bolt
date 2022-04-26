import { boot } from 'quasar/wrappers'
import { createClient } from '@supabase/supabase-js'
import { useSession } from 'stores/session'

const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_KEY ?? ''
)

export default boot(({ router, redirect }) => {
  const store = useSession()
  const session = supabase.auth.session()
  store.user_session = session

  supabase.auth.onAuthStateChange(async (event, session) => {
    store.user_session = session
    if (event === 'SIGNED_IN' && session?.user) {
      const { user } = session
      const { id, email, user_metadata, updated_at } = user
      const { avatar_url, full_name, user_name } = user_metadata
      let result = await supabase.from('profiles').select().eq('id', id)
      const preferences = result.data?.[0].preferences ?? store.preferences
      if (!result.data?.length) {
        result = await supabase.from('profiles').insert([
          {
            id,
            email,
            avatar_url,
            full_name,
            updated_at,
            user_name,
            preferences
          }
        ])
      }
      const { error, data } = result
      if (!error && data.length) store.$patch({ user: data[0], preferences })
      redirect({ path: '/' })
      return
    }
    if (event === 'SIGNED_OUT') {
      redirect({ path: '/login' })
      return
    }
  })
  router.beforeEach(async (to, _, next) => {
    if (!supabase.auth.user() && to.path !== '/login') return next('/login')
    if (supabase.auth.user()) {
      if (!store.user?.welcomed && to.path !== '/welcome')
        return next('/welcome')
      if (
        to.path !== '/' &&
        (to.path === '/login' ||
          (store.user?.welcomed && to.path === '/welcome') ||
          to.matched[0].path === '/:catchAll(.*)*')
      )
        return next('/')
    }

    return next()
  })
})

export { supabase }
