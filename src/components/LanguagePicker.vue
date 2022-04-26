<script setup lang="ts">
import { useModel } from 'src/hooks/useModel'

const props = defineProps<{
  modelValue: Language
}>()

const emit = defineEmits<{
  (e: string, value: unknown): void
}>()

const value = useModel(props, emit)

const langs = [
  { label: 'i18n.en-US', value: 'en-US' },
  { label: 'i18n.pt', value: 'pt' }
]
</script>

<template>
  <q-select v-model="value" :options="langs" dense borderless>
    <template v-slot:selected>
      <q-item dense class="q-pa-none">
        <q-item-section avatar class="q-pa-none" style="min-width: 40px">
          <img :src="'/flags/' + value.value + '.svg'" height="20" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t(value.label) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <img :src="'/flags/' + scope.opt.value + '.svg'" height="20" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t(scope.opt.label) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
