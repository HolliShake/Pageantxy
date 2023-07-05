<script setup>
import useAuthStore from '@/stores/auth.store'
import useContestStore from '@/stores/contest.store'
import useLogStore from '@/stores/log.store'
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
const logStore = useLogStore()
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
  isActive: false,
})


const hasPosted = computed(() => {
  return !(!(logStore.getLogs
    .find(l => (l.contestId == props.contestId) && (l.userId == authStore.getId)) ?? null))
})


watch(scoreStore, () => { 

  let score = scoreStore.getScores
    .find(s => (s.contestId == props.contestId) && (s.candidateId == props.candidateId) && (s.judgeId == authStore.getId)) ?? null
  if (score)
  {
    scoreId.value = score.id
    Object.assign(formState.value, score)
  }
  
}, { deep: true, immediate: true })

watch(props, () => {
  
  if (props.contestId <= 0) return
  
  // get
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
  scoreStore.fetchAllScoresByJudgeId(authStore.getId)
  logStore.fetchAllLogsByJudgeId(authStore.getId)
})

//
</script>

<template>
  <VProgressCircular
    v-if="!(scoreLoaded || contestLoaded)"
    indeterminate
  />
  
  <div
    v-if="((contestData.isActive && !contestData.isLocked) && !hasPosted)"
    class="demo-space-x flex-nowrap"
  >
    <VTextField
      v-model="formState.scoreValue"
      type="number"
      :rules="[requiredValidator, betweenValidator(formState.scoreValue, contestData.inputMin, contestData.inputMax)]"
    /> 
    <VBtn @click="onSubmit">
      {{ (!scoreLoaded) ? '...' : ((scoreId == null) ? 'SAVE' : 'EDIT') }}
    </VBtn>
  </div>
  <ScoreValue
    v-else
    :score="formState.scoreValue"
    :min="contestData.inputMin"
    :max="contestData.inputMax"
  />
</template>

