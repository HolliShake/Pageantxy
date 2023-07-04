
<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import PickImageInput from '@/components/global/PickImageInput.vue'
import useFileStore from '@/stores/file.store'
import useUserStore from '@/stores/user.store'
import NoImageAvailable from '@images/pageantxy/NoImageAvailable.png'
import { nextTick, ref, watch } from 'vue'
import DeleteUserModal from './DeleteUserModal.vue'
import VerifyUserModal from './VerifyUserModal.vue'

const props = defineProps({
  modelValue: {
    type: [String, null],
    required: true,
  },
  includeControl: {
    type: Boolean,
    default: true,
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

const image = ref(null)

const userStore = useUserStore()
const fileStore = useFileStore()
const refVForm = ref()
const submitted = ref(false)

watch(props, () => {

  if (props.modelValue <= 0) return

  userStore.getUserById(props.modelValue)
    .then(u => {
      Object.assign(formState.value, u)
    })
}, { deep: true, immediate: true })


function computedPicture(picture)
{
  if (!picture) return NoImageAvailable

  if (picture.length <= 0) 
    return NoImageAvailable

  return `${import.meta.env.VITE_APP_APP_URL}/files/${picture}`
}

function parseAbilities(roles)
{
  if (!roles) return []
  
  let abilities = JSON.parse(roles)
  
  return Array.from(new Set(abilities.map(r => (r.subject == 'all') ? 'admin' : r.subject)))
}

const resolveStatusVariant = status => {
  if (status)
    return {
      color: 'primary',
      text: 'verified',
    }
  else
    return {
      color: 'error',
      text: 'unverified',
    }
}

const onSubmit = async () => {

  if (submitted.value || props.modelValue <= 0) return

  submitted.value = true

  if (await refVForm.value.validate())
  {
    if (image.value != null)
    {
      fileStore.uploadFile(image.value)
        .then(file => {
          userStore.updateUser(props.modelValue, { ...formState.value, picture: file })
            // eslint-disable-next-line promise/no-nesting
            .then(() => {
              submitted.value = false
              nextTick(() => {
                refVForm.value.resetValidation()
              })
            })
            // eslint-disable-next-line promise/no-nesting
            .catch(() => submitted.value = false)
        })
    } else {
      userStore.updateUser(props.modelValue, formState.value)
        .then(() => {
          submitted.value = false
          nextTick(() => {
            refVForm.value.resetValidation()
          })
        })
        .catch(() => submitted.value = false)
    }
  }
  else {
    submitted.value = false
  }
  
}

// 
</script>


<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol cols="3">
          <VCard
            rounded="0"
            height="100%"
          >
            <VCardText
              class="h-100 text-center"
              style="background-color: rgb(var(--v-theme-background));"
            >
              <VAvatar
                size="180"
                color="success"
                variant="elevated"
              >
                <VImg
                  rounded="circle"
                  :max-width="180"
                  :src="computedPicture(formState.picture)"
                />
              </VAvatar>
              <br>
              <br>
              <h1 class="text-center font-weight-thin">
                {{ formState.lastName }}, {{ formState.firstName }}
              </h1>
              <div class="d-block text-center">
                <template
                  v-for="(role, idx) in parseAbilities(formState.role)"
                  :key="idx"
                >
                  <span class="text-sm text-disabled">
                    {{ role }}
                  </span>

                  <span v-if="idx < parseAbilities(formState.role).length - 1">, &nbsp;</span>
                </template>
              </div>
            </VCardText>
          </VCard>
        </VCol>
       
        <!--  -->
        <VCol cols="9">
          <VCardText class="text-start">
            <VForm ref="refVForm">
              <VRow>
                <VCol cols="12">
                  <h1 class="text-h1 font-weight-thin">
                    User Info
                  </h1>
                </VCol>
                <VCol cols="7">
                  <VTextField
                    v-model="formState.lastName"
                    label="Lastname"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol cols="5">
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
                <VCol cols="5">
                  <VTextField
                    v-model="formState.userName"
                    label="Username"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <!-- email -->
                <VCol cols="7">
                  <VTextField
                    v-model="formState.email"
                    label="Email"
                    :rules="[requiredValidator]"
                  />
                </VCol>
                <VCol cols="12">
                  <PickImageInput
                    v-model="image"
                    :display-only="formState.picture"
                  />
                </VCol>
                <VCol cols="auto">
                  <VChip
                    :color="resolveStatusVariant(formState.isAdminVerified).color"
                    size="small"
                  >
                    {{ resolveStatusVariant(formState.isAdminVerified).text }}
                  </VChip>
                </VCol>
                <VCol cols="12">
                  <VCardText class="pa-2">
                    <div class="demo-space-x justify-end">
                      <VerifyUserModal
                        v-if="props.includeControl"
                        :user-id="props.modelValue"
                      />

                      <DeleteUserModal
                        v-if="props.includeControl"
                        :user-id="props.modelValue"
                      />

                      <VBtn @click="onSubmit">
                        <VIcon
                          start
                          icon="tabler-edit"
                        />
                        Update
                      </VBtn>
                    </div>
                  </VCardText>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.user-control--avatar-wrapper {
  align-self: flex-start !important;
  padding: 3px;
  border-radius: 360px !important;
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
