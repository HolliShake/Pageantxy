
<script setup>
import SelectEvent from '@/components/pageantxy/event/SelectEvent.vue'
import useContestStore from '@/stores/contest.store'
import { computed } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import ActiveSwitcher from './ActiveSwitcher.vue'
import CreateContestModal from './CreateContestModal.vue'
import DeleteContestModal from './DeleteContestModal.vue'
import LockSwitcher from './LockSwitcher.vue'
import UpdateContestModal from './UpdateContestModal.vue'

const availableFilter = ref([
  { title: 'any', value: 'any' },
  { title: 'open', value: false },
  { title: 'locked', value: true },
])

const contestStore = useContestStore()
const searchQuery = ref('')
const filterStatus = ref(availableFilter.value[0].value)
const event = ref(null)
const contests = computed(() => contestStore.getContests)

const filteredContest = computed(() => { 
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  let result = contests.value
    .sort((a, b) => (a.contestOrder - b.contestOrder))
    .filter(c => c.contestName.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter(c => filterStatus.value == 'any' ? true : c.isLocked == filterStatus.value)

  if (event.value != null)
    return result.filter(c => c.eventId == event.value) 
  
  return result
})

const headers = ref([
  {
    title: 'CONTEST NAME',
    key: 'contestName',
  },
  {
    title: 'WEIGHT',
    key: 'weight',
  },
  {
    title: 'MIN SCORE',
    key: 'inputMin',
  },
  {
    title: 'MAX SCORE',
    key: 'inputMax',
  },
  {
    title: 'ORDER',
    key: 'contestOrder',
  },
  {
    title: 'LOCK',
    key: 'lock',
  },
  {
    title: 'ACTIVE',
    key: 'active',
  },
  {
    title: 'ACTION',
    key: 'action',
  },
])

onMounted(() => {
  contestStore.fetchContests()
})

const resolveStatusVariant = status => {
  if (!status)
    return {
      color: 'primary',
      text: 'open',
    }
  else
    return {
      color: 'error',
      text: 'locked',
    }
}

const resolveContestStausVariant = status => {
  if (status)
    return {
      color: 'primary',
      text: 'active',
    }
  else
    return {
      color: 'secondary',
      text: 'inactive',
    }
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="3"
    >
      <VCard>
        <VCardText>
          <VRow>
            <!-- search -->
            <VCol cols="12">
              <VTextField
                v-model="searchQuery"
                label="Search contest"
              />
            </VCol>
            <!-- Filter status -->
            <VCol cols="12">
              <VSelect
                v-model="filterStatus"
                label="Filter status"
                :items="availableFilter"
              />
            </VCol>
            <!-- event -->
            <VCol cols="12">
              <SelectEvent v-model="event" />
            </VCol>
            <!-- control -->
            <VCol
              cols="12"
              order-last
            >
              <CreateContestModal />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- table -->
    <VCol
      cols="12"
      md="9"
    >
      <VCard title="Contests">
        <VCardText>
          <VDataTable
            class="table-header-bg"
            :headers="headers"
            :items="filteredContest"
            :items-per-page="5"
          >
            <!-- status -->
            <template #item.status="{ item }">
              <VChip
                :color="resolveStatusVariant(item.raw.isLocked).color"
                size="small"
              >
                {{ resolveStatusVariant(item.raw.isLocked).text }}
              </VChip>
            </template>
            <!-- lock -->
            <template #item.lock="{ item }">
              <LockSwitcher :contest-id="item.raw.id" />
            </template>
            <!-- active -->
            <template #item.active="{ item }">
              <ActiveSwitcher :contest-id="item.raw.id" />
            </template>
            <!-- action -->
            <template #item.action="{ item }">
              <UpdateContestModal :contest-id="item.raw.id" />
              <DeleteContestModal :contest-id="item.raw.id" />
            </template>
          </VDataTable>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
