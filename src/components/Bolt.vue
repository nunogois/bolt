<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { useSession } from 'stores/session'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFlag } from '@unleash/proxy-client-vue'

const $q = useQuasar()
const session = useSession()
const router = useRouter()
const { t } = useI18n()
const flagReply = useFlag('bolt.reply')
const flagRebolt = useFlag('bolt.rebolt')
const flagLike = useFlag('bolt.like')
const flagShare = useFlag('bolt.share')
const flagDelete = useFlag('bolt.delete')

const props = defineProps<{
  bolt: Bolt
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const share = (bolt: Bolt) => {
  copyToClipboard(`${window.location.origin}/b/${bolt.id}`)
  $q.notify(t('action.clipboard'))
}

const confirmDelete = ref(false)

const toggleLike = () => {
  console.log('TODO: implement')
}
</script>

<template>
  <q-item :key="props.bolt.id" class="bolt q-py-md full-width">
    <q-item-section
      avatar
      top
      class="cursor-pointer"
      @click="router.push(`/u/${props.bolt.profiles.user_name}`)"
    >
      <q-avatar size="xl">
        <img :src="props.bolt.profiles.avatar_url" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-subtitle1">
        <div class="flex justify-between">
          <strong
            class="cursor-pointer"
            @click="router.push(`/u/${props.bolt.profiles.user_name}`)"
            >{{ props.bolt.profiles.full_name }}</strong
          >
          <div class="text-grey-7 col-grow q-ml-xs">
            <span
              class="cursor-pointer"
              @click="router.push(`/u/${props.bolt.profiles.user_name}`)"
            >
              @{{ props.bolt.profiles.user_name }}</span
            >
          </div>
          <span
            class="text-grey-7 cursor-pointer"
            @click="router.push(`/b/${props.bolt.id}`)"
          >
            {{ props.bolt.created_at.split('T')[0] }}
          </span>
        </div>
      </q-item-label>
      <q-item-label
        class="bolt-content text-body1 q-pt-xs cursor-pointer"
        @click="router.push(`/b/${props.bolt.id}`)"
        >{{ props.bolt.message }}</q-item-label
      >
      <div class="bolt-icons row q-mt-sm">
        <q-btn
          v-if="flagReply"
          color="grey"
          icon="far fa-comment"
          size="sm"
          flat
          round
          ><q-tooltip class="bg-black">{{
            $t('action.reply')
          }}</q-tooltip></q-btn
        >
        <q-btn
          v-if="flagRebolt"
          color="grey"
          icon="fas fa-retweet"
          size="sm"
          flat
          round
        >
          <q-tooltip class="bg-black">{{ $t('action.rebolt') }}</q-tooltip>
        </q-btn>
        <q-btn
          v-if="flagLike"
          @click="
            () => {
              toggleLike(props.bolt)
            }
          "
          :color="props.bolt.liked ? 'pink' : 'grey'"
          :icon="props.bolt.liked ? 'fas fa-heart' : 'far fa-heart'"
          size="sm"
          flat
          round
        >
          <q-tooltip class="bg-black">{{ $t('action.like') }}</q-tooltip>
        </q-btn>
        <q-btn
          v-if="flagShare"
          @click="share(props.bolt)"
          color="grey"
          icon="fas fa-arrow-up-from-bracket"
          size="sm"
          flat
          round
        >
          <q-tooltip class="bg-black">{{ $t('action.share') }}</q-tooltip>
        </q-btn>
        <q-btn
          v-if="flagDelete && props.bolt.profiles.id === session.user.id"
          @click="confirmDelete = true"
          color="grey"
          icon="fas fa-trash"
          size="sm"
          flat
          round
        >
          <q-tooltip class="bg-black">{{ $t('action.delete') }}</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
    <q-dialog v-model="confirmDelete">
      <q-card class="q-pa-sm">
        <q-card-section>
          <div class="text-h6">{{ $t('deleteDialog.title') }}</div>
        </q-card-section>
        <q-card-section>
          {{ $t('deleteDialog.message') }}
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('action.cancel')" v-close-popup />
          <q-btn
            color="negative"
            :label="$t('action.delete')"
            v-close-popup
            @click="emit('delete', props.bolt.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-item>
</template>

<style scoped lang="sass">
.bolt:not(:first-child)
  border-top: 1px solid $separator-color
.body--dark
  .bolt:not(:first-child)
    border-top: 1px solid $separator-dark-color
.bolt-content
  white-space: pre-line
  text-align: justify
.bolt-icons
  margin-left: -5px
  gap: 10px
</style>
