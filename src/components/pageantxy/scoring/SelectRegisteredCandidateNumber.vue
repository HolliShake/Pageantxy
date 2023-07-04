
<script setup>
import useRegisterStore from '@/stores/register.store'

const props = defineProps({
  contestId: {
    type: [Number, null],
    default: null,
  },
  modelValue: {
    type: [Number, String, null],
    default: null,
  },
  gender: {
    type: String,
    default: 'all',
  },

})

const emit = defineEmits(['update:modelValue'])

const registeredStore = useRegisterStore()
const selectedRegistered = ref(null)

const registeredCandidates = computed(() => {

  return [
    { title: 'all', value: 'all' },
    ...(registeredStore.getRegistered
      .sort((a, b) => (a.candidate.candidateNumber - b.candidate.candidateNumber))
      .filter(rc => rc.contestId == props.contestId)
      .filter(rc => (props.gender == 'all') || rc.candidate?.group == props.gender)
      .map(rc => ({
        title: `Candidate no # ${rc.candidate.candidateNumber}`,
        value: rc.id,
      }))),
  ]
})

watch(props, () => { 
  selectedRegistered.value = props.modelValue
}, { deep: true, immediate: true })

watch(registeredCandidates, () => {
  selectedRegistered.value = registeredCandidates.value[0]?.value ?? null
}, { deep: true, immediate: true })

watch(selectedRegistered, () => {
  emit('update:modelValue', selectedRegistered.value)
}, { deep: true, immediate: true })

onMounted(() => {
  registeredStore.fetchRegistered()
})
</script>

<template>
  <VSelect
    v-model="selectedRegistered"
    label="Filter by candidate no."
    :items="registeredCandidates"
  />
</template>

