import { computed } from 'vue';
<script setup lang="ts">
import { computed } from 'vue'
import { useUnleashClient, UnleashClient } from '@unleash/proxy-client-vue'

const client = useUnleashClient() as UnleashClient

const toggles = computed(() =>
  client.getAllToggles().filter((toggle) => toggle.name.startsWith('bolt.'))
)
</script>

<template>
  <q-page class="column no-wrap flex-center">
    <q-markup-table flat bordered class="toggle-table">
      <thead>
        <tr class="bg-white text-black">
          <th colspan="5">
            <div class="col no-wrap items-center">
              <div class="q-mb-sm">{{ $t('status.title') }}</div>
              <a href="https://www.getunleash.io/" target="_blank">
                <q-img
                  height="50px"
                  fit="contain"
                  src="https://www.getunleash.io/logos/unleash_pos.svg"
                />
              </a>
            </div>
          </th>
        </tr>
        <tr class="bg-teal-10 text-white">
          <th class="text-left">{{ $t('status.feature') }}</th>
          <th class="text-center">{{ $t('status.variant') }}</th>
          <th class="text-right">{{ $t('status.toggle') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="toggle in toggles" :key="toggle.name">
          <td class="text-left">{{ toggle.name }}</td>
          <td class="text-center">
            {{ toggle.variant.enabled ? toggle.variant.name : '-' }}
          </td>
          <td class="text-right">
            <q-icon
              v-if="toggle.enabled"
              name="fas fa-check"
              size="sm"
              color="positive"
            />
            <q-icon v-else name="fas fa-times" size="sm" color="negative" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<style lang="sass">
.toggle-table
  max-width: 400px
  width: 100%
  margin: 0 auto
</style>
