<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { openURL, useQuasar } from 'quasar'
import { useSession } from 'stores/session'
import { useRouter } from 'vue-router'
import lottie from 'components/Lottie.vue'
import LanguagePicker from 'components/LanguagePicker.vue'

const $q = useQuasar()
const session = useSession()
const router = useRouter()

const slide = ref('welcome')
const pwa_install = ref<PWAInstallPrompt>()

onMounted(() => {
  if (window) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      pwa_install.value = e as PWAInstallPrompt
    })
  }
})

const native_os = computed(() => {
  if ($q.platform.is.android && !$q.platform.is.capacitor)
    return {
      name: 'Android',
      ext: 'APK',
      icon: 'fab fa-android',
      color: 'light-green-6'
    }
  else if ($q.platform.is.win && !$q.platform.is.electron)
    return {
      name: 'Windows',
      ext: 'EXE',
      icon: 'fab fa-windows',
      color: 'light-blue-7'
    }
  else if (pwa_install.value) {
    return {
      name: 'Progressive Web App',
      ext: 'PWA',
      icon: 'fas fa-rocket',
      color: 'orange-7'
    }
  }
  return { name: '', ext: '', icon: '', color: '' }
})

const download = (ext: string) => {
  if (ext === 'APK')
    openURL('https://github.com/nunogois/bolt/releases/download/v1.0/Bolt.apk')
  else if (ext === 'EXE')
    openURL('https://github.com/nunogois/bolt/releases/download/v1.0/Bolt.exe')
  else if (ext === 'PWA' && pwa_install.value) {
    pwa_install.value?.prompt()
    pwa_install.value?.userChoice.then(() => {
      slide.value = 'theme'
      pwa_install.value = undefined
    })
  }
}

const done = () => {
  session.user = { ...session.user, welcomed: true }
  router.replace('/')
}
</script>

<template>
  <q-page>
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      :control-color="$q.dark.isActive ? 'white' : 'black'"
      navigation
      padding
      arrows
      class="absolute fit"
      navigation-icon="fas fa-circle"
      style="background: transparent"
    >
      <q-carousel-slide name="welcome" class="column no-wrap flex-center">
        <div class="animated fadeInDown text-center column items-center">
          <q-avatar size="100px">
            <img :src="session.user.avatar_url" />
          </q-avatar>
          <span class="text-h4 q-mt-sm">{{ session.user.full_name }}</span>
          <span class="text-subtitle1 text-grey-7"
            >@{{ session.user.user_name }}</span
          >
          <p class="line-break q-mt-sm">
            {{
              `${$t('hello')} ${session.user.full_name.split(' ')[0]}, ${$t(
                'welcome.welcome.message'
              )}`
            }}
          </p>
        </div>
        <div class="q-mt-lg text-center animated fadeInUp">
          <q-btn
            :label="$t('welcome.welcome.start')"
            no-caps
            outline
            @click="slide = 'lang'"
          >
            <q-icon name="fas fa-chevron-right" class="q-ml-sm" size="15px" />
          </q-btn>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="lang" class="column no-wrap flex-center">
        <lottie src="lottie/onboarding.json" :height="300" :loop="false" />
        <h5 class="q-mb-md q-mt-none text-center">
          {{ $t('welcome.language') }}
        </h5>

        <language-picker v-model="session.preferences.lang" />

        <div class="q-mt-lg text-center">
          <q-btn
            :label="$t('welcome.next')"
            no-caps
            outline
            @click="slide = 'theme'"
          >
            <q-icon name="fas fa-chevron-right" class="q-ml-sm" size="15px" />
          </q-btn>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="theme" class="column no-wrap flex-center">
        <lottie src="lottie/daynight.json" :height="300" />
        <h5 class="q-mb-md q-mt-none text-center">
          {{ $t('welcome.theme') }}
        </h5>
        <div class="q-mt-md text-center">
          <div class="row items-center">
            <div class="col-auto text-right">
              <q-icon
                name="fas fa-sun"
                color="yellow-8"
                size="xl"
                class="cursor-pointer"
                @click="session.preferences.dark = false"
              />
            </div>
            <div class="col-auto">
              <q-toggle
                v-model="session.preferences.dark"
                size="lg"
                class="q-mx-md"
              />
            </div>
            <div class="col-auto text-left">
              <q-icon
                name="fas fa-moon"
                size="xl"
                class="cursor-pointer"
                @click="session.preferences.dark = true"
              />
            </div>
          </div>
        </div>
        <div class="q-mt-lg text-center">
          <q-btn
            :label="$t('welcome.next')"
            no-caps
            outline
            @click="slide = 'beta'"
          >
            <q-icon name="fas fa-chevron-right" class="q-ml-sm" size="15px" />
          </q-btn>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="beta" class="column no-wrap flex-center">
        <lottie src="lottie/users.json" :height="300" />
        <h5 class="q-mb-md q-mt-none text-center">
          {{ $t('welcome.beta.title') }}
        </h5>
        <div class="q-mt-md text-center">
          <p class="line-break">{{ $t('welcome.beta.description') }}</p>
          <q-checkbox
            v-model="session.preferences.beta"
            :label="$t('welcome.beta.label')"
            size="lg"
            dense
            class="q-mx-md"
          />
        </div>
        <div class="q-mt-lg text-center">
          <q-btn
            :label="$t('welcome.next')"
            no-caps
            outline
            @click="slide = native_os.name !== '' ? 'native' : 'ng'"
          >
            <q-icon name="fas fa-chevron-right" class="q-ml-sm" size="15px" />
          </q-btn>
        </div>
      </q-carousel-slide>

      <q-carousel-slide
        v-if="native_os.name !== ''"
        name="native"
        class="column no-wrap flex-center"
      >
        <lottie src="lottie/scooter.json" :height="300" />
        <h5 class="q-mb-md q-mt-none text-center">
          {{ $t('welcome.native.title') }}
        </h5>

        <p class="text-center scroll">
          {{ $t('welcome.native.description') }} {{ native_os.name }}.
          <br />
          {{ $t('welcome.native.description2') }}
          <br />
          {{ $t('welcome.native.description3') }}
        </p>

        <div class="q-mt-lg text-center">
          <q-btn
            :label="
              native_os.ext === 'PWA'
                ? `${$t('welcome.native.install')} ${native_os.ext}`
                : `${$t('welcome.native.download')} ${native_os.ext}`
            "
            no-caps
            outline
            :color="native_os.color"
            @click="download(native_os.ext)"
          >
            <q-icon :name="native_os.icon" class="q-ml-sm" size="15px" />
          </q-btn>
        </div>

        <div class="q-mt-lg text-center">
          <q-btn
            :label="$t('welcome.skip')"
            no-caps
            outline
            @click="slide = 'ng'"
          >
            <q-icon name="fas fa-chevron-right" class="q-ml-sm" size="15px" />
          </q-btn>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="ng" class="column no-wrap flex-center">
        <lottie src="lottie/ng_dev.json" :height="200" />
        <div class="text-center scroll q-mt-md">
          <p class="text-subtitle1">{{ $t('welcome.ng.thanks') }}</p>
          <p class="q-my-none">{{ $t('welcome.ng.iam') }}</p>
          <p>
            {{ $t('welcome.ng.website') }}
            <a
              href="https://www.nunogois.com"
              class="welcome-link"
              target="_blank"
              >website</a
            >.
          </p>
          <p class="q-my-none">
            {{ $t('welcome.ng.bolt') }}
            <a href="https://quasar.dev/" class="welcome-link" target="_blank"
              >Quasar Framework</a
            >,
            <a href="https://supabase.com/" class="welcome-link" target="_blank"
              >Supabase</a
            >
            {{ $t('and') }}
            <a
              href="https://www.getunleash.io/"
              class="welcome-link"
              target="_blank"
              >Unleash</a
            >.
          </p>
          <p class="q-my-none">
            {{ $t('welcome.ng.github') }}
            <a
              href="https://github.com/nunogois"
              class="welcome-link"
              target="_blank"
              >GitHub</a
            >!
          </p>
        </div>

        <div class="q-mt-lg text-center">
          <q-btn
            :label="$t('welcome.next')"
            no-caps
            outline
            @click="slide = 'done'"
          >
            <q-icon name="fas fa-chevron-right" class="q-ml-sm" size="15px" />
          </q-btn>
        </div>
      </q-carousel-slide>

      <q-carousel-slide name="done" class="column no-wrap flex-center">
        <lottie src="lottie/rocket.json" :height="200" />
        <h5 class="q-mb-md q-mt-none text-center">
          {{ $t('welcome.ready.title') }}
        </h5>
        <p class="text-center">
          {{ $t('welcome.ready.settings1') }}<br />
          {{ $t('welcome.ready.settings2') }}<br /><br />
          <q-icon name="menu" size="lg" />
          <br /><br />
          {{ $t('welcome.ready.glhf') }}
        </p>
        <div class="q-mt-lg text-center">
          <q-btn
            icon="fas fa-bolt"
            :label="$t('welcome.ready.start')"
            outline
            no-caps
            @click="done"
          />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>

<style lang="sass">
.q-carousel__navigation-icon
    font-size: 5px !important
.line-break
  white-space: pre-line
.welcome-link
  text-decoration: none
  color: #2c8aff
</style>
