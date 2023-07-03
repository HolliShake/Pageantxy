<script setup>
import useRegisterStore from '@/stores/register.store'

const parameters = defineProps({
  registerId: {
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

const onSubmit = async () => {

  registerStore.deleteRegistered(parameters.registerId)
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
        color="error"
      >
        Delete contest
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Delete registered candidate?">
      <VCardText>
        Confirm deletion of registered candidate <strong>{{ formState.candidate?.lastName }}, {{ formState.candidate?.firstName }}</strong>?
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
