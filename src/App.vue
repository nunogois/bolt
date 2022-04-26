<script setup lang="ts">
import { LocalStorage, useQuasar } from 'quasar'
import { useSession } from 'stores/session'
import FlagProvider from '@unleash/proxy-client-vue'
import { useI18n } from 'vue-i18n'
import { supabase } from 'boot/supabase'

const config = {
  url: process.env.UNLEASH_URL,
  clientKey: process.env.UNLEASH_KEY,
  refreshInterval: 2,
  appName: 'bolt',
  environment: 'dev'
}

const $q = useQuasar()
const session = useSession()
const { locale } = useI18n()

const loadSession = () => {
  $q.dark.set(session.preferences.dark)
  locale.value = session.preferences.lang.value
}

loadSession()
session.$subscribe(async (_, session) => {
  loadSession()
  LocalStorage.set('session', session)
  const { preferences, user } = session
  await supabase
    .from('profiles')
    .update({ ...session.user, preferences })
    .eq('id', user.id)
})
</script>

<template>
  <FlagProvider :config="config">
    <router-view />
  </FlagProvider>
</template>
