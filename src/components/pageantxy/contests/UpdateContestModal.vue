<script setup>
import useContestStore from '@/stores/contest.store'
import { integerValidator, requiredValidator } from '@core/utils/validators'
import { nextTick, watch } from 'vue'

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

  if (submitted.value) return

  submitted.value = true

  if (await refVForm.value.validate())
  {
    contestStore.updateContest(parameters.contestId, formState.value)
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
        Update Candidate
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Update candidate">
      <VCardText>
        <VForm ref="refVForm">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="formState.contestName"
                label="Contest name"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="formState.contestDescription"
                label="Contest description"
                :rules="[requiredValidator]"
                :rows="3"
                :max-row="5"
                auto-grow
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="formState.weight"
                label="weight"
                :rules="[requiredValidator, integerValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="formState.inputMin"
                label="Input(min)"
                :rules="[requiredValidator, integerValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="formState.inputMax"
                label="Input(max)"
                :rules="[requiredValidator, integerValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="formState.contestOrder"
                label="Contest order"
                :rules="[requiredValidator, integerValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="8"
            >
              <SelectEvent v-model="formState.eventId" />
            </VCol>
            <VCol
              cols="12"
              md="auto"
            >
              <VCheckbox
                v-model="formState.isLocked"
                label="Is Locked"
              />
            </VCol>
            <VCol
              cols="12"
              md="auto"
            >
              <VCheckbox
                v-model="formState.isActive"
                label="Is Active"
              />
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
