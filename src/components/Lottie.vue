<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import lottie from 'lottie-web'

const props = defineProps({
  src: String,
  height: Number,
  width: Number,
  loop: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  speed: {
    type: Number,
    default: 1
  },
  rendererSettings: Object
})

const lottieContainer = ref<Element>()

const style = computed(() => ({
  width: props.width ? `${props.width}px` : '100%',
  height: props.height ? `${props.height}px` : '100%',
  overflow: 'hidden',
  margin: '0'
}))

onMounted(() => {
  if (lottieContainer.value) {
    lottie
      .loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: props.loop,
        autoplay: props.autoplay,
        path: props.src,
        rendererSettings: props.rendererSettings
      })
      .setSpeed(props.speed)
  }
})
</script>

<template>
  <div :style="style" ref="lottieContainer"></div>
</template>
