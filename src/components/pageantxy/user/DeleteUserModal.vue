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
  firstName: '',
  lastName: '',
  address: '',
  userName: '',
  email: '',
  picture: '',
  role: '',
  isAdminVerified: false,
})

const userStore = useUserStore()
const refVForm = ref()
const submitted = ref(false)
const isDialogVisible = ref(false)

watch(isDialogVisible, () => {

  if (!isDialogVisible.value || parameters.userId <= 0) return console.log('returned')

  userStore.getUserById(parameters.userId)
    .then(u => {
      Object.assign(formState.value, u)
    })
}, { deep: true, immediate: true })

const onSubmit = async () => {

  userStore.deleteUser(parameters.userId)
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
        color="error"
      >
        <VIcon
          start
          icon="tabler-trash"
        />
        Delete user
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Delete user?">
      <VCardText>
        Confirm deletion of <strong>{{ formState.lastName }}, {{ formState.firstName }}</strong> user?
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
