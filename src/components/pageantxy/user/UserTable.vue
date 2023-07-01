
<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { resolveRoles } from '@/helpers/parseRole'
import useUserStore from '@/stores/user.store'
import { computed, watch } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

const userStore = useUserStore()

const headers = ref([
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
  <VCard title="Registered Users">
    <VCardText>
      <VDataTable
        class="table-header-bg"
        :headers="headers"
        :items="userList"
        :items-per-page="5"
      >
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
</template>

