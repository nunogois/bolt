import { computed } from 'vue'

const useModel = (
  props: Record<string, unknown>,
  emit: (e: string, value: unknown) => void,
  name = 'modelValue'
) =>
  computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value)
  })

export { useModel }
