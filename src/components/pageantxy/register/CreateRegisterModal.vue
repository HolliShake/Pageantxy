<script setup>
import SelectCandidate from '@/components/pageantxy/candidates/SelectCandidate.vue'
import useRegisterStore from '@/stores/register.store'

const parameters = defineProps({
  eventId: {
    type: [Number, null],
    required: true,
  },
  contestId: {
    type: [Number, null],
    required: true,
  },
})

const candidates = ref([])

const isDialogVisible = ref(false)
const registerStore = useRegisterStore()
const refVForm = ref(null)
const submitted = ref(false)

const onSubmit = async () => {

  if (submitted.value) return

  submitted.value = true

  if (await refVForm.value.validate())
  {
    candidates.value.forEach(cId => { 
      registerStore.createRegistered({ contestId: parameters.contestId, candidateId: cId })
        .then(() => { 
          isDialogVisible.value = false
          submitted.value = false
        })
        .catch(() => submitted.value = false)
    })
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
              <SelectCandidate v-model="candidates" />
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


