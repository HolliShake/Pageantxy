
<script setup>
import LinearRegisteredList from './LinearRegisteredList.vue'

const props = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
})

//
</script>

<template>
  <VCardText>
    <LinearRegisteredList :contest-id="props.contestId" />
  </VCardText>
</template>
