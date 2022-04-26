<script setup lang="ts">
import { ref } from 'vue'
import { useSession } from 'stores/session'
import { supabase } from 'boot/supabase'
import LanguagePicker from 'components/LanguagePicker.vue'

const session = useSession()
const rightDrawerOpen = ref(false)

const logout = () => {
  session.clear()
  supabase.auth.signOut()
}
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar class="toolbar-main">
        <q-toolbar-title class="toolbar-title">
          <div class="app-title cursor-pointer" @click="$router.push('/')">
            <q-icon name="fas fa-bolt" class="q-mr-sm" />
            Bolt
          </div>
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" behavior="desktop" overlay>
      <q-list>
        <q-item class="q-py-none">
          <q-item-section avatar>
            <q-icon name="fas fa-globe-americas" />
          </q-item-section>
          <q-item-section>
            <language-picker v-model="session.preferences.lang" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="fas fa-palette" />
          </q-item-section>
          <q-item-section>
            <div class="row items-center">
              <div class="col-auto text-right">
                <q-icon name="fas fa-sun" color="yellow-8" />
              </div>
              <div class="col-auto">
                <q-toggle v-model="session.preferences.dark" size="sm" />
              </div>
              <div class="col-auto text-left">
                <q-icon name="fas fa-moon" />
              </div>
            </div>
            <q-item-label caption>
              {{ $t('drawer.caption.theme') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon name="fas fa-flask" />
          </q-item-section>
          <q-item-section>
            <div class="row">
              <q-checkbox
                v-model="session.preferences.beta"
                :label="$t('welcome.beta.label')"
                dense
                size="xs"
              />
            </div>
            <q-item-label caption>
              {{ $t('drawer.caption.beta') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable to="/status">
          <q-item-section avatar>
            <q-icon name="fas fa-sliders" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('drawer.status') }}</q-item-label>
            <q-item-label caption>
              {{ $t('drawer.caption.status') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item
          clickable
          tag="a"
          href="https://github.com/nunogois/bolt"
          target="_blank"
        >
          <q-item-section avatar>
            <q-icon name="fab fa-github" />
          </q-item-section>
          <q-item-section>
            <q-item-label>GitHub</q-item-label>
            <q-item-label caption>
              {{ $t('drawer.caption.github') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          tag="a"
          href="https://www.nunogois.com"
          target="_blank"
        >
          <q-item-section avatar>
            <q-icon name="fas fa-user" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nuno Góis</q-item-label>
            <q-item-label caption>
              {{ $t('drawer.caption.website') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="fas fa-arrow-right-from-bracket" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('drawer.logout') }}</q-item-label>
            <q-item-label caption>
              {{ $t('drawer.caption.logout') }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="sass">
.toolbar-main
  max-width: 600px
  margin: auto

.toolbar-title, .toolbar-title > div
  display: flex
  align-items: center
</style>
