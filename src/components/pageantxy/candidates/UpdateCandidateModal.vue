<script setup>
import PickImageInput from '@/components/global/PickImageInput.vue'
import Group from '@/defaults/Group'
import useCandidateStore from '@/stores/candidate.store'
import useFileStore from '@/stores/file.store'
import { integerValidator, requiredValidator } from '@core/utils/validators'
import { nextTick } from 'vue'

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

const imageObject = ref(null)
const imageDisplay = ref(null)

const isDialogVisible = ref(false)
const fileStore = useFileStore()
const candidateStore = useCandidateStore()
const refVForm = ref(null)
const submitted = ref(false)

watch(isDialogVisible, () => {

  if (!isDialogVisible.value || parameters.candidateId <= 0) return

  // Query
  candidateStore.getCandidateById(parameters.candidateId)
    .then(candidate => { 
      Object.assign(formState.value, candidate)
      imageDisplay.value = candidate.picture
    })
  
}, { deep: true })

const onSubmit = async () => {

  if (submitted.value) return

  submitted.value = true

  if (await refVForm.value.validate())
  {
    if (imageObject.value != null)
    {
      fileStore.uploadFile(imageObject.value)
        .then(file => {
          candidateStore.updateCandidate(parameters.candidateId, { ...formState.value, picture: file })
            // eslint-disable-next-line promise/no-nesting
            .then(() => {
              isDialogVisible.value = false
              submitted.value = false
              nextTick(() => {
                refVForm.value?.reset()
                refVForm.value.resetValidation()
              })
            })
            // eslint-disable-next-line promise/no-nesting
            .catch(() => submitted.value = false)
        })
        .catch(() => submitted.value = false)
    }
    else
    {
      candidateStore.updateCandidate(parameters.candidateId, formState.value)
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
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="formState.lastName"
                label="Lastname"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="formState.firstName"
                label="Firstname"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="7"
            >
              <VSelect
                v-model="formState.group"
                label="Group"
                :items="Group"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="5"
            >
              <VTextField
                v-model="formState.candidateNumber"
                label="Candidate no(#)."
                :rules="[requiredValidator, integerValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="formState.representation"
                label="Representation"
                :rules="[requiredValidator]"
                auto-grow
                :rows="3"
                :max-row="5"
              />
            </VCol>
            <VCol cols="12">
              <PickImageInput
                v-model="imageObject"
                v-model:displayOnly="imageDisplay"
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
