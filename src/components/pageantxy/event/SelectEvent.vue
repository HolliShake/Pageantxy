<script setup>
import useEventStore from '@/stores/event.store'
import { watch, watchEffect } from 'vue'


const props = defineProps({
  modelValue: {
    type: [Number, null],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const eventStore = useEventStore()

const events = computed(() => {
  return eventStore.getEvents
    .sort((a, b) => b.id - a.id)
    .map(e => ({
      title: e.eventName,
      value: e.id,
    }))
})

const selectedEvent = ref(null)


watch(props, () => {
  if (props.modelValue == null) return

  // set
  selectedEvent.value = props.modelValue
}, { deep: true })

watch(events, () => {
  selectedEvent.value = events.value[0]?.value ?? null
}, { deep: true, immediate: true })

watch(selectedEvent, () => {
  emit('update:modelValue', selectedEvent.value)
}, { deep: true, immediate: true })

watchEffect(() => {
  eventStore.fetchEvents()
})


//
</script>

<template>
  <VSelect
    v-model="selectedEvent"
    label="Select event"
    :items="events"
  />
</template>
