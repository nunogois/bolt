<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar, QInfiniteScroll, openURL } from 'quasar'
import { useRoute } from 'vue-router'
import { supabase } from 'boot/supabase'
import { useSession } from 'stores/session'
import { PostgrestError } from '@supabase/supabase-js'
import Bolt from 'components/Bolt.vue'

const $q = useQuasar()
const route = useRoute()
const session = useSession()

const newBolt = ref(false)
const newBoltMessage = ref('')
const user = ref<User>()
const bolts = ref<Bolt[]>([])
const infiniteScroll = ref<QInfiniteScroll>()
const refreshing = ref(false)

onMounted(async () => {
  await loadUser()
})

const loadUser = async () => {
  const { error, data } = await supabase
    .from('profiles')
    .select(
      `
      id,
      full_name,
      user_name,
      avatar_url
      `
    )
    .eq('user_name', route.params.id)
  handleError(error)
  user.value = data?.[0] as User
}

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
      full_name,
      user_name,
      avatar_url
    )`)
  handleError(error)
  bolts.value = [data?.[0] as Bolt, ...bolts.value]
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
    .eq('profiles.user_name', route.params.id)
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
    <transition
      appear
      enter-active-class="animated fadeInDown slow"
      leave-active-class="animated fadeOutRight slow"
    >
      <q-card
        v-if="user"
        class="q-mx-auto q-my-md"
        style="max-width: 600px"
        flat
        bordered
      >
        <q-card-section>
          <div class="row">
            <div>
              <q-avatar size="100px">
                <img :src="user.avatar_url" />
              </q-avatar>
            </div>
            <div class="q-pl-md user-card-info">
              <p class="q-mb-none text-h4">{{ user.full_name }}</p>
              <div class="row items-center justify-between">
                <p class="q-mb-none text-subtitle1 text-grey-6">
                  @{{ user.user_name }}
                </p>
                <q-btn
                  flat
                  round
                  icon="fab fa-github"
                  @click="openURL(`https://github.com/${user.user_name}`)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </transition>
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
    <q-page-sticky
      v-if="$route.params.id === session.user.user_name"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn fab icon="add" color="primary" @click="newBolt = true" />
    </q-page-sticky>
  </q-page>
</template>

<style lang="sass">
.bolts-list, .header
  max-width: 600px
  margin: auto
.user-card-info
  display: flex
  flex: 1
  flex-direction: column
  justify-content: space-around
</style>
