
<script setup>
import LinearRegisteredList from './LinearRegisteredList.vue'

const props = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
  gender: {
    type: String,
    default: 'all',
  },
  candidateNumber: {
    type: [Number, String, null],
    required: true,
  },
})

//
</script>

<template>
  <VCardText>
    <LinearRegisteredList
      :candidate-number="props.candidateNumber"
      :gender="props.gender"
      :contest-id="props.contestId"
    />
  </VCardText>
</template>
