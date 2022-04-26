<script setup lang="ts">
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

type LoginProvider = 'github'

const $q = useQuasar()

const login = async (provider: LoginProvider) => {
  const { error } = await supabase.auth.signIn({
    provider
  })
  if (error) {
    $q.notify({
      type: 'negative',
      message: error.message
    })
  }
}
</script>

<template>
  <q-btn
    icon="fab fa-github"
    label="Sign In with GitHub"
    outline
    no-caps
    @click="login('github')"
  />
</template>
