<script setup>
const parameters = defineProps({
  contestId: {
    type: [Number, null],
    required: true,
  },
})


const isDialogVisible = ref(false)


watch(isDialogVisible, () => { 
  if (!isDialogVisible.value || parameters.registerId <= 0) return


}, { deep: true })

const onSubmit = async () => {

  
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
        POST
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
