
<script setup>
import useContestStore from '@/stores/contest.store'
import { watch } from 'vue'

const props = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
})

const formState = ref({
  contestName: '',
  contestDescription: '',
  contestOrder: 0,
  weight: 0,
  inputMin: 0,
  inputMax: 0,
  eventId: null,
  isLocked: true,
  isActive: false,
})

const isLoaded = ref(false)
const contestStore = useContestStore()

watch(props, () => {

  if (props.contestId <= 0) return

  contestStore.getContestById(props.contestId)
    .then(c => { 
      Object.assign(formState.value, c)
      isLoaded.value = true
    })
  
}, { deep: true, immediate: true })


watch(contestStore, () => {
  contestStore.getContestById(props.contestId)
    .then(c => { 
      Object.assign(formState.value, c)
      isLoaded.value = true
    })
}, { deep: true })


const onSubmit = async () => { 
  if (props.contestId <= 0) return

  if (formState.value.isActive)
    formState.value.isLocked = false
  else
    formState.value.isLocked = true

  contestStore.updateContest(props.contestId, formState.value)
}

//
</script>


<template>
  <VLayout class="d-flex justify-space-center">
    <VSwitch
      v-model="formState.isActive"
      @input="onSubmit"
    />
  </VLayout>
</template>


