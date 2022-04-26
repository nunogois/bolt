import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { Session } from '@supabase/supabase-js'

interface ISession {
  preferences: {
    lang: Language
    dark: boolean | 'auto'
    beta: boolean
  }
  user: User
  user_session: Session | null
}

export const useSession = defineStore('session', {
  state: () =>
    (LocalStorage.getItem('session') ?? {
      preferences: {
        lang: { label: 'i18n.en-US', value: 'en-US' },
        dark: 'auto',
        beta: false
      }
    }) as ISession,
  actions: {
    clear() {
      LocalStorage.clear()
    }
  }
})
