<script setup>
import SelectCandidate from '@/components/pageantxy/candidates/SelectCandidate.vue'
import SelectActiveContest from '@/components/pageantxy/contests/SelectActiveContest.vue'
import useCandidateStore from '@/stores/candidate.store'
import useContestStore from '@/stores/contest.store'
import useRegisterStore from '@/stores/register.store'
import { nextTick, watch } from 'vue'

const parameters = defineProps({
  registerId: {
    type: [Number, null],
    required: true,
  },
  eventId: {
    type: [Number, null],
    required: true,
  },
  icon: {
    type: Boolean,
    default: true,
  },
})

const formState = ref({
  candidateId: null,
  candidate: null,
  contestId: null,
  contest: null,
})

const isDialogVisible = ref(false)
const registerStore = useRegisterStore()
const contestStore = useContestStore()
const candidateStore = useCandidateStore()
const refVForm = ref(null)
const submitted = ref(false)


watch(isDialogVisible, () => { 
  if (!isDialogVisible.value || parameters.registerId <= 0) return

  // set
  registerStore.getRegisteredById(parameters.registerId)
    .then(r => { 
      Object.assign(formState.value, r)
    })
}, { deep: true })

watch(formState, () => {

  if (formState.value.contestId <= 0 || formState.value.candidateId <= 0) return

  contestStore.getContestById(formState.value.contestId)
    .then(c => {
      formState.value.contest = c
    })

  candidateStore.getCandidateById(formState.value.candidateId)
    .then(c => {
      formState.value.candidate = c
    })
  
}, { deep: true })

const onSubmit = async () => {

  if (submitted.value) return

  submitted.value = true

  if (await refVForm.value.validate())
  {
    registerStore.updateRegistered(parameters.registerId, formState.value)
      .then(() => { 
        isDialogVisible.value = false
        submitted.value = false
        nextTick(() => {
          refVForm.value?.reset()
          refVForm.value.resetValidation()
        })
      })
      .catch(() => submitted.value = false)
  }
  else
  {
    submitted.value = false
  }
  
}
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
        v-if="parameters.icon"
        v-bind="props"
        variant="text"
        icon="tabler-edit"
        size="x-small"
        rounded="circle"
        color="secondary"
      />
      <VBtn
        v-else
        v-bind="props"
        block
        color="success"
      >
        Update Registered
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Update a registered candidate?">
      <VCardText>
        <VForm ref="refVForm">
          <VRow>
            <VCol cols="12">
              <SelectActiveContest
                v-model="formState.contestId"
                :event-id="parameters.eventId"
                is-required
              />
            </VCol>
            <VCol cols="12">
              <SelectCandidate v-model="formState.candidateId" />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn
          color="secondary"
          variant="tonal"
          @click="isDialogVisible = false"
        >
          Cancel
        </VBtn>
        <VBtn @click="onSubmit">
          Update
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>


