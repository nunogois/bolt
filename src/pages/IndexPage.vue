<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar, QInfiniteScroll } from 'quasar'
import { PostgrestError } from '@supabase/supabase-js'
import { useSession } from 'stores/session'
import Bolt from 'components/Bolt.vue'

const $q = useQuasar()
const session = useSession()

const newBolt = ref(false)
const newBoltMessage = ref('')
const bolts = ref<Bolt[]>([])
const infiniteScroll = ref<QInfiniteScroll>()
const refreshing = ref(false)

const handleError = (error: PostgrestError | null) => {
  if (error) {
    $q.notify({
      type: 'negative',
      message: error.message
    })
  }
}

const addBolt = async () => {
  const { error, data } = await supabase.from('bolts').insert([
    {
      message: newBoltMessage.value
    }
  ]).select(`
    id,
    message,
    created_at,
    profiles:user_id (
      id,
      full_name,
      user_name,
      avatar_url
    )`)
  handleError(error)
  if (!error) {
    newBoltMessage.value = ''
    bolts.value = [data?.[0] as Bolt, ...bolts.value]
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
    <q-pull-to-refresh @refresh="refresh" class="fit">
      <q-infinite-scroll
        @load="load"
        ref="infiniteScroll"
        class="row items-start content-start bolts-list fit"
      >
        <transition-group
          appear
          enter-active-class="animated fadeInDown slow"
          leave-active-class="animated fadeOutUp slow"
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
    <q-dialog v-model="newBolt">
      <q-card class="bolt-new">
        <q-card-section>
          <div class="text-h6">Create new bolt</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="newBoltMessage"
            class="bolt-new-message"
            placeholder="What's on your mind?"
            autogrow
            maxlength="280"
            autofocus
            counter
            @keyup.ctrl.enter="
              () => {
                newBolt = false
                addBolt()
              }
            "
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img :src="session.user.avatar_url" />
              </q-avatar>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Post" v-close-popup @click="addBolt" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="newBolt = true" />
    </q-page-sticky>
  </q-page>
</template>

<style lang="sass">
.bolts-list
  max-width: 600px
  margin: auto
.bolt-new
  width: 100%
  max-width: 500px
  textarea
    font-size: 19px
    line-height: 1.4 !important
</style>
