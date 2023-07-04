<script setup>
import useAuthStore from '@/stores/auth.store'
import useContestStore from '@/stores/contest.store'
import useScoreStore from '@/stores/score.store'
import { betweenValidator, requiredValidator } from '@core/utils/validators'
import { computed, onMounted, watch } from 'vue'

const props = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
  candidateId: {
    type: [Number, null],
    required: true,
  },
})

const authStore = useAuthStore()
const scoreStore = useScoreStore()
const contestStore = useContestStore()

// score
const scoreId = ref(null)
const scoreLoaded = computed(() => scoreStore.scoresLoaded)
const scoreSubmitted = ref(false)

const formState = ref({
  judgeId: authStore.getId,
  contestId: props.contestId,
  contest: null,
  candidateId: props.candidateId,
  candidate: null,
  scoreValue: 0,
})

const contestLoaded = computed(() => contestStore.contestsLoaded)

const contestData = ref({
  contestName: '',
  contestDescription: '',
  contestOrder: 0,
  weight: 0,
  inputMin: 0,
  inputMax: 0,
  eventId: 0,
  isLocked: true,
  isActive: true,
})

watch(scoreStore, () => { 

  let score = scoreStore.getScores
    .find(s => (s.contestId == props.contestId) && (s.candidateId == props.candidateId) && (s.judgeId == authStore.getId)) ?? null
  if (score)
  {
    scoreId.value = score.id
    Object.assign(formState.value, score)
  }

  contestStore.getContestById(props.contestId)
    .then(c => {
      Object.assign(contestData.value, c)
    })
  
}, { deep: true, immediate: true })


const onSubmit = async () => { 

  if (scoreSubmitted.value) return

  scoreSubmitted.value = true

  // create mode
  if (scoreId.value == null)
  {
    scoreStore.createScore(formState.value)
      .then(() => {
        scoreSubmitted.value = false
      })
      .catch(() => scoreSubmitted.value = false)
  }

  // update mode
  else {
    scoreStore.updateScore(scoreId.value, formState.value)
      .then(() => {
        scoreSubmitted.value = false
      })
      .catch(() => scoreSubmitted.value = false)
  }
  
}

onMounted(() => {
  scoreStore.fetchAllScores()
})

//
</script>

<template>
  <div class="demo-space-x flex-nowrap">
    <VTextField
      v-model="formState.scoreValue"
      type="number"
      :rules="[requiredValidator, betweenValidator(formState.scoreValue, contestData.inputMin, contestData.inputMax)]"
    /> 
    <VBtn @click="onSubmit">
      {{ (scoreId == null) ? 'SAVE' : 'EDIT' }}
    </VBtn>
  </div>
</template>

