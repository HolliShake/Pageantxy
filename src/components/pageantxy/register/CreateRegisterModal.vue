<script setup>
import SelectCandidate from '@/components/pageantxy/candidates/SelectCandidate.vue'
import useRegisterStore from '@/stores/register.store'
import { nextTick } from 'vue'
import GenericSelectContest from '../contests/GenericSelectContest.vue'

const parameters = defineProps({
  eventId: {
    type: [Number, null],
    required: true,
  },
})

const formState = ref({
  candidateId: null,
  contestId: null,
})

const isDialogVisible = ref(false)
const registerStore = useRegisterStore()
const refVForm = ref(null)
const submitted = ref(false)

const onSubmit = async () => {

  if (submitted.value) return

  submitted.value = true

  if (await refVForm.value.validate())
  {
    registerStore.createRegistered(formState.value)
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
        v-bind="props"
        block
      >
        <VIcon
          start
          icon="tabler-user-plus"
        />

        Register candidate
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Register a candidate?">
      <VCardText>
        <VForm ref="refVForm">
          <VRow>
            <VCol cols="12">
              <GenericSelectContest
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
          Create
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>


