<script setup>
import useContestStore from '@/stores/contest.store'

const parameters = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
  icon: {
    type: Boolean,
    default: true,
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

const isDialogVisible = ref(false)
const contestStore = useContestStore()
const refVForm = ref(null)
const submitted = ref(false)


watch(isDialogVisible, () => { 
  if (!isDialogVisible.value || parameters.contestId <= 0) return

  // set
  contestStore.getContestById(parameters.contestId)
    .then(c => {
      Object.assign(formState.value, c)
    })
})

const onSubmit = async () => {

  contestStore.deleteContest(parameters.contestId)
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
        Delete contest
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Delete contest">
      <VCardText>
        Confirm deletion of contest <strong>{{ formState.contestName }}</strong>?
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
