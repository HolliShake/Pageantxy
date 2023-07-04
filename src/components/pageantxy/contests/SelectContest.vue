<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import useContestStore from '@/stores/contest.store'
import { onMounted, watch } from 'vue'

const props = defineProps({
  eventId: {
    type: [Number, null],
    default: null,
  },
  modelValue: {
    type: [Number, null],
    default: null,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])


const contestStore = useContestStore()
const selectedContest = ref(null)

const activeContests = computed(() => {

  let active = contestStore.getContests.find(c => c.isActive)

  return contestStore.getContests
    .sort((a, b) => (a.contestOrder - b.contestOrder))
    .filter(c => c.eventId == props.eventId)

    // 
    .filter(c => (active == undefined || active == null) ? true : c.contestOrder <= active.contestOrder)
    .map(c => ({
      title: c.contestName,
      value: c.id,
      isActive: c.isActive,
      isLocked: c.isLocked,
    }))
})

watch(props, () => { 
  selectedContest.value = props.modelValue
}, { deep: true, immediate: true })

watch(activeContests, () => {
  selectedContest.value = activeContests.value.find(c => c.isActive)?.value ?? null
}, { deep: true, immediate: true })

watch(selectedContest, () => {
  emit('update:modelValue', selectedContest.value)
}, { deep: true, immediate: true })

onMounted(() => {
  contestStore.fetchContests()
})

//
</script>

<template>
  <VSelect
    v-model="selectedContest"
    label="Contest"
    :items="activeContests"
    :rules="[(props.isRequired) ? requiredValidator : () => true]"
  />
</template>

