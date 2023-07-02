<script setup>
import Group from '@/defaults/Group'
import useCandidateStore from '@/stores/candidate.store'

const parameters = defineProps({
  candidateId: {
    type: [Number, null],
    required: true,
  },
  icon: {
    type: Boolean,
    default: true,
  },
})

const formState = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  candidateNumber: 0,
  group: Group[0],
  representation: '',
  picture: '',
})

const isDialogVisible = ref(false)
const candidateStore = useCandidateStore()
const refVForm = ref(null)
const submitted = ref(false)

watch(isDialogVisible, () => {

  if (!isDialogVisible.value || parameters.candidateId <= 0) return

  // Query
  candidateStore.getCandidateById(parameters.candidateId)
    .then(candidate => { 
      Object.assign(formState.value, candidate)
    })
  
}, { deep: true })

const onSubmit = async () => {

  candidateStore.deleteCandidate(parameters.candidateId)
    .then(() => {
      isDialogVisible.value = false
      submitted.value = false
    })
  
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
        icon="tabler-trash"
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
        Delete Candidate
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Delete candidate">
      <VCardText>
        Confirm deletion of candidate <strong>{{ formState.lastName }}, {{ formState.firstName }}</strong>?
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
