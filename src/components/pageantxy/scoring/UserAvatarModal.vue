<script setup>
const parameters = defineProps({
  picture: {
    type: [String, null],
    default: null,
  },
})

const isDialogVisible = ref(false)

const computedImage = picture => {
  console.log('>>', `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`)
  
  return `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    persistent
    scrollable
    max-width="300"
    class="v-dialog-sm"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VAvatar
        v-bind="props"
        size="64"
        rounded="lg"
      >
        <VImg
          cover
          :src="computedImage(parameters.picture)"
          width="64"
          max-width="64"
        />
      </VAvatar>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard>
      <VImg
        width="300"
        :src="computedImage(parameters.picture)"
      />
    </VCard>
  </VDialog>
</template>
