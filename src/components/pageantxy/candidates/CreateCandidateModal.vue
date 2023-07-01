<script setup>
import Group from '@/defaults/Group'
import { integerValidator, requiredValidator } from '@core/utils/validators'

const isDialogVisible = ref(false)


const formState = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  candidateNumber: 0,
  group: Group[0],
  representation: '',
  picture: '',
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
      <VBtn v-bind="props">
        <VIcon
          start
          icon="tabler-user-plus"
        />

        Create candidate
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Create a new candidate?">
      <VCardText>
        <VForm>
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
        <VBtn @click="isDialogVisible = false">
          Create
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
