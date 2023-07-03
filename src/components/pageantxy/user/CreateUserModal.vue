<script setup>
import { alphaDashValidator, confirmedValidator, emailValidator, requiredValidator } from '@/@core/utils/validators'
import Roles from '@/defaults/Roles'
import useAuthStore from '@/stores/auth.store'
import { nextTick } from 'vue'

const availableRoles = ref([
  { title: 'admin', value: Roles.Admin },
  { title: 'judge', value: Roles.Judge },
])

const formState = ref({
  firstName: '',
  lastName: '',
  address: '',
  userName: '',
  email: '',
  password: '',
  picture: '',
  role: availableRoles.value[0].value,
  isAdminVerified: true,
})


const errors = ref({
  email: [],
  userName: [],
})

const confirmPassword = ref('')

const isDialogVisible = ref(false)
const authStore = useAuthStore()
const refVForm = ref(null)
const submitted = ref(false)

const onSubmit = async () => {

  if (submitted.value) return

  submitted.value = true

  if (await refVForm.value.validate())
  {
    authStore.register(formState.value)
      .then(() => { 
        isDialogVisible.value = false
        submitted.value = false
        nextTick(() => {
          refVForm.value?.reset()
          refVForm.value.resetValidation()
        })
      })
      .catch(err => {
        submitted.value = false

        // console.log('>>>', err)
        err.forEach(error => {
          // eslint-disable-next-line sonarjs/no-small-switch
          switch (error.code)
          {
          case 'DuplicateEmail': {
            errors.value.email.push(error.description)
            break
          }
          case 'DuplicateUserName': {
            errors.value.userName.push(error.description)
            break
          }
          }
        })
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

        Create new user
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Create a new user?">
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
            <VCol cols="12">
              <VTextField
                v-model="formState.address"
                label="Address"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="formState.email"
                type="email"
                label="Email"
                :rules="[requiredValidator, emailValidator]"
                :error-messages="errors.email"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="formState.userName"
                autocomplete="new-username"
                label="UserName"
                :rules="[requiredValidator, alphaDashValidator]"
                :error-messages="errors.userName"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="formState.password"
                autocomplete="new-password"
                type="password"
                label="Password"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="confirmPassword"
                type="password"
                label="Confirm Password"
                :rules="[requiredValidator, confirmedValidator(confirmPassword, formState.password)]"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="formState.role"
                label="Role"
                :items="availableRoles"
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
          Create
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
