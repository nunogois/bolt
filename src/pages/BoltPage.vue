<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar, QInfiniteScroll } from 'quasar'
import { useRoute } from 'vue-router'
import { supabase } from 'boot/supabase'
import { PostgrestError } from '@supabase/supabase-js'
import Bolt from 'components/Bolt.vue'

const $q = useQuasar()
const route = useRoute()

const bolt = ref<Bolt>()
const bolts = ref<Bolt[]>([])
const infiniteScroll = ref<QInfiniteScroll>()
const refreshing = ref(false)

onMounted(async () => {
  await loadBolt()
})

const loadBolt = async () => {
  const { error, data } = await supabase
    .from('bolts')
    .select(
      `
    id,
    message,
    created_at,
    profiles:user_id (
      id,
      full_name,
      user_name,
      avatar_url
    )`
    )
    .eq('id', route.params.id)
  handleError(error)
  bolt.value = data?.[0] as Bolt
}

const handleError = (error: PostgrestError | null) => {
  if (error) {
    $q.notify({
      type: 'negative',
      message: error.message
    })
  }
}

const deleteBolt = async (id: string) => {
  const { error } = await supabase.from('bolts').delete().match({ id })
  handleError(error)
  bolts.value = bolts.value.filter((bolt) => bolt.id !== id)
}

const refresh = async (done: () => void) => {
  refreshing.value = true
  infiniteScroll.value?.reset()
  infiniteScroll.value?.resume()
  infiniteScroll.value?.trigger()
  done()
}

const load = async (pageNumber: number, done: (stop: boolean) => void) => {
  const startRange = (pageNumber - 1) * 20
  const { error, data } = await supabase
    .from('bolts')
    .select(
      `
    id,
    message,
    created_at,
    profiles:user_id (
      id,
      full_name,
      user_name,
      avatar_url
    )`
    )
    .eq('reply_id', route.params.id)
    .order('created_at', { ascending: false })
    .range(startRange, startRange + 19)
  handleError(error)
  if (data?.length) {
    if (refreshing.value) {
      bolts.value = data as Bolt[]
      refreshing.value = false
    } else bolts.value = [...bolts.value, ...(data as Bolt[])]
  }
  done(!data?.length || data.length < 20)
}
</script>

<template>
  <q-page>
    <div class="bolts-list">
      <transition
        appear
        enter-active-class="animated fadeInDown slow"
        leave-active-class="animated fadeOutRight slow"
      >
        <q-card
          v-if="bolt"
          class="q-mx-auto q-my-md"
          style="max-width: 600px"
          flat
          bordered
        >
          <bolt :bolt="bolt" @delete="deleteBolt" />
        </q-card>
      </transition>
    </div>
    <h6 v-if="bolts.length" class="bolts-list text-center">- - -</h6>
    <q-pull-to-refresh @refresh="refresh" class="fit">
      <q-infinite-scroll
        @load="load"
        ref="infiniteScroll"
        class="row items-start content-start bolts-list fit"
      >
        <transition-group
          appear
          enter-active-class="animated fadeInUp slow"
          leave-active-class="animated fadeOutRight slow"
        >
          <bolt
            v-for="bolt in bolts"
            :key="bolt.id"
            :bolt="bolt"
            @delete="deleteBolt"
          />
        </transition-group>
      </q-infinite-scroll>
    </q-pull-to-refresh>
  </q-page>
</template>

<style lang="sass">
.bolts-list
  max-width: 600px
  margin: auto
</style>
