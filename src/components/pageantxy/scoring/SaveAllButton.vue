<script setup>
import useAuthStore from '@/stores/auth.store'
import useContestStore from '@/stores/contest.store'
import useLogStore from '@/stores/log.store'
import { watch } from 'vue'

const parameters = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  contestId: {
    type: [Number, null],
    required: true,
  },
})

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


const authStore = useAuthStore()
const logStore = useLogStore()
const contestStore = useContestStore()

const isDialogVisible = ref(false)

const hasPosted = computed(() => {
  return !(!(logStore.getLogs
    .find(l => (l.contestId == parameters.contestId) && (l.userId == authStore.getId)) ?? null))
})

watch(parameters, () => { 

  if (parameters.contestId <= 0) return

  // get
  contestStore.getContestById(parameters.contestId)
    .then(c => {
      Object.assign(contestData.value, c)
    })
  
}, { deep: true, immediate: true })

const onSubmit = async () => {

  parameters.modelValue.forEach(reference => {
    reference?.value?.onSubmit()
  })

  isDialogVisible.value = false
  
}

onMounted(() => {
  logStore.fetchAllLogsByJudgeId(authStore.getId)
})
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    scrollable
    class="v-dialog-sm"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        block
        color="success"
        :disabled="contestData.isLocked || hasPosted"
      >
        SAVE ALL
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Confirm submission?">
      <VCardText>
        Confirm submission of grade? This action cannot be undone.
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          color="secondary"
          variant="tonal"
          @click="isDialogVisible = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="error"
          @click="onSubmit"
        >
          Confirm
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
