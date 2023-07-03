<script setup>
import useUserStore from '@/stores/user.store'
import { ref } from 'vue'

const parameters = defineProps({
  userId: {
    type: [String, null],
    required: true,
  },
})

const formState = ref({
  isAdminVerified: true,
})

const userStore = useUserStore()
const submitted = ref(false)
const isDialogVisible = ref(false)

watch(isDialogVisible, () => {

  if (!isDialogVisible.value || parameters.userId <= 0) return

  userStore.getUserById(parameters.userId)
    .then(u => {
      Object.assign(formState.value, u)
    })
}, { deep: true, immediate: true })

const onSubmit = async () => {

  if (formState.value.isAdminVerified)
  {
    return (isDialogVisible.value = false)
  }

  userStore.verifyUser(parameters.userId, formState.value)
    .then(() => { 
      isDialogVisible.value = false
      submitted.value = false
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
        v-bind="props"
        color="success"
      >
        <VIcon
          start
          icon="tabler-circle-check"
        />
        Verify user
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Verify user?">
      <VCardText>
        Verify user <strong>{{ formState.lastName }}, {{ formState.firstName }}</strong>?
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
          color="success"
          @click="onSubmit"
        >
          Confirm
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
