<script setup lang="ts">
import Login from 'components/Login.vue'
import { useFlag } from '@unleash/proxy-client-vue'

const flagLogin = useFlag('bolt.login')
</script>

<template>
  <q-page class="column no-wrap flex-center">
    <div class="animated fadeInDown text-center">
      <h1 class="app-title q-ma-sm flex items-center text-h1 justify-center">
        <q-icon name="fas fa-bolt" class="q-mr-sm" /> Bolt
      </h1>
      <span class="text-h6">{{ $t('description') }}</span>
    </div>
    <div class="q-mt-xl text-center animated fadeInUp">
      <Login v-if="flagLogin" />
      <span v-else class="text-subtitle2">
        {{ $t('login.disabled') }}
      </span>
    </div>
  </q-page>
</template>
