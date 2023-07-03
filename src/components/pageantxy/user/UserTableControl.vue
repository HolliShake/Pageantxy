
<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { resolveRoles } from '@/helpers/parseRole'
import useUserStore from '@/stores/user.store'
import { computed, watch } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import CreateUserModal from './CreateUserModal.vue'
import UserControl from './UserControl.vue'

const userStore = useUserStore()

const availableFilter = ref([
  { title: 'any', value: 'any' },
  { title: 'verified', value: true },
  { title: 'unverified', value: false },
])

const searchQuery = ref('')
const selectedStatus = ref(availableFilter.value[0].value)

const headers = ref([
  {
    title: '',
    key: 'data-table-expand',
  },
  {
    title: 'NAME',
    key: 'full_name',
  },
  {
    title: 'USERNAME',
    key: 'userName',
  },
  {
    title: 'EMAIL',
    key: 'email',
  },
  {
    title: 'ROLE',
    key: 'role',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
])

const userList = computed(() => userStore.getUsers)

const filteredUserList = computed(() => { 
  return userList.value
    .filter(u => u.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) || u.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter(u => selectedStatus.value == 'any' || u.isAdminVerified == selectedStatus.value)
})


onMounted(() => { 
  userStore.fetchUsers()
})

watch(userList, () => { 
  console.log(userList.value)
}, { deep: true })

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

//
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="User filters">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="searchQuery"
                label="Search user"
              />
            </VCol>
            <!--  -->
            <VCol
              cols="12"
              md="4"
            >
              <VSelect
                v-model="selectedStatus"
                label="Filter status"
                :items="availableFilter"
              />
            </VCol>
            <!--  -->
            <VCol
              cols="12"
              md="4"
            >
              <CreateUserModal />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    <!--  -->
    <VCol cols="12">
      <VCard title="Registered Users">
        <VCardText>
          <VDataTable
            class="table-header-bg"
            :headers="headers"
            :items="filteredUserList"
            :items-per-page="5"
            expand-on-click
          >
            <!-- Expanded Row Data -->
            <template #expanded-row="slotProps">
              <tr class="v-data-table__tr">
                <td
                  :colspan="headers.length"
                  class="px-0"
                >
                  <VCardText
                    class="text-center"
                    style=" border-radius: 0 !important;background-color: rgb(var(--v-theme-background));"
                  >
                    <UserControl v-model="slotProps.item.raw.id" />
                  </VCardText>
                </td>
              </tr>
            </template>
    
            <!-- full name -->
            <template #item.full_name="{ item }">
              <div class="d-flex align-center">
                <!-- avatar -->
                <VAvatar
                  size="32"
                  :color="item.raw.avatar ? '' : 'primary'"
                  :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
                  :variant="!item.raw.avatar ? 'tonal' : undefined"
                >
                  <VImg
                    v-if="item.raw.avatar"
                    :src="item.raw.avatar"
                  />
                  <span v-else>{{ avatarText(item.raw.firstName) }}</span>
                </VAvatar>

                <div class="d-flex flex-column ms-3">
                  <span class="d-block font-weight-semibold text--primary text-truncate">
                    {{ item.raw.firstName }}, {{ item.raw.lastName }}
                  </span>
                </div>
              </div>
            </template>

            <!-- email -->
            <template #item.email="{ item }">
              {{ item.raw.email }}
            </template>

            <!-- role -->
            <template #item.role="{ item }">
              <div class="demo-space-x">
                <VChip
                  v-for="(rname, index) in resolveRoles(item.raw.role)"
                  :key="index"
                  :color="(rname == 'admin') ? 'primary' : 'secondary'"
                  size="small"
                >
                  {{ rname }}
                </VChip>
              </div>
            </template>

            <!-- status -->
            <template #item.status="{ item }">
              <VChip
                :color="resolveStatusVariant(item.raw.isAdminVerified).color"
                size="small"
              >
                {{ resolveStatusVariant(item.raw.isAdminVerified).text }}
              </VChip>
            </template>
          </VDataTable>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

